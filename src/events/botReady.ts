import { Client, createEvent } from 'seyfert';
import { ActivityType, PresenceUpdateStatus } from 'seyfert/lib/types/index.js';

export default createEvent({
  data: { name: 'botReady', once: true },
  async run(user, client) {
    client.logger.info(`${user.username} is ready!`);
  },
});
