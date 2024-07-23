import { Declare, Command, type CommandContext, Guild } from 'seyfert';

function getShardId(guildId: string, totalShards: number) {
  return (BigInt(guildId) >> 22n) % BigInt(totalShards);
}

@Declare({
  name: 'ping',
  description: "Get the bot's latency",
})
export default class Ping extends Command {
  async run(ctx: CommandContext) {
    let shardId = getShardId(ctx.guildId ?? '', ctx.client.gateway.size);
    console.log(shardId);
    const latency = ctx.client.gateway.latency;
    const { messages } = ctx.t.get();
    const me = ctx.client.langs?.get('es-419');
    console.log(me?.messages);
    ctx.editOrReply({ content: messages.ping(latency) });
  }
}
