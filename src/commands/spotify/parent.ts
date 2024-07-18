import { Command, Declare, Options } from 'seyfert';

import SongCommand from './song.command.js';
import ArtistCommand from './artist.command.js';

@Declare({
  name: 'spotify',
  description: 'Searches for a song on Spotify',
})
@Options([SongCommand, ArtistCommand])
export default class SpotifyCommand extends Command {}
