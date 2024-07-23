import { ChannelType, PermissionFlagsBits } from 'discord-api-types/v10';
import { CommandContext, Declare, SubCommand, TextGuildChannel } from 'seyfert';

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

@Declare({
  name: 'nuke',
  description: 'Deletes a message',
  botPermissions:
    PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageMessages,
  defaultMemberPermissions:
    PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageMessages,
})
export default class Nuke extends SubCommand {
  async run(ctx: CommandContext) {
    const messages = ctx.t.get().messages;
    let channel = (await ctx.client.channels.fetch(
      ctx.channelId
    )) as TextGuildChannel;
    let permissions = channel.permissionOverwrites.fetch() || [];
    console.log(permissions);

    if (channel.type !== ChannelType.GuildText) {
      return ctx.editOrReply({
        content: 'This command can only be used in a text channel',
      });
    }
    await ctx.editOrReply({
      content: messages.nuking,
    });

    await sleep(3000);

    channel.delete();

    let position = channel.position;
    let parent = channel.parentId ?? null;

    let pp = permissions!.map((p2) => ({
      id: p2.id,
      type: p2.type,
      allow: `${p2.allow.bits}`,
      deny: `${p2.deny.bits}`,
    }));

    if (parent) {
      ctx.client.guilds.fetch(ctx.guildId!).then(async (guild) => {
        let createdChannel = (await guild.channels.create({
          name: channel.name,
          type: ChannelType.GuildText,
          parent_id: parent,
          position: position,
          topic: channel.topic,
          nsfw: channel.nsfw,
          rate_limit_per_user: channel.rateLimitPerUser,
          default_auto_archive_duration: channel.defaultAutoArchiveDuration,
          default_thread_rate_limit_per_user:
            channel.defaultThreadRateLimitPerUser,
          flags: channel.flags,
          permission_overwrites: pp,
        })) as TextGuildChannel;

        await createdChannel.messages.write({
          content: messages.nukedBy(ctx.author.id),
        });
      });
    }
  }
}
