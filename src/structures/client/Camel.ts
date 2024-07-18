import { Client, type ClientOptions } from 'seyfert';
import { SpotifyClient } from '#lib/spotify-api';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '#config';

export default class Camel extends Client<true> {
  public spotify: SpotifyClient;
  constructor(options: ClientOptions) {
    super(options);
    this.spotify = new SpotifyClient(
      SPOTIFY_CLIENT_ID!,
      SPOTIFY_CLIENT_SECRET!
    );
  }
}
