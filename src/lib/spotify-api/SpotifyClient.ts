import axios from 'axios';
import fs from 'fs';
import Track from './objects/Track.js';
import Artist from './objects/Artist.js';

type SpotifyToken = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export default class SpotifyClient {
  public clientId: string;
  public clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  public async searchTrack({ name, artist }: { name: string; artist: string }) {
    let query = name + ' - ' + artist;
    let token = await this.getSpotifyToken();
    let params = new URLSearchParams({
      q: query,
      type: 'track',
      market: 'US',
      limit: '1',
    });

    try {
      let {
        data: {
          tracks: {
            items: { [0]: APITrackData },
          },
        },
      } = await axios.get(
        'https://api.spotify.com/v1/search?' + params.toString(),
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );

      return new Track(APITrackData);
    } catch (e: any) {
      throw e;
    }
  }
  public async searchArtist(name: string) {
    let token = await this.getSpotifyToken();
    let params = new URLSearchParams({
      q: name,
      type: 'artist',
      market: 'US',
      limit: '1',
    });

    try {
      let {
        data: {
          artists: {
            items: { [0]: APIArtistData },
          },
        },
      } = await axios.get(
        'https://api.spotify.com/v1/search?' + params.toString(),
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );

      return new Artist(APIArtistData);
    } catch (e: any) {
      throw e;
    }
  }
  public async getAlbum(name: string) {}
  public async getPlaylist() {}

  private async getSpotifyToken() {
    let existentToken = fs.existsSync('.spotify_token')
      ? fs.readFileSync('.spotify_token', 'utf-8')
      : false;
    if (
      existentToken &&
      Number(existentToken.split('\n')[1]) > Date.now() / 1000
    ) {
      return existentToken.split('\n')[0];
    }

    const response = (
      await axios.post(
        'https://accounts.spotify.com/api/token',
        {
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
    ).data as SpotifyToken;

    fs.writeFileSync(
      '.spotify_token',
      response.access_token +
        '\n' +
        Math.floor(Date.now() / 1000 + response.expires_in),
      'utf-8'
    );

    return response.access_token;
  }
}
