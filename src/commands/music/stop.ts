import { Declare, CommandContext, Command } from 'seyfert';

@Declare({
  name: 'stop',
  description: 'Stops the player',
})
export default class Stop extends Command {
  async run(ctx: CommandContext) {
    if (!ctx.guildId) return;
    const { messages } = ctx.t.get(ctx.guild()!.preferredLocale || 'en-US');
    const player = ctx.client.lavalink.getPlayer(ctx.guildId!);
    if (!player)
      return ctx.editOrReply({
        content: messages.noGuildPlayer,
        flags: 64,
      });

    await player.destroy();
    ctx.editOrReply({ content: messages.stopped });
  }
}
