import { Client } from 'seyfert';
import { PresenceUpdateStatus } from 'seyfert/lib/types/index.js';
import { GatewayPresenceUpdateData, ActivityType } from 'discord-api-types/v10';

const client = new Client({
  presence: (shardId) => ({
    since: Date.now(),
    afk: false,
    status: PresenceUpdateStatus.Online,
    activities: [
      {
        name: 'Seyfert',
        type: ActivityType.Watching,
      },
    ],
  }),
});

client.start().then(() => {
  client.logger.info('Bot started!');
  client.uploadCommands();
});
