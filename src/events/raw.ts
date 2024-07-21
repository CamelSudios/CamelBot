import { createEvent } from 'seyfert';
import type {
  ChannelDeletePacket,
  VoicePacket,
  VoiceServer,
  VoiceState,
} from 'lavalink-client';

export default createEvent({
  data: { name: 'raw', once: false },
  async run(d, client, _shard) {
    client.lavalink.sendRawData(
      d as VoicePacket | VoiceState | VoiceServer | ChannelDeletePacket
    );
  },
});
