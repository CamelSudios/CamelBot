// @ts-check
import 'dotenv/config';
import { config } from 'seyfert';
import { GatewayIntentBits } from 'discord-api-types/v10';

export default config.bot({
  token: process.env.BOT_TOKEN ?? '',
  intents:
    GatewayIntentBits.Guilds |
    GatewayIntentBits.GuildMessages |
    GatewayIntentBits.MessageContent |
    GatewayIntentBits.GuildMessageReactions |
    GatewayIntentBits.DirectMessages |
    GatewayIntentBits.DirectMessageReactions |
    GatewayIntentBits.MessageContent,
  locations: {
    base: './src',
    output: './dist',
    commands: 'commands',
    events: 'events',
    langs: 'locales',
  },
  debug: true,
});
