const emojis = {
  src_spotify: '<:src_spotify:1264066289047965810>',
  src_youtube: '<:src_youtube:1264066327132246217>',
  src_soundcloud: '<:src_soundcloud:1264066343943147562>',
};

const _ = {
  ...emojis,
  get(k: string) {
    return Object.entries(emojis).find((v) => v[0] === k)?.[1];
  },
};

export default _;
