import type { Client, ParseClient, ParseLocales } from 'seyfert';
import defaultLocale from './locales/es-419.js';
import Camel from '#Camel/client';

declare module 'seyfert' {
  interface UsingClient extends ParseClient<Camel> {}
  interface DefaultLocale extends ParseLocales<typeof defaultLocale> {}
}
