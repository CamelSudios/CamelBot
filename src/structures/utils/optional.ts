import { CustomRequester } from '../../lavalink-events/Player.js';

export const requesterTransformer = (requester: any): CustomRequester => {
  // if it's already the transformed requester
  if (
    typeof requester === 'object' &&
    'avatar' in requester &&
    Object.keys(requester).length === 3
  )
    return requester as CustomRequester;
  // if it's still a discord.js User
  if (typeof requester === 'object' && 'displayAvatarURL' in requester) {
    // it's a user
    return {
      id: requester.id,
      username: requester.username,
      avatar: requester.displayAvatarURL(),
    };
  }
  // if it's non of the above
  return { id: requester!.toString(), username: 'unknown' }; // reteurn something that makes sense for you!
};
