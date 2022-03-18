// import { assert } from 'chai';
import ApiWrapper from '../src/ApiWrapper';

describe('Api Wrapper', () => {
  const API_URL = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&language=en`;

  const apiWrapper: ApiWrapper = new ApiWrapper(API_URL);

  it('should should get games by date', async () => {
    const games = await apiWrapper.getGames('2021-04-01');

    expect(games).not.toBeNull;
    games.dates.forEach((d: any) => {
      expect(d.date).toEqual('2021-04-01');
    });
  });
});
