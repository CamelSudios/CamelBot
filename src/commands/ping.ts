import { Declare, Command, type CommandContext } from 'seyfert';

@Declare({
  name: 'ping',
  description: "Get the bot's latency",
})
export default class Ping extends Command {
  async run(ctx: CommandContext) {
    const latency = ctx.client.gateway.latency;
    const { messages } = ctx.t.get();
    ctx.editOrReply({ content: messages.ping(latency) });
  }
}
