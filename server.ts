import * as express from 'express';
require('dotenv').config();
import ApiWrapper from './src/ApiWrapper';
import { sortGames } from './src/GamesSorter';

export const app = express();
const port = 3000;
const API_URL = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&language=en`;
// const API_KEY = process.env.API_KEY;
const apiWrapper = new ApiWrapper(API_URL);

app.get('/test', (req, res) => {
  if (req) console.log('asds');

  res.status(200).json({ name: 'john' });
});
app.get('/sort-games', async (req, res) => {
  res.header('Content-Type', 'application/json');

  if (!('teamId' in req.query && 'date' in req.query)) {
    res
      .status(400)
      .send({ error: 'Missing required parameter teamId or date' });
    return;
  }

  try {
    const { teamId, date } = req.query;

    const gamesFromMLBStats = await apiWrapper.getGames(date as string);
    const sortedGames = sortGames(
      gamesFromMLBStats.dates[0].games,
      parseInt(teamId as string),
    );

    gamesFromMLBStats.dates[0].games = sortedGames;
    res.status(200).send(JSON.stringify(gamesFromMLBStats, null, 2));
  } catch (error) {}
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
