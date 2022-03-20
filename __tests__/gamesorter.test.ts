import {
  gamesFilterByTeamId,
  gamesFilterOutByTeamId,
  isLive,
  sortByLiveGame,
  sortSingleSessionDhGames,
} from '../src/GamesSorter';

describe('Games Sorter', () => {
  const liveGame = { gameDate: Date.now() - 60 * 1000 * 60 }; // game started 1 minute ago
  const pastGame = { gameDate: Date.now() - 60 * 1000 * 60 * 5 };
  const futureGame = { gameDate: Date.now() + 60 * 1000 * 60 * 1 };
  const testGames = [
    {
      teams: {
        away: {
          team: {
            id: 110,
          },
        },
        home: {
          team: {
            id: 111,
          },
        },
      },
    },
    {
      teams: {
        away: {
          team: {
            id: 113,
          },
        },
        home: {
          team: {
            id: 114,
          },
        },
      },
    },
    {
      teams: {
        away: {
          team: {
            id: 123,
          },
        },
        home: {
          team: {
            id: 111,
          },
        },
      },
    },
    {
      teams: {
        away: {
          team: {
            id: 110,
          },
        },
        home: {
          team: {
            id: 123,
          },
        },
      },
    },
  ];
  it('should return empty games for non-existing team id', () => {
    const filteredGames = gamesFilterByTeamId(999, testGames);
    expect(filteredGames.length).toEqual(0);
  });

  it('should filter games by team id', () => {
    const filteredGames = gamesFilterByTeamId(123, testGames);
    filteredGames.forEach((g: any) => {
      expect(g.teams.away.team.id == 123 || g.teams.home.team.id == 123).toBe(
        true,
      );
    });
  });

  it('should filter games by team id 2', () => {
    const filteredGames = gamesFilterByTeamId(114, testGames);
    filteredGames.forEach((g: any) => {
      expect(g.teams.away.team.id == 114 || g.teams.home.team.id == 114).toBe(
        true,
      );
    });
  });

  it('should not remove any games for non-existing team id', () => {
    const filteredGames = gamesFilterOutByTeamId(999, testGames);
    expect(filteredGames).toEqual(testGames);
  });

  it('should filter out games by team id: 1', () => {
    const filteredGames = gamesFilterOutByTeamId(123, testGames);
    filteredGames.forEach((g: any) => {
      expect(g.teams.away.team.id != 123 && g.teams.home.team.id != 123).toBe(
        true,
      );
    });
  });

  it('should filter out games by team id: 2', () => {
    const filteredGames = gamesFilterOutByTeamId(111, testGames);
    filteredGames.forEach((g: any) => {
      expect(g.teams.away.team.id != 111 && g.teams.home.team.id != 111).toBe(
        true,
      );
    });
  });

  describe('isLive', () => {
    it('should return true if game is live', () => {
      expect(isLive({ gameDate: Date.now() - 60 * 1000 })).toBe(true); // game started 1 minute ago
      expect(isLive({ gameDate: Date.now() - 60 * 1000 * 60 })).toBe(true); // game started 1 hour ago
      expect(isLive({ gameDate: Date.now() - 60 * 1000 * 60 * 2.9 })).toBe(
        true,
      ); // game started 2.9 hours ago
      expect(isLive({ gameDate: Date.now() - 60 * 1000 * 60 * 3 })).toBe(false); // game started 2.9 hours ago
      expect(isLive({ gameDate: Date.now() - 60 * 1000 * 60 * 10 })).toBe(
        false,
      ); // game started 10 hours ago
      expect(isLive({ gameDate: Date.now() + 1000 })).toBe(false); // game will start in 1 second
      expect(isLive({ gameDate: Date.now() + 60 * 1000 * 60 })).toBe(false); // game will start in 1 hour
    });
  });

  describe('sortByLiveGame', () => {
    it('should return live game first', () => {
      expect(sortByLiveGame(pastGame, liveGame)).toStrictEqual([
        liveGame,
        pastGame,
      ]);
      expect(sortByLiveGame(liveGame, pastGame)).toStrictEqual([
        liveGame,
        pastGame,
      ]);
      expect(sortByLiveGame(futureGame, liveGame)).toStrictEqual([
        liveGame,
        futureGame,
      ]);
    });
  });

  describe('sortSingleSessionDhGames', () => {
    it('should sort first game by first if live', () => {
      const firstGame = { status: { startTimeTBD: false }, ...liveGame };
      const secondGame = { status: { startTimeTBD: true }, ...futureGame };

      expect(sortSingleSessionDhGames(secondGame, firstGame)).toStrictEqual([
        firstGame,
        secondGame,
      ]);
      expect(sortSingleSessionDhGames(firstGame, secondGame)).toStrictEqual([
        firstGame,
        secondGame,
      ]);
    });

    it('should sort second game by first if live', () => {
      const firstGame = { status: { startTimeTBD: false }, ...pastGame };
      const secondGame = { status: { startTimeTBD: true }, ...liveGame };

      expect(sortSingleSessionDhGames(secondGame, firstGame)).toStrictEqual([
        secondGame,
        firstGame,
      ]);
      expect(sortSingleSessionDhGames(firstGame, secondGame)).toStrictEqual([
        secondGame,
        firstGame,
      ]);
    });

    it('should sort by startTimeTBD for past games', () => {
      const firstGameInPast = { status: { startTimeTBD: false }, ...pastGame };
      const secondGameInPast = { status: { startTimeTBD: true }, ...pastGame };

      expect(
        sortSingleSessionDhGames(secondGameInPast, firstGameInPast),
      ).toStrictEqual([firstGameInPast, secondGameInPast]);
      expect(
        sortSingleSessionDhGames(firstGameInPast, secondGameInPast),
      ).toStrictEqual([firstGameInPast, secondGameInPast]);
    });

    it('should sort by startTimeTBD for future games', () => {
      const firstGameInFuture = {
        status: { startTimeTBD: false },
        ...futureGame,
      };
      const secondGameInFuture = {
        status: { startTimeTBD: true },
        ...futureGame,
      };

      expect(
        sortSingleSessionDhGames(secondGameInFuture, firstGameInFuture),
      ).toStrictEqual([firstGameInFuture, secondGameInFuture]);
      expect(
        sortSingleSessionDhGames(firstGameInFuture, secondGameInFuture),
      ).toStrictEqual([firstGameInFuture, secondGameInFuture]);
    });
  });
});
