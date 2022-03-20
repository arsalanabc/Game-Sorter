import * as express from 'express';
require('dotenv').config();
import ApiWrapper from './src/ApiWrapper';
import {
  gamesFilterByTeamId,
  gamesFilterOutByTeamId,
  sortDoubleHeaderGames,
  sortNonDoubleHeaderGames,
} from './src/GamesSorter';

const app = express();
const port = 3000;
const API_URL = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&language=en`;
// const API_KEY = process.env.API_KEY;
const apiWrapper = new ApiWrapper(API_URL);

app.get('/sort-games', async (req, res) => {
  if (!req) return;

  try {
    const { teamId, date } = req.query;

    const gamesFromMLBStats = await apiWrapper.getGames(date as string);
    const games = gamesFromMLBStats.dates[0].games;
    const filteredGames = gamesFilterByTeamId(
      parseInt(teamId as string),
      games,
    );
    const doubleHeaderGames = sortDoubleHeaderGames(filteredGames);
    const nonDoubleHeaderGames = sortNonDoubleHeaderGames(filteredGames);

    const filteredOutGames = gamesFilterOutByTeamId(
      parseInt(teamId as string),
      games,
    );

    gamesFromMLBStats.dates[0].games = [
      ...doubleHeaderGames,
      ...nonDoubleHeaderGames,
      ...filteredOutGames,
    ];
    res.header('Content-Type', 'application/json');
    res.send(JSON.stringify(gamesFromMLBStats, null, 2));
  } catch (error) {}
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
