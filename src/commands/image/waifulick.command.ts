import {
  SubCommand,
  CommandContext,
  Options,
  Declare,
  createUserOption,
  AttachmentBuilder,
} from 'seyfert';
import { WaifuLick } from '#lib/image-manipulation';

const options = {
  user: createUserOption({
    description: 'User to create the waifulick image for',
    required: false,
  }),
};

@Declare({
  name: 'waifulick',
  description: 'Create a waifulick image',
})
@Options(options)
export default class Waifulick extends SubCommand {
  async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();
    const user = ctx.options.user ?? ctx.author;

    const image = await WaifuLick(user.avatarURL({ extension: 'png' }));

    const attachment = new AttachmentBuilder()
      .setFile('buffer', image)
      .setName('waifulick.png');

    await ctx.editOrReply({ files: [attachment] });
  }
}
