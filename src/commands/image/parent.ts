import { Command, Declare, Options } from 'seyfert';
import Waifulick from './waifulick.command.js';

@Declare({
  name: 'image',
  description: 'Commands for image manipulation',
})
@Options([Waifulick])
export default class ImageCommand extends Command {}
