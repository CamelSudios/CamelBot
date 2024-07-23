import mongoose from 'mongoose';
import Camel from '#Camel/client';
import { PresenceUpdateStatus } from 'seyfert/lib/types/index.js';
import { ActivityType } from 'discord-api-types/v10';
import { MONGODB_URI } from '#config';

const client = new Camel({
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

async function start() {
  await mongoose.connect(MONGODB_URI!, {
    dbName: 'camel',
  });

  mongoose.connection.on('connected', () => {
    client.logger.info('MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    client.logger.error(err);
  });

  mongoose.connection.on('disconnected', () => {
    client.logger.warn('MongoDB disconnected');
  });

  client.start().then(() => {
    client.logger.info('Bot started!');
    client.uploadCommands();
  });
}

start();
