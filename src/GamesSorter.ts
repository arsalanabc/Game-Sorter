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

export function sortGamesChronologically(games: any[]) {
  return games.sort((gameA: any, gameB: any) => {
    return gameA.gameDate > gameB.gameDate ? 1 : -1;
  });
}

export function sortDoubleHeaderGames(games: any) {
  const singleSessionDhGames = games.filter((g: any) => {
    return g.doubleHeader == 'Y';
  });

  const splitSessionDhGames = games.filter((g: any) => {
    return g.doubleHeader == 'S';
  });

  if (singleSessionDhGames.length == 2) {
    return sortSingleSessionDhGames(
      singleSessionDhGames[0],
      singleSessionDhGames[1],
    );
  }

  if (splitSessionDhGames.length == 2) {
    return sortSplitSessionDhGames(
      splitSessionDhGames[0],
      splitSessionDhGames[1],
    );
  }

  return [];
}

export function sortNonDoubleHeaderGames(games: any) {
  const nonDoubleHeaderGames = games.filter((g: any) => {
    return g.doubleHeader == 'N';
  });

  const liveGame = nonDoubleHeaderGames.filter(isLive);
  const nonLiveGame = nonDoubleHeaderGames.filter((g) => !isLive(g));

  return [...liveGame, ...sortGamesChronologically(nonLiveGame)];
}

export function sortGames(games: any, teamId: number) {
  const filteredGames = gamesFilterByTeamId(teamId, games);
  const doubleHeaderGames = sortDoubleHeaderGames(filteredGames);
  const nonDoubleHeaderGames = sortNonDoubleHeaderGames(filteredGames);

  const filteredOutGames = gamesFilterOutByTeamId(teamId, games);

  return [...doubleHeaderGames, ...nonDoubleHeaderGames, ...filteredOutGames];
}
