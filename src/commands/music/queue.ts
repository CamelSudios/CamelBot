import { MessageFlags } from 'discord-api-types/v10';
import { Declare, Options, CommandContext, Command, Embed } from 'seyfert';

@Declare({
  name: 'queue',
  description: 'Shows the current queue',
})
export default class Queue extends Command {
  async run(ctx: CommandContext) {
    if (!ctx.guildId) return;
    const player = ctx.client.lavalink.getPlayer(ctx.guildId!);

    if (!player)
      return ctx.editOrReply({
        content: 'There is no player in this guild.',
        flags: MessageFlags.Ephemeral,
      });

    const queue = player.queue.tracks.map((track, i) => {
      return `- \`#${i + 1}\` :: [\`${track.info.title}\`](${
        track.info.uri
      }) ${ctx.client.ownEmojis.get('src_' + track.info.sourceName)} by \`${
        track.info.author
      }\` \n-# requested by <@${(track.requester as { id: string }).id}>`;
    });
    const current = player.queue.current;

    let text = '';
    if (current)
      text = `**Now playing:** \n- [\`${current.info.title}\`](${
        current.info.uri
      }) ${ctx.client.ownEmojis.get('src_' + current.info.sourceName)} by \`${
        current.info.author
      }\` \n> -# requested by <@${(current.requester as { id: string }).id}>`;

    return ctx.editOrReply({
      embeds: [
        new Embed()
          .setTitle('Queue')
          .setDescription(
            text +
              '\n' +
              '### Queue\n' +
              (queue.length > 0 ? queue.join('\n\n') : '-# The queue is empty.')
          )
          .setThumbnail(
            current && current.info.artworkUrl
              ? current.info.artworkUrl
              : undefined
          )
          .setColor(
            current
              ? current.info.sourceName === 'youtube'
                ? 0xff0000
                : current.info.sourceName === 'spotify'
                ? 0x1db954
                : 0x00ff00
              : 0xffffff
          ),
      ],
    });
  }
}
