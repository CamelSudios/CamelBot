export default class Artist {
  public name: string;
  public profile_picture: string;
  public followers: number;
  public genres: string[];
  public url: string;

  constructor(APIArtistData: any) {
    this.name = APIArtistData.name;
    this.profile_picture = APIArtistData.images[0].url;
    this.followers = APIArtistData.followers.total;
    this.genres = APIArtistData.genres;
    this.url = APIArtistData.external_urls.spotify;
  }
}
