import {
  Declare,
  Options,
  type CommandContext,
  createStringOption,
  SubCommand,
} from 'seyfert';
import { Track } from 'lavalink-client';
import GlobalUser from '../../../models/GlobalUser.js';
import Tokenizer, {
  TokenizerCaseMode,
  TokenizerMode,
} from '../../../structures/utils/tokenizer.js';

const options = {
  name: createStringOption({
    name: 'name',
    description: 'The name of the playlist',
    required: true,
  }),
};

@Declare({
  name: 'save',
  description: 'Saves the current queue as a playlist',
})
@Options(options)
export default class SaveQueue extends SubCommand {
  async run(ctx: CommandContext<typeof options>) {
    if (!ctx.guildId) return;
    const { messages } = ctx.t.get(ctx.guild()!.preferredLocale || 'en-US');
    const player = ctx.client.lavalink.getPlayer(ctx.guildId!);
    if (!player)
      return ctx.editOrReply({
        content: messages.noGuildPlayer,
      });

    const { name } = ctx.options;

    const queue = [
      player.queue.current,
      ...Array.from(player.queue.tracks),
    ] as Track[];

    const user =
      (await GlobalUser.findOne({ id: ctx.author.id })) ||
      (await new GlobalUser({
        id: ctx.author.id,
        music: {
          playlists: [],
        },
      }).save());

    if (!user) {
      ctx.editOrReply({ content: messages.anyError });
      return;
    }

    if (user.music.playlists.find((p) => p.name === name)) {
      ctx.editOrReply({
        content: messages.namedPlaylistAlreadyExists,
      });
      return;
    }

    let playlist = {
      name,
      id: Tokenizer(5, TokenizerMode.Alphanumeric, TokenizerCaseMode.Upper),
      tracks: queue,
    };

    await GlobalUser.findOneAndUpdate(
      {
        id: ctx.author.id,
      },
      {
        $push: {
          'music.playlists': playlist,
        },
      },
      { new: true }
    );

    ctx.editOrReply({ content: messages.playlistSaved });
  }
}
