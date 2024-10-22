import { Declare, Command, CommandContext } from 'seyfert';

@Declare({
  name: 'resume',
  description: 'Resumes the current song',
})
export default class Resume extends Command {
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
    await player.resume();
    return ctx.editOrReply({
      content: messages.resume,
    });
  }
}
