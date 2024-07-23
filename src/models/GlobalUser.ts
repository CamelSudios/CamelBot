import { Schema, model, Document } from 'mongoose';
import { Track, TrackInfo } from 'lavalink-client';

interface Playlist {
  name: string;
  id: string;
  tracks: Track[];
}

interface GlobalUserType extends Document {
  id: string;
  music: {
    playlists: Playlist[];
  };
}

const TrackSchema = new Schema<Track>({
  encoded: { type: String, required: true },
  info: { type: Object, required: true },
  requester: { type: Object, required: true },
});

const PlaylistSchema = new Schema<Playlist>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  tracks: { type: [TrackSchema], required: true },
});

const GlobalUserSchema = new Schema<GlobalUserType>({
  id: { type: String, required: true },
  music: {
    playlists: { type: [PlaylistSchema], required: true },
  },
});

const GlobalUser = model<GlobalUserType>('GlobalUser', GlobalUserSchema);

export default GlobalUser;
