import axios from 'axios';

export async function fetchImageBuffer(url: string) {
  const { data } = await axios.get(url, {
    responseType: 'arraybuffer',
  });
  return Buffer.from(data);
}
