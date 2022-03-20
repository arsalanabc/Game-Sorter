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
