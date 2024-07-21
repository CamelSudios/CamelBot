import { MessageFlags } from 'discord-api-types/v10';
import { SearchResult, SearchPlatform, Track } from 'lavalink-client';
import {
  Declare,
  Options,
  Command,
  CommandContext,
  createStringOption,
  VoiceState,
  GuildMember,
  VoiceChannel,
} from 'seyfert';
import { formatMS_HHMMSS } from '../../structures/utils/time.js';

const autocompleteMap = new Map();

const options = {
  source: createStringOption({
    description: 'The source to search from',
    required: true,
    choices: [
      {
        name: 'Youtube',
        value: 'ytsearch',
      },
      {
        name: 'Spotify',
        value: 'spsearch',
      },
    ],
  }),
  query: createStringOption({
    description: 'The song to play',
    required: true,
    autocomplete: async (interaction) => {
      if (!interaction.guildId) return;
      const vcId = interaction.member!.voice()?.channelId;

      if (!vcId)
        return interaction.respond([
          { name: `Join a voice Channel`, value: 'join_vc' },
        ]);

      const focussedQuery = interaction.getInput();
      if (focussedQuery.length < 1)
        return interaction.respond([
          { name: `No Tracks found`, value: 'nothing_found' },
        ]);

      const player =
        interaction.client.lavalink.getPlayer(interaction.guildId) ||
        interaction.client.lavalink.createPlayer({
          guildId: interaction.guildId,
          voiceChannelId: vcId,
          textChannelId: interaction.channelId,
          selfDeaf: true,
          selfMute: false,
          volume: interaction.client.defaultVolume,
          instaUpdateFiltersFix: true,
        });

      if (!player.connected) {
        await player.connect();
      }

      if (player.voiceChannelId !== vcId)
        return interaction.respond([
          { name: `You need to be in my Voice Channel`, value: 'join_vc' },
        ]);

      const res = (await player.search(
        {
          query: focussedQuery,
          source: interaction.options.getString('source') as SearchPlatform,
        },
        {
          id: interaction.user.id,
          username: interaction.user.username,
          avatar: interaction.user.avatarURL(),
        }
      )) as SearchResult;

      if (!res.tracks.length)
        return await interaction.respond([
          { name: `No Tracks found`, value: 'nothing_found' },
        ]);

      if (autocompleteMap.has(`${interaction.user.id}_timeout`))
        clearTimeout(autocompleteMap.get(`${interaction.user.id}_timeout`));
      autocompleteMap.set(`${interaction.user.id}_res`, res);
      autocompleteMap.set(
        `${interaction.user.id}_timeout`,
        setTimeout(() => {
          autocompleteMap.delete(`${interaction.user.id}_res`);
          autocompleteMap.delete(`${interaction.user.id}_timeout`);
        }, 25000)
      );
      await interaction.respond(
        res.loadType === 'playlist'
          ? [
              {
                name: `Playlist [${res.tracks.length} Tracks] - ${res.playlist?.title}`,
                value: `autocomplete_0`,
              },
            ]
          : res.tracks
              .map((t: Track, i) => ({
                name: `[${formatMS_HHMMSS(t.info.duration)}] ${
                  t.info.title
                } (by ${t.info.author || 'Unknown-Author'})`.substring(0, 100),
                value: `autocomplete_${i}`,
              }))
              .slice(0, 25)
      );
    },
  }),
};

@Declare({
  name: 'play',
  description: 'Plays a song',
})
@Options(options)
export default class Play extends Command {
  async run(ctx: CommandContext<typeof options>) {
    if (!ctx.guildId) return;
    const vcId = ctx.member!.voice()?.channelId;

    if (!vcId)
      return ctx.editOrReply({
        content: `Join a voice Channel`,
        flags: MessageFlags.Ephemeral,
      });

    ctx.deferReply();

    const clientAsMember = await ctx.guild()?.members.fetch(ctx.client.botId)!;

    const vc = (await ctx.member!.voice()?.channel()) as VoiceChannel;

    let clientPerms = await vc.memberPermissions(clientAsMember);

    if (!clientPerms.has('Connect') || !clientPerms.has('Speak'))
      return ctx.editOrReply({
        content: 'I am not able to join your channel / speak in there.',
      });

    const source = ctx.options.source as SearchPlatform;
    const query = ctx.options.query as string;
    console.log(query);

    if (query === 'nothing_found')
      return ctx.editOrReply({ content: `No Tracks found` });
    if (query === 'join_vc')
      return ctx.editOrReply({
        content: `You joined a VC, but redo the Command please.`,
      });

    const fromAutoComplete =
      Number(query.replace('autocomplete_', '')) >= 0 &&
      autocompleteMap.has(`${ctx.author.id}_res`) &&
      autocompleteMap.get(`${ctx.author.id}_res`);

    if (autocompleteMap.has(`${ctx.author.id}_res`)) {
      if (autocompleteMap.has(`${ctx.author.id}_timeout`))
        clearTimeout(autocompleteMap.get(`${ctx.author.id}_timeout`));
      autocompleteMap.delete(`${ctx.author.id}_res`);
      autocompleteMap.delete(`${ctx.author.id}_timeout`);
    }
    console.log(fromAutoComplete);

    const player =
      ctx.client.lavalink.getPlayer(ctx.guildId) ||
      (await ctx.client.lavalink.createPlayer({
        guildId: ctx.guildId,
        voiceChannelId: vcId,
        textChannelId: ctx.channelId,
        selfDeaf: true,
        selfMute: false,
        volume: ctx.client.defaultVolume,
        instaUpdateFiltersFix: true,
        applyVolumeAsFilter: false,
      }));

    const connected = player.connected;

    if (!connected) {
      await player.connect();
    }

    if (player.voiceChannelId !== vcId)
      return ctx.editOrReply({
        content: 'You need to be in my Voice Channel',
      });

    const response = (fromAutoComplete ||
      (await player.search(
        { query: query, source: source },
        {
          id: ctx.author.id,
          username: ctx.author.username,
          avatar: ctx.author.avatarURL(),
        }
      ))) as SearchResult;

    if (!response || !response.tracks?.length)
      return ctx.editOrReply({ content: `No Tracks found` });

    let singleTrack =
      response.loadType === 'playlist'
        ? false
        : response.tracks[
            fromAutoComplete ? Number(query.replace('autocomplete_', '')) : 0
          ];

    await player.queue.add(
      response.loadType === 'playlist'
        ? response.tracks
        : response.tracks[
            fromAutoComplete ? Number(query.replace('autocomplete_', '')) : 0
          ]
    );

    await ctx.editOrReply({
      content:
        response.loadType === 'playlist' && singleTrack === false
          ? `✅ Added [${response.tracks.length}] Tracks${
              response.playlist?.title
                ? ` - from the ${response.pluginInfo.type || 'Playlist'} ${
                    response.playlist.uri
                      ? `[\`${response.playlist.title}\`](<${response.playlist.uri}>)`
                      : `\`${response.playlist.title}\``
                  }`
                : ''
            } at \`#${player.queue.tracks.length - response.tracks.length}\``
          : `✅ Added [\`${(singleTrack as Track).info.title}\`](<${
              (singleTrack as Track).info.uri
            }>) by \`${(singleTrack as Track).info.author}\` at \`#${
              player.queue.tracks.length
            }\``,
    });

    if (!player.playing) {
      await player.play(
        connected
          ? { volume: ctx.client.defaultVolume, paused: false }
          : undefined
      );
    }
  }
}
