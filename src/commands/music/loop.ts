import { RepeatMode } from 'lavalink-client/dist/types/index.js';
import {
  Declare,
  Options,
  Command,
  CommandContext,
  createBooleanOption,
  createStringOption,
} from 'seyfert';

const options = {
  loop: createStringOption({
    description: 'The mode to set the loop to',
    required: true,
    choices: [
      {
        name: 'Off',
        value: 'off',
      },
      {
        name: 'Track',
        value: 'track',
      },
      {
        name: 'Queue',
        value: 'queue',
      },
    ],
  }),
};

@Declare({
  name: 'loop',
  description: 'Sets the loop mode',
})
@Options(options)
export default class Loop extends Command {
  async run(ctx: CommandContext<typeof options>) {
    if (!ctx.guildId) return;
    const player = ctx.client.lavalink.getPlayer(ctx.guildId!);
    if (!player)
      return ctx.editOrReply({
        content: 'There is no player in this guild.',
        flags: 64,
      });
    const { loop } = ctx.options;
    await ctx.deferReply();
    await player.setRepeatMode(loop as RepeatMode);
    return ctx.editOrReply({
      content: `Set the loop mode to \`${loop}\`.`,
    });
  }
}
