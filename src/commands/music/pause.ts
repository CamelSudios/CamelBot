import { Declare, Command, CommandContext } from 'seyfert';

@Declare({
  name: 'pause',
  description: 'Pauses the current song',
})
export default class Pause extends Command {
  async run(ctx: CommandContext) {
    if (!ctx.guildId) return;
    const { messages } = ctx.t.get(ctx.guild()!.preferredLocale || 'en-US');
    const player = ctx.client.lavalink.getPlayer(ctx.guildId!);
    if (!player)
      return ctx.editOrReply({
        content: messages.noGuildPlayer,
        flags: 64,
      });
    await ctx.deferReply();
    await player.pause();
    return ctx.editOrReply({
      content: messages.paused,
    });
  }
}
