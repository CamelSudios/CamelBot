import { SearchResult, Track } from 'lavalink-client';
import { set } from 'mongoose';
import { skip } from 'node:test';

export default {
  metadata: {
    name: 'English (United States)',
    nativeName: 'Inglés (Estados Unidos)',
    translators: ['k1_1960 <K1-1960>'],
  },
  messages: {
    ping: (ping: number) => `Pong! the latency is ${ping}ms.`,
    avatar: (username: string) => `${username}'s avatar`,
    nukedBy: (user: string) => `The channel has been nuked by <@${user}>`,
    nuking: 'Deleting the channel...',
    followers: 'Followers',
    genres: 'Genres',
    duration: 'Duration',

    joinIntoAChannel: 'You need to be in a voice channel',
    noTracksFound: 'No tracks found',
    notAbleToJoinOrSpeak:
      'I am not able to join your channel / speak in there.',
    mustBeInTheSameVoiceChannel: 'You need to be in the same channel as me',
    IHaveBeenConnectedRedoCommand:
      'I have been connected, redo the command please',
    noGuildPlayer: 'There is no player for this guild.',

    addedSingleSongToQueue: (singleTrack: Track, total: number) =>
      `✅ Added [\`${(singleTrack as Track).info.title}\`](<${
        (singleTrack as Track).info.uri
      }>) by \`${(singleTrack as Track).info.author}\` at \`#${total}\``,
    addedSongsToQueue: (response: SearchResult, total: number) =>
      `✅ Added [${response.tracks.length}] tracks ${
        response.playlist?.title
          ? ` - from the ${response.pluginInfo.type || 'Playlist'} ${
              response.playlist.uri
                ? `[\`${response.playlist.title}\`](<${response.playlist.uri}>)`
                : `\`${response.playlist.title}\``
            }`
          : ''
      } at \`#${total - response.tracks.length}\``,

    setLoopMode: (loop: string) => `Set the loop mode to \`${loop}\`.`,
    paused: 'Playback has been paused.',
    resume: 'Playback has been resumed.',
    skipped: (to: number) =>
      `Skipped the current song${to > 0 ? ` to position ${to}` : ''}.`,
    stopped: 'Player has been stopped. Bye.',
    volumeMustBeBetween0and100: 'Volume must be between 0 and 100.',
    volumeSetTo: (level: number) => `Volume set to ${level}%`,
    noLyricsFound: 'No lyrics found.',
    noCurrentSong: 'There is no current song.',
    noPlaylists: 'There are no playlists.',
    playlistDoesNotExist: 'The playlist does not exist.',
    playlistLoaded: 'Playlist loaded.',
    anyError: 'An error occurred.',
    namedPlaylistAlreadyExists: 'A playlist with that name already exists.',
    playlistSaved: 'Playlist saved.',
  },
};
