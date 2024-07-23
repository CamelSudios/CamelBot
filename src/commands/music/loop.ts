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
    description_localizations: {
      'en-US': 'The mode to set the loop to',
      'es-419': 'El modo para establecer el bucle',
    },
    name_localizations: {
      'en-US': 'loop',
      'es-419': 'bucle',
    },
    required: true,
    choices: [
      {
        name: 'Off',
        name_localizations: {
          'en-US': 'Off',
          'es-419': 'Apagado',
        },
        value: 'off',
      },
      {
        name: 'Track',
        name_localizations: {
          'en-US': 'Track',
          'es-419': 'Pista',
        },
        value: 'track',
      },
      {
        name: 'Queue',
        name_localizations: {
          'en-US': 'Queue',
          'es-419': 'Cola',
        },
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
    const { messages } = ctx.t.get(ctx.guild()!.preferredLocale || 'en-US');
    const player = ctx.client.lavalink.getPlayer(ctx.guildId!);
    if (!player)
      return ctx.editOrReply({
        content: messages.noGuildPlayer,
        flags: 64,
      });
    const { loop } = ctx.options;
    await ctx.deferReply();
    await player.setRepeatMode(loop as RepeatMode);
    return ctx.editOrReply({
      content: messages.setLoopMode(loop),
    });
  }
}
