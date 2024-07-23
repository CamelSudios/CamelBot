import {
  Declare,
  Options,
  Command,
  type CommandContext,
  createUserOption,
  Embed,
} from 'seyfert';

const options = {
  user: createUserOption({
    description: 'The user to get the avatar of',
    required: false,
  }),
};

@Declare({
  name: 'avatar',
  description: "Get the user's avatar",
})
@Options(options)
export default class Avatar extends Command {
  async run(ctx: CommandContext<typeof options>) {
    const user = ctx.options.user || ctx.author;
    const { messages } = ctx.t.get('es-419');
    ctx.editOrReply({
      embeds: [
        new Embed()
          .setDescription(messages.avatar(user.username))
          .setImage(user.avatarURL() + '?size=2048')
          .setColor('NotQuiteBlack'),
      ],
    });
  }
}
