import { Embed, TextGuildChannel } from 'seyfert';

import Camel from '#Camel/client';
import { formatMS_HHMMSS } from '../structures/utils/time.js';

export interface CustomRequester {
  id: string;
  username: string;
  avatar?: string;
}

export function PlayerEvents(client: Camel) {
  /**
   * PLAYER EVENTS
   */
  client.lavalink
    .on('playerCreate', (player) => {
      console.log(player.guildId, ' :: Created a Player :: ');
    })
    .on('playerDestroy', async (player, reason) => {
      console.log(player.guildId, ' :: Player got Destroyed :: ');
      const channel = (await client.channels.fetch(
        player.textChannelId!
      )) as TextGuildChannel;
      if (!channel) return console.log('No Channel?', player);
      channel.messages.write({
        embeds: [
          new Embed()
            .setColor('Red')
            .setTitle('❌ Player Destroyed')
            .setDescription(`Reason: ${reason || 'Unknown'}`)
            .setTimestamp(),
        ],
      });
    })
    .on('playerDisconnect', (player, voiceChannelId) => {
      console.log(
        player.guildId,
        ' :: Player disconnected the Voice Channel :: ',
        voiceChannelId
      );
    })
    .on('playerMove', (player, oldVoiceChannelId, newVoiceChannelId) => {
      console.log(
        player.guildId,
        ' :: Player moved from Voice Channel :: ',
        oldVoiceChannelId,
        ' :: To ::',
        newVoiceChannelId
      );
    })
    .on('playerSocketClosed', (player, payload) => {
      console.log(
        player.guildId,
        ' :: Player socket got closed from lavalink :: ',
        payload
      );
    });

  /**
   * Queue/Track Events
   */
  client.lavalink
    .on('trackStart', async (player, track) => {
      console.log(
        player.guildId,
        ' :: Started Playing :: ',
        track.info.title,
        'QUEUE:',
        player.queue.tracks.map((v) => v.info.title)
      );
      const channel = (await client.channels.fetch(
        player.textChannelId!
      )) as TextGuildChannel;
      if (!channel) return;
      const embed = new Embed()
        .setColor('Blurple')
        .setTitle(
          `🎶 ${track.info.title}`.substring(0, 256) +
            ' ' +
            client.ownEmojis.get('src_' + track.info.sourceName) ??
            track.info.sourceName
        )
        .setThumbnail(
          track.info.artworkUrl || track.pluginInfo?.artworkUrl || undefined
        )
        .setDescription(
          [
            `> - **Author:** ${track.info.author}`,
            `> - **Duration:** ${formatMS_HHMMSS(
              track.info.duration
            )} | Ends <t:${Math.floor(
              (Date.now() + track.info.duration) / 1000
            )}:R>`,
            `> - **Requester:** <@${(track.requester as CustomRequester).id}>`,
            track.pluginInfo?.clientData?.fromAutoplay
              ? `> *From Autoplay* ✅`
              : undefined,
          ]
            .filter((v) => typeof v === 'string' && v.length)
            .join('\n')
            .substring(0, 4096)
        )
        .setFooter({
          text: `Requested by ${
            (track.requester as CustomRequester)?.username
          }`,
          iconUrl: (track?.requester as CustomRequester)?.avatar || undefined,
        })
        .setTimestamp();
      // local tracks are invalid uris
      if (/^https?:\/\//.test(track.info.uri)) embed.setURL(track.info.uri);
      channel.messages.write({
        embeds: [embed],
      });
    })
    .on('trackEnd', (player, track, payload) => {
      console.log(player.guildId, ' :: Finished Playing :: ', track.info.title);
    })
    .on('trackError', (player, track, payload) => {
      console.log(
        player.guildId,
        ' :: Errored while Playing :: ',
        track?.info?.title,
        ' :: ERROR DATA :: ',
        payload
      );
    })
    .on('trackStuck', (player, track, payload) => {
      console.log(
        player.guildId,
        ' :: Got Stuck while Playing :: ',
        track?.info?.title,
        ' :: STUCKED DATA :: ',
        payload
      );
    })
    .on('queueEnd', async (player, track, payload) => {
      console.log(
        player.guildId,
        ' :: No more tracks in the queue, after playing :: ',
        track?.info?.title || track
      );
      const channel = (await client.channels.fetch(
        player.textChannelId!
      )) as TextGuildChannel;
      if (!channel) return;
      channel.messages.write({
        embeds: [
          new Embed().setColor('Red').setTitle('❌ Queue Ended').setTimestamp(),
        ],
      });
    })
    .on('playerUpdate', (player) => {
      // use this event to udpate the player in the your cache if you want to save the player's data(s) externally!
      /**
       *
       */
    });
}
