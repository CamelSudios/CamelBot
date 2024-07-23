import {
  Declare,
  Options,
  type CommandContext,
  createStringOption,
  VoiceChannel,
  SubCommand,
} from 'seyfert';
import GlobalUser from '../../../models/GlobalUser.js';

const options = {
  name: createStringOption({
    description: 'The name of the playlist',
    required: true,
    autocomplete: async (ctx) => {
      const { messages } = ctx.client
        .t((await ctx.fetchGuild())?.preferredLocale || 'en-US')
        .get();
      let user =
        (await GlobalUser.findOne({ id: ctx.user.id })) ||
        (await new GlobalUser({
          id: ctx.user.id,
          music: {
            playlists: [],
          },
        }).save());

      if (user.music.playlists.length === 0)
        ctx.respond([
          {
            name: messages.noPlaylists,
            value: 'no_playlist',
          },
        ]);

      return ctx.respond(
        user.music.playlists.map((p) => ({
          name: p.name,
          value: p.id,
        }))
      );
    },
  }),
};

@Declare({
  name: 'load',
  description: 'Loads a playlist into the queue',
})
@Options(options)
export default class LoadQueue extends SubCommand {
  async run(ctx: CommandContext<typeof options>) {
    if (!ctx.guildId) return;
    const { messages } = ctx.t.get(ctx.guild()!.preferredLocale || 'en-US');

    const vcId = ctx.member!.voice()?.channelId;

    if (!vcId) return ctx.editOrReply({ content: messages.joinIntoAChannel });

    const clientAsMember = await ctx.guild()!.members.fetch(ctx.client.botId)!;

    const vc = (await ctx.member!.voice()?.channel()) as VoiceChannel;

    let clientPerms = await vc.memberPermissions(clientAsMember);

    if (!clientPerms.has('Connect') || !clientPerms.has('Speak'))
      return ctx.editOrReply({
        content: messages.notAbleToJoinOrSpeak,
        flags: 64,
      });

    // Check if exists a player in the guild, if not, create one
    const player =
      ctx.client.lavalink.getPlayer(ctx.guildId!) ||
      ctx.client.lavalink.createPlayer({
        guildId: ctx.guildId!,
        voiceChannelId: vcId,
        textChannelId: ctx.channelId,
        selfDeaf: true,
        selfMute: false,
        volume: ctx.client.defaultVolume,
        instaUpdateFiltersFix: true,
        applyVolumeAsFilter: false,
      });

    // If something went wrong, return an error
    if (!player)
      return ctx.editOrReply({
        content: messages.noGuildPlayer,
      });
    if (!player.connected) await player.connect();

    const { name } = ctx.options;

    const user =
      (await GlobalUser.findOne({ id: ctx.author.id })) ||
      (await new GlobalUser({
        id: ctx.author.id,
        music: {
          playlists: [],
        },
      }).save());
    const playlist = user.music.playlists.find((x) => x.id === name);

    if (!playlist) ctx.editOrReply({ content: messages.playlistDoesNotExist });

    player.queue.splice(0, player.queue.tracks.length);
    player.queue.add(playlist!.tracks);

    if (player.playing === false) player.play();

    ctx.editOrReply({ content: messages.playlistLoaded });
  }
}
