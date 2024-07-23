import { SearchResult, Track } from 'lavalink-client';

export default {
  metadata: {
    name: 'Spanish (Latin America)',
    nativeName: 'Español (Latinoamérica)',
    translators: ['k1_1960 <K1-1960>'],
  },
  messages: {
    ping: (ping: number) => `Pong! La latencia es de ${ping}ms.`,
    avatar: (username: string) => `El avatar de ${username}`,
    nukedBy: (user: string) => `El canal ha sido  nukeado por <@${user}>`,
    nuking: 'Borrando el canal...',
    followers: 'Seguidores',
    genres: 'Géneros',
    duration: 'Duración',

    joinIntoAChannel: 'Únete a un canal',
    noTracksFound: 'No se encontraron pistas',
    notAbleToJoinOrSpeak: 'No puedo unirme al canal o hablar en él',
    mustBeInTheSameVoiceChannel: 'Debes estar en el mismo canal de voz',
    IHaveBeenConnectedRedoCommand:
      'Ya estoy conectado, vuelve a ejecutar el comando',
    noGuildPlayer: 'No hay un reproductor para este servidor.',

    addedSingleSongToQueue: (singleTrack: Track, total: number) =>
      `✅ Se ha añadido [\`${(singleTrack as Track).info.title}\`](<${
        (singleTrack as Track).info.uri
      }>) de \`${
        (singleTrack as Track).info.author
      }\` en la posición \`#${total}\``,
    addedSongsToQueue: (response: SearchResult, total: number) =>
      `✅ Se han añadido [${response.tracks.length}] canciones ${
        response.playlist?.title
          ? ` - desde la ${response.pluginInfo.type || 'Playlist'} ${
              response.playlist.uri
                ? `[\`${response.playlist.title}\`](<${response.playlist.uri}>)`
                : `\`${response.playlist.title}\``
            }`
          : ''
      } en la posición \`#${total - response.tracks.length}\``,
    setLoopMode: (loop: string) =>
      `Establecido el modo de bucle a \`${loop}\`.`,
    paused: 'Se ha pausado la reproducción.',
    resume: 'Se ha reanudado la reproducción.',
    skipped: (to: number) =>
      `Se ha saltado la canción actual${to > 0 ? ` a la posición ${to}` : ''}.`,
    stopped: 'El reproductor se ha detenido. Adiós.',
    volumeMustBeBetween0and100: 'El volumen debe estar entre 0 y 100.',
    volumeSetTo: (level: number) => `Volumen establecido a ${level}%`,
    noLyricsFound: 'No se encontraron letras.',
    noCurrentSong: 'No hay ninguna canción actual.',
    noPlaylists: 'No hay ninguna playlist.',
    playlistDoesNotExist: 'La playlist no existe.',
    playlistLoaded: 'La playlist se ha cargado.',
    anyError: 'Ha ocurrido un error.',
    namedPlaylistAlreadyExists: 'Ya existe una playlist con ese nombre.',
    playlistSaved: 'La playlist se ha guardado.',
  },
};
