import Camel from '#Camel/client';
import { BOT_ID, LL_HOST, LL_PASSWORD, LL_PORT } from '#config';
import { LavalinkManager } from 'lavalink-client';
import { requesterTransformer } from '../../structures/utils/optional.js';

function getShardId(guildId: string, totalShards: number) {
  return (BigInt(guildId) >> 22n) % BigInt(totalShards);
}

export function createLavalinkManager(client: Camel) {
  console.log({
    authorization: LL_PASSWORD!,
    host: LL_HOST!,
    port: parseFloat(LL_PORT!),
    id: 'testnode',
    secure: false,
  });
  return new LavalinkManager({
    nodes: [
      {
        // Important to have at least 1 node
        authorization: LL_PASSWORD!,
        host: LL_HOST!,
        port: parseFloat(LL_PORT!),
        id: 'testnode',
        secure: false,
      },
    ],
    sendToShard: (guildId, payload) => {
      let shardId = getShardId(guildId ?? '', client.gateway.size);
      client.gateway.get(Number(shardId))?.send(true, payload);
    },
    client: {
      id: BOT_ID!,
      username: 'TESTBOT',
    },
    // everything down below is optional
    autoSkip: true,
    playerOptions: {
      applyVolumeAsFilter: false,
      clientBasedPositionUpdateInterval: 50, // in ms to up-calc player.position
      defaultSearchPlatform: 'ytmsearch',
      requesterTransformer: requesterTransformer,
      volumeDecrementer: 0.75, // on client 100% == on lavalink 75%
      onDisconnect: {
        autoReconnect: true, // automatically attempts a reconnect, if the bot disconnects from the voice channel, if it fails, it get's destroyed
        destroyPlayer: false, // overrides autoReconnect and directly destroys the player if the bot disconnects from the vc
      },
      onEmptyQueue: {
        destroyAfterMs: 30_000, // 0 === instantly destroy | don't provide the option, to don't destroy the player
        // autoPlayFunction: autoPlayFunction,
      },
      useUnresolvedData: false,
    },
    queueOptions: {
      maxPreviousTracks: 25,
    },
  });
}
