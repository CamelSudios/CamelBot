export type TrackDuration = {
  milliseconds: number;
  minutes: number;
  seconds: number;
  parsed: string;
};

function parseDuration(duration: number): TrackDuration {
  let seconds = Math.floor(duration / 1000);
  let minutes = 0;
  do {
    seconds = seconds - 60;
    minutes = minutes + 1;
  } while (Math.floor(seconds) >= 60);

  return {
    milliseconds: duration,
    minutes: Math.floor(minutes),
    seconds: Math.floor(seconds),
    parsed:
      String(Math.floor(minutes)).padStart(2, '0') +
      ':' +
      String(Math.floor(seconds)).padStart(2, '0'),
  };
}

export default class Track {
  public name: string;
  public artists: string[];
  public album: string;
  public cover: string;
  public duration: TrackDuration;

  constructor(APITrackData: any) {
    this.name = APITrackData.name;
    this.artists = APITrackData.artists.map((artist: any) => artist.name);
    this.album = APITrackData.album.name;
    this.cover = APITrackData.album.images[0].url;
    this.duration = parseDuration(APITrackData.duration_ms);
  }
}
