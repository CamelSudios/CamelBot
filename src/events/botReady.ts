import { createEvent } from 'seyfert';

export default createEvent({
  data: { name: 'botReady', once: true },
  async run(user, client) {
    client.logger.info(`${user.username} is ready!`);
    await client.lavalink.init({ ...user! });
  },
});
