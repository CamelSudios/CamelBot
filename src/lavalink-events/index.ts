import Camel from '#Camel/client';
import { NodesEvents } from './Node.js';
import { PlayerEvents } from './Player.js';

export function loadLavalinkEvents(client: Camel) {
  NodesEvents(client);
  PlayerEvents(client);
}
