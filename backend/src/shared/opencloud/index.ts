import axios from 'axios';

class OpenCloud {
  constructor(private apiKey: string) {}

  async restrictUser(
    universeId: number,
    userId: number,
    publicReason: string,
    privateReason: string,
  ) {
    axios
      .patch(
        `https://apis.roblox.com/cloud/v2/universes/${universeId}/user-restrictions/${userId}?updateMask=game_join_restriction&idempotencyKey.key=${Date.now()}&idempotencyKey.firstSent=${new Date().toISOString()}`,
        {
          gameJoinRestriction: {
            active: true,
            privateReason: privateReason,
            displayReason: publicReason,
            excludeAltAccounts: true,
            inherited: true,
          },
        },
        {
          headers: {
            ['x-api-key']: this.apiKey,
          },
        },
      )
      .then((response) => {
        return response.data;
      })
      .catch(() => {
        return 'Error';
      });
  }

  async unrestrictUser(universeId: number, userId: number) {
    axios
      .patch(
        `https://apis.roblox.com/cloud/v2/universes/${universeId}/user-restrictions/${userId}?updateMask=game_join_restriction&idempotencyKey.key=${Date.now()}&idempotencyKey.firstSent=${new Date().toISOString()}`,
        {
          gameJoinRestriction: {
            active: false,
          },
        },
        {
          headers: {
            ['x-api-key']: this.apiKey,
          },
        },
      )
      .then((response) => {
        return response.data;
      })
      .catch(() => {
        return 'Error';
      });
  }
}

export default OpenCloud;
