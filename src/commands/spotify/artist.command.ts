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
  artist: createStringOption({
    description: 'The name of the artist you want to search for',
    required: true,
  }),
};

@Declare({
  name: 'artist',
  description: 'Searches for an artist on Spotify',
})
@Options(options)
export default class SongCommand extends SubCommand {
  public async run(ctx: CommandContext<typeof options>) {
    let { artist } = ctx.options;
    const Artist = await ctx.client.spotify.searchArtist(artist);

    const color = await getAverageColor(
      await fetchImageBuffer(Artist.profile_picture)
    );
    console.log(color);

    ctx.editOrReply({
      embeds: [
        new Embed({
          title: Artist.name,
          thumbnail: {
            url: Artist.profile_picture,
          },
          fields: [
            {
              name: 'Followers',
              value: `\`${Artist.followers.toLocaleString()}\``,
              inline: true,
            },
            {
              name: 'Genres',
              value: `\`${Artist.genres.join(', ')}\``,
              inline: true,
            },
          ],
          url: Artist.url,
          color: color.value[0] * 65536 + color.value[1] * 256 + color.value[2],
        }),
      ],
    });
  }
}
