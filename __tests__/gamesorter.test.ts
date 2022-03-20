import {
  gamesFilterByTeamId,
  gamesFilterOutByTeamId,
  isLive,
  sortByLiveGame,
  sortDoubleHeaderGames,
  sortGamesChronologically,
  sortNonDoubleHeaderGames,
  sortSingleSessionDhGames,
  sortSplitSessionDhGames,
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

  describe('sortSplitSessionDhGames', () => {
    it('should sort by live games', () => {
      expect(sortSplitSessionDhGames(liveGame, pastGame)).toStrictEqual([
        liveGame,
        pastGame,
      ]);
      expect(sortSplitSessionDhGames(pastGame, liveGame)).toStrictEqual([
        liveGame,
        pastGame,
      ]);
      expect(sortSplitSessionDhGames(futureGame, liveGame)).toStrictEqual([
        liveGame,
        futureGame,
      ]);
    });

    it('should sort by gameDate if not live', () => {
      expect(sortSplitSessionDhGames(futureGame, pastGame)).toStrictEqual([
        pastGame,
        futureGame,
      ]);

      const pastGame2 = { gameDate: Date.now() - 60 * 1000 * 60 * 4 }; // played 4 hrs ago
      const pastGame3 = { gameDate: Date.now() - 60 * 1000 * 60 * 9 }; // played 9 hrs ago
      expect(sortSplitSessionDhGames(pastGame2, pastGame3)).toStrictEqual([
        pastGame3,
        pastGame2,
      ]);
    });
  });

  describe('sortGamesChronologically', () => {
    it('should sort by gameDate', () => {
      const game1 = {
        gamePk: '1',
        gameDate: Date.now() - 60 * 1000 * 60 * 2,
      };
      const game2 = {
        gamePk: '2',
        gameDate: Date.now() - 60 * 1000 * 60 * 1,
      };
      const game3 = { gamePk: '3', gameDate: Date.now() };
      const game4 = {
        gamePk: '4',
        gameDate: Date.now() + 60 * 1000 * 60 * 1,
      };

      const expectedChronologicallySorted = [game1, game2, game3, game4];

      expect(
        sortGamesChronologically([game2, game1, game4, game3]),
      ).toStrictEqual(expectedChronologicallySorted);

      expect(
        sortGamesChronologically([game3, game2, game4, game1]),
      ).toStrictEqual(expectedChronologicallySorted);

      expect(
        sortGamesChronologically(expectedChronologicallySorted.reverse()),
      ).toStrictEqual(expectedChronologicallySorted);
    });
  });

  describe('sortNonDoubleHeaderGames', () => {
    it('should sort by gameDate', () => {
      const game1 = {
        gamePk: '1',
        doubleHeader: 'N',
        gameDate: Date.now() - 60 * 1000 * 60 * 2,
      };
      const game2 = {
        gamePk: '2',
        doubleHeader: 'N',
        gameDate: Date.now() - 60 * 1000 * 60 * 1,
      };
      const game3 = { gamePk: '3', gameDate: Date.now(), doubleHeader: 'N' };
      const game4 = {
        gamePk: '4',
        doubleHeader: 'N',
        gameDate: Date.now() + 60 * 1000 * 60 * 1,
      };

      const expected = [game1, game2, game3, game4];

      expect(
        sortNonDoubleHeaderGames([game2, game1, game4, game3]),
      ).toStrictEqual(expected);

      expect(
        sortNonDoubleHeaderGames([game3, game2, game4, game1]),
      ).toStrictEqual(expected);

      expect(
        sortNonDoubleHeaderGames([game4, game3, game2, game1]),
      ).toStrictEqual(expected);
    });
  });

  describe('sortDoubleHeaderGames', () => {
    it('should return empty for no games', () => {
      expect(sortDoubleHeaderGames([])).toStrictEqual([]);
    });
    it('should return empty for no DH games', () => {
      expect(
        sortDoubleHeaderGames([{ doubleHeader: 'N' }, { doubleHeader: 'N' }]),
      ).toStrictEqual([]);
    });

    it('should sort DH games first', () => {
      const game1 = { gamePk: '1', doubleHeader: 'N' };
      const game2 = {
        gamePk: '2',
        doubleHeader: 'Y',
        status: { startTimeTBD: false },
      };
      const game3 = {
        gamePk: '3',
        doubleHeader: 'Y',
        status: { startTimeTBD: true },
      };
      const game4 = { gamePk: '4', doubleHeader: 'S', gameDate: Date.now() };
      const game5 = { gamePk: '5', doubleHeader: 'N' };
      const game6 = {
        gamePk: '6',
        doubleHeader: 'S',
        gameDate: Date.now() + 1000,
      };

      expect(sortDoubleHeaderGames([game3, game2, game4, game1])).toStrictEqual(
        [game2, game3],
      );

      expect(sortDoubleHeaderGames([game6, game1, game4, game5])).toStrictEqual(
        [game4, game6],
      );
    });
  });
});
