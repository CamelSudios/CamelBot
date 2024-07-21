import {
  Declare,
  Options,
  Command,
  CommandContext,
  createNumberOption,
} from 'seyfert';

const options = {
  to: createNumberOption({
    name: 'to',
    description: 'The index of songs to skip',
    required: false,
    min: 0,
    max: 128,
  }),
};
@Declare({
  name: 'skip',
  description: 'Skips the current song',
})
@Options(options)
export default class Skip extends Command {
  async run(ctx: CommandContext<typeof options>) {
    if (!ctx.guildId) return;
    const player = ctx.client.lavalink.getPlayer(ctx.guildId!);
    if (!player)
      return ctx.editOrReply({
        content: 'There is no player in this guild.',
        flags: 64,
      });
    const { to = 0 } = ctx.options;
    await ctx.deferReply();
    await player.skip(to);
    return ctx.editOrReply({
      content: 'Skipped the current song.',
    });
  }
}
