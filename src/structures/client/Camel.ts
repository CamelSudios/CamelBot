import { Client, type ClientOptions } from 'seyfert';
import { SpotifyClient } from '#lib/spotify-api';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '#config';
import { LavalinkManager, MiniMap } from 'lavalink-client';
import { createLavalinkManager } from '#lib/lavalink';
import { loadLavalinkEvents } from '../../lavalink-events/index.js';
import emojis from '../utils/emojis.js';

export default class Camel extends Client<true> {
  public spotify: SpotifyClient;
  public lavalink: LavalinkManager;
  public defaultVolume: number;
  public redis: MiniMap<string, string>;
  public ownEmojis: typeof emojis;
  constructor(options: ClientOptions) {
    super(options);
    this.spotify = new SpotifyClient(
      SPOTIFY_CLIENT_ID!,
      SPOTIFY_CLIENT_SECRET!
    );

    this.lavalink = createLavalinkManager(this);
    this.redis = new MiniMap<string, string>();
    this.defaultVolume = 100;
    this.ownEmojis = emojis;
    loadLavalinkEvents(this);
  }
}
