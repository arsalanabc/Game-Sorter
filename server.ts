import * as express from 'express';
import ApiWrapper from './src/ApiWrapper';
require('dotenv').config();

const app = express();
const port = 3000;
const API_URL = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&language=en`;
// const API_KEY = process.env.API_KEY;
const apiWrapper = new ApiWrapper(API_URL);

app.get('/sort-games', async (req, res) => {
  if (!req) return;

  try {
    const { teamId, date } = req.query;

    const games = await apiWrapper.getGames(date as string);
    const filteredGames = gamesFilterByTeamId(teamId as string, games);
    const doubleHeaderFirst = sortByDoubleHeaderGames(filteredGames);

    const filteredOutGames = gamesFilterOutByTeamId(teamId as string, games);
    games.dates[0].games = [...doubleHeaderFirst, ...filteredOutGames];
    res.header('Content-Type', 'application/json');
    res.send(JSON.stringify(games, null, 2));
  } catch (error) {}
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

function gamesFilterByTeamId(teamId: string, games: any) {
  return games.dates[0].games.filter((g: any) => {
    return g.teams.away.team.id == teamId || g.teams.home.team.id == teamId;
  });
}
function gamesFilterOutByTeamId(teamId: string, games: any) {
  return games.dates[0].games.filter((g: any) => {
    return g.teams.away.team.id != teamId && g.teams.home.team.id != teamId;
  });
}

function sortByDoubleHeaderGames(games: any) {
  const singleSessionDhGames = games.filter((g: any) => {
    return g.doubleHeader == 'Y';
  });

  const splitSessionDhGames = games.filter((g: any) => {
    return g.doubleHeader == 'S';
  });

  const nonDoubleHeaderGames = games.filter((g: any) => {
    return g.doubleHeader == 'N';
  });
  return [
    ...singleSessionDhGames,
    ...splitSessionDhGames,
    ...nonDoubleHeaderGames,
  ];
}
