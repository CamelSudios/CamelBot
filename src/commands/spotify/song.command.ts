import { fetchImageBuffer } from '#utils/fetch';
import getAverageColor from '#utils/getAverageColor';
import {
  SubCommand,
  Declare,
  Options,
  createStringOption,
  Embed,
  CommandContext,
} from 'seyfert';

const options = {
  songname: createStringOption({
    description: 'The name of the song you want to search for',
    required: true,
  }),
  artist: createStringOption({
    description: 'The name of the artist of the song you want to search for',
    required: false,
  }),
};

@Declare({
  name: 'song',
  description: 'Searches for a song on Spotify',
})
@Options(options)
export default class SongCommand extends SubCommand {
  public async run(ctx: CommandContext<typeof options>) {
    let { songname, artist } = ctx.options;
    const track = await ctx.client.spotify.searchTrack({
      artist: artist ?? '',
      name: songname,
    });

    const color = await getAverageColor(await fetchImageBuffer(track.cover));
    console.log(color);

    ctx.editOrReply({
      embeds: [
        new Embed({
          title: track.name,
          author: {
            name: track.artists.join(', '),
          },
          thumbnail: {
            url: track.cover,
          },
          fields: [
            {
              name: 'Duration',
              value: `\`${track.duration.parsed}\``,
            },
          ],
          color: color.value[0] * 65536 + color.value[1] * 256 + color.value[2],
        }),
      ],
    });
  }
}
