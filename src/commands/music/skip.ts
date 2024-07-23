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
    name_localizations: {
      'en-US': 'to',
      'es-419': 'a',
    },
    description: 'The index of songs to skip',
    description_localizations: {
      'en-US': 'The index of songs to skip',
      'es-419': 'El índice de canciones para saltar',
    },
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
    const { messages } = ctx.t.get(ctx.guild()!.preferredLocale || 'en-US');
    const player = ctx.client.lavalink.getPlayer(ctx.guildId!);
    if (!player)
      return ctx.editOrReply({
        content: messages.noGuildPlayer,
        flags: 64,
      });
    const { to = 0 } = ctx.options;
    await ctx.deferReply();
    await player.skip(to);
    return ctx.editOrReply({
      content: messages.skipped(to),
    });
  }
}
