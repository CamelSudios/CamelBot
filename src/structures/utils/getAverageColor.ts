import { getAverageColor } from 'fast-average-color-node';

export default async function (image: Buffer) {
  return await getAverageColor(image);
}
