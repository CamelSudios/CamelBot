import type { Client, ParseClient, ParseLocales } from 'seyfert';
import defaultLocale from './locales/es-419.js';

declare module 'seyfert' {
  interface UsingClient extends ParseClient<Client<true>> {}
  interface DefaultLocale extends ParseLocales<typeof defaultLocale> {}
}
