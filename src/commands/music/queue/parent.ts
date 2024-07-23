import { Declare, Options, CommandContext, Command } from 'seyfert';
import LoadQueue from './load.command.js';
import SaveQueue from './save.command.js';
import ViewQueue from './view.command.js';

@Declare({
  name: 'queue',
  description: 'Shows the current queue',
})
@Options([ViewQueue, LoadQueue, SaveQueue])
export default class Queue extends Command {}
