import {
  Declare,
  Options,
  Command,
  CommandContext,
  createStringOption,
  Embed,
} from 'seyfert';
import getLyrics from '../../structures/utils/lyrics.js';

const options = {
  query: createStringOption({
    description:
      'The song to search for, if not provided, the current song will be used',
    required: false,
  }),
};

@Declare({
  name: 'lyrics',
  description: 'Shows the lyrics of the current song or a provided song',
})
@Options(options)
export default class Lyrics extends Command {
  async run(ctx: CommandContext<typeof options>) {
    if (!ctx.guildId) return;
    const player = ctx.client.lavalink.getPlayer(ctx.guildId!);

    const { query = false } = ctx.options;

    if (!player)
      return ctx.editOrReply({
        content: 'There is no player in this guild.',
        flags: 64,
      });
    await ctx.deferReply();

    if (typeof query === 'string') {
      const track = await ctx.client.spotify.searchTrack({
        name: query,
        artist: '',
      });

      let lyrics = await getLyrics(track.name, track.artists.shift()!);
      if (!lyrics)
        return ctx.editOrReply({
          content: 'No lyrics found.',
        });

      return ctx.editOrReply({
        embeds: [
          new Embed()
            .setTitle(track.name)
            .setDescription(lyrics.slice(0, 2048))
            .setColor(0x00ff00)
            .setThumbnail(track.cover)
            .setFooter({
              text: track.album,
            }),
        ],
      });
    } else {
      const current = player.queue.current;
      if (!current)
        return ctx.editOrReply({
          content: 'There is no current song.',
        });

      let lyrics = await getLyrics(current.info.title, current.info.author);
      if (!lyrics)
        return ctx.editOrReply({
          content: 'No lyrics found.',
        });

      return ctx.editOrReply({
        embeds: [
          new Embed()
            .setTitle(current.info.title)
            .setDescription(lyrics.slice(0, 2048))
            .setColor(0x00ff00)
            .setThumbnail(current.info.artworkUrl!),
        ],
      });
    }
  }
}
