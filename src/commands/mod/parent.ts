import { Declare, Command, Options } from 'seyfert';
import Nuke from './nuke.command.js';

@Declare({
  name: 'mod',
  description: 'Moderation commands',
})
@Options([Nuke])
export default class Parent extends Command {}
