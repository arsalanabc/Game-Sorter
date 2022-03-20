export function gamesFilterByTeamId(teamId: number, games: any) {
  return games.filter((g: any) => {
    return g.teams.away.team.id == teamId || g.teams.home.team.id == teamId;
  });
}

export function gamesFilterOutByTeamId(teamId: number, games: any) {
  return games.filter((g: any) => {
    return g.teams.away.team.id != teamId && g.teams.home.team.id != teamId;
  });
}

export function isLive(game: any) {
  const GAME_LENGTH_IN_SEC = 3 * 60 * 60 * 1000;
  const currentTime = Date.now();
  const gameTime = new Date(game.gameDate).getTime();
  const timeDiff = gameTime - currentTime;

  return timeDiff < 0 && timeDiff > -GAME_LENGTH_IN_SEC;
}

export function sortByLiveGame(gameA: any, gameB: any) {
  return isLive(gameB) ? [gameB, gameA] : [gameA, gameB];
}

export function sortSingleSessionDhGames(gameA: any, gameB: any) {
  const [firstGame, secondGame] =
    gameA.status.startTimeTBD == true ? [gameB, gameA] : [gameA, gameB];

  return sortByLiveGame(firstGame, secondGame);
}

export function sortSplitSessionDhGames(gameA: any, gameB: any) {
  const [firstGame, secondGame] =
    gameA.gameDate > gameB.gameDate ? [gameB, gameA] : [gameA, gameB];

  return sortByLiveGame(firstGame, secondGame);
}
