export default {
  metadata: {
    name: 'Spanish (Latin America)',
    nativeName: 'Español (Latinoamérica)',
    translators: ['k1_1960 <K1-1960>'],
  },
  messages: {
    ping: (ping: number) => `Pong! La latencia es de ${ping}ms.`,
    avatar: (username: string) => `El avatar de ${username}`,
  },
};
