import {
  Declare,
  Options,
  CommandContext,
  Command,
  createNumberOption,
} from 'seyfert';

const options = {
  level: createNumberOption({
    description: 'The volume level',
    required: true,
    min: 0,
    max: 100,
  }),
};

@Declare({
  name: 'volume',
  description: 'Changes the volume of the player',
})
@Options(options)
export default class Volume extends Command {
  async run(ctx: CommandContext<typeof options>) {
    if (!ctx.guildId) return;
    const { messages } = ctx.t.get(ctx.guild()!.preferredLocale || 'en-US');
    const player = ctx.client.lavalink.getPlayer(ctx.guildId!);
    if (!player)
      return ctx.editOrReply({
        content: messages.noGuildPlayer,
      });

    const { level } = ctx.options;

    if (level < 0 || level > 100)
      return ctx.editOrReply({
        content: messages.volumeMustBeBetween0and100,
        flags: 64,
      });

    await player.setVolume(level);
    ctx.editOrReply({ content: messages.volumeSetTo(level) });
  }
}
