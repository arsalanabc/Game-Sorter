import * as request from 'supertest';
import { app } from '../server';
import sampleOutput_1 from './../sortedSamples/2021-04-01';
import sampleOutput_2 from './../sortedSamples/2021-07-13';
import sampleOutput_3 from './../sortedSamples/2021-09-11';
import sampleOutput_4 from './../sortedSamples/2021-11-02';

describe('Api Smoke Test', () => {
  it('should return error message for missing input', async () => {
    let response = await request(app).get('/sort-games');

    expect(response.headers['content-type']).toMatch('application/json');
    expect(response.status).toEqual(400);

    expect(response.body.error).toEqual(
      'Missing required parameter teamId or date',
    );

    response = await request(app).get('/sort-games?teamId=123');

    expect(response.headers['content-type']).toMatch('application/json');
    expect(response.status).toEqual(400);

    expect(response.body.error).toEqual(
      'Missing required parameter teamId or date',
    );

    response = await request(app).get('/sort-games?date=123');

    expect(response.headers['content-type']).toMatch('application/json');
    expect(response.status).toEqual(400);

    expect(response.body.error).toEqual(
      'Missing required parameter teamId or date',
    );
  });

  it('should return valid response ', async () => {
    let response = await request(app).get(
      '/sort-games?teamId=134&date=2022-03-31',
    );

    expect(response.headers['content-type']).toMatch('application/json');
    expect(response.status).toEqual(200);
  });

  it('should maintain correct number of games ', async () => {
    const statsFromMLB = {
      totalGames: 14,
      date: '2022-03-31',
    };
    const response = await request(app).get(
      '/sort-games?teamId=134&date=2022-03-31',
    );

    expect(response.headers['content-type']).toMatch('application/json');
    expect(response.status).toEqual(200);
    expect(response.body.dates[0].date).toEqual(statsFromMLB.date);
    expect(response.body.dates[0].totalGames).toEqual(statsFromMLB.totalGames);
  });

  it('should maintain the same schema ', async () => {
    const statsFromMLB = {
      totalGames: 14,
      date: '2022-03-31',
    };
    const response = await request(app).get(
      '/sort-games?teamId=134&date=2022-03-31',
    );

    expect(response.headers['content-type']).toMatch('application/json');
    expect(response.status).toEqual(200);
    expect(response.body.dates[0].date).toEqual(statsFromMLB.date);
    expect(response.body.dates[0].totalGames).toEqual(statsFromMLB.totalGames);

    const data = response.body;

    expect(data).toHaveProperty('copyright');
    expect(data).toHaveProperty('totalItems');
    expect(data).toHaveProperty('totalEvents');
    expect(data).toHaveProperty('totalGames');
    expect(data).toHaveProperty('totalGamesInProgress');
    expect(data).toHaveProperty('dates');
    if (data.dates.length != 0) {
      expect(data.dates[0]).toHaveProperty('date');
      expect(data.dates[0]).toHaveProperty('totalItems');
      expect(data.dates[0]).toHaveProperty('totalEvents');
      expect(data.dates[0]).toHaveProperty('totalGames');
      expect(data.dates[0]).toHaveProperty('totalGamesInProgress');
      expect(data.dates[0]).toHaveProperty('games');
      expect(data.dates[0]).toHaveProperty('events');
      const games = data.dates[0].games;
      if (games.length != 0) {
        expect(games[0]).toHaveProperty('status.abstractGameState');

        expect(games[0]).toHaveProperty('gamePk');
        expect(games[0]).toHaveProperty('link');
        expect(games[0]).toHaveProperty('gameType');
        expect(games[0]).toHaveProperty('season');
        expect(games[0]).toHaveProperty('gameDate');
        expect(games[0]).toHaveProperty('officialDate');
        expect(games[0]).toHaveProperty('status');
        expect(games[0]).toHaveProperty('teams.away');
        expect(games[0]).toHaveProperty('teams.away.team');
        expect(games[0]).toHaveProperty('teams.home');
        expect(games[0]).toHaveProperty('teams.home.team');
        expect(games[0]).toHaveProperty('venue');

        expect(games[0]).toHaveProperty('content');
        expect(games[0]).toHaveProperty('gameNumber');
        expect(games[0]).toHaveProperty('publicFacing');
        expect(games[0]).toHaveProperty('doubleHeader');
        expect(games[0]).toHaveProperty('gamedayType');
        expect(games[0]).toHaveProperty('tiebreaker');
        expect(games[0]).toHaveProperty('calendarEventID');
        expect(games[0]).toHaveProperty('seasonDisplay');
        expect(games[0]).toHaveProperty('dayNight');
        expect(games[0]).toHaveProperty('scheduledInnings');
        expect(games[0]).toHaveProperty('reverseHomeAwayStatus');
        expect(games[0]).toHaveProperty('inningBreakLength');
        expect(games[0]).toHaveProperty('gamesInSeries');
        expect(games[0]).toHaveProperty('seriesGameNumber');
        expect(games[0]).toHaveProperty('seriesDescription');
        expect(games[0]).toHaveProperty('recordSource');
        expect(games[0]).toHaveProperty('ifNecessary');
        expect(games[0]).toHaveProperty('ifNecessaryDescription');
      }
    }
  });

  describe('check past key dates', () => {
    const dates = ['04/01/2021', '07/13/2021', '09/11/2021', '11/02/2021'];
    const formatedDates = dates.map((d) => {
      return new Date(d).toISOString().slice(0, 10);
    });

    const keyTeamsForKeyDates = [114, 160, 141, 117];
    const expectedOutput = [
      sampleOutput_1,
      sampleOutput_2,
      sampleOutput_3,
      sampleOutput_4,
    ];

    for (let i = 0; i < keyTeamsForKeyDates.length; i++) {
      it(`key date of ${formatedDates[i]} for team ${keyTeamsForKeyDates[i]}`, async () => {
        let response = await request(app).get(
          `/sort-games?teamId=${keyTeamsForKeyDates[i]}&date=${formatedDates[i]}`,
        );

        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.status).toEqual(200);
        expect(response.body).toStrictEqual(expectedOutput[i]);
      });
    }
  });
});
