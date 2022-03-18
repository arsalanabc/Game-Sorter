// import { assert } from 'chai';
import ApiWrapper from '../src/ApiWrapper';

describe('Api Wrapper', () => {
  const API_URL = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&language=en`;

  const apiWrapper: ApiWrapper = new ApiWrapper(API_URL);

  it('should should get games by date and team id', async () => {
    const games = await apiWrapper.getGames('2021-04-01', 113);

    expect(games).not.toBeNull;
    games.dates.forEach((d: any) => {
      expect(d.date).toEqual('2021-04-01');
      d.games.forEach((g: any) => {
        expect(
          g.teams.away.team.id == 113 || g.teams.home.team.id == 113,
        ).toEqual(true);
      });
    });
  });

  // xit('should call Weather by city', async () => {
  //   const CITY = 'Montreal';
  //   const cityWeather = await apiWrapper.weatherByCity(CITY);

  //   expect(cityWeather).not.toBeNull;
  //   expect(cityWeather).toHaveProperty('name');
  //   expect(cityWeather.name).toEqual(CITY);
  // });

  // xit('should call Weather by zip', async () => {
  //   const zipNY = '10001';
  //   const cityWeather = await apiWrapper.weatherByZip(zipNY);

  //   expect(cityWeather).not.toBeNull;
  //   expect(cityWeather.name).toEqual('New York');
  // });

  // xit('should call Weather by coordinates', async () => {
  //   const lon = -122.08;
  //   const lat = 37.39;
  //   const cityWeather = await apiWrapper.weatherByCoordinates(lat, lon);

  //   expect(cityWeather).not.toBeNull;
  //   expect(cityWeather).toHaveProperty('coord');
  //   expect(cityWeather.coord).toEqual({ lat, lon });
  // });
});
