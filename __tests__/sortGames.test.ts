import { sortGames } from '../src/GamesSorter';

describe('SortGames', () => {
  const liveGame = { gameDate: Date.now() - 60 * 1000 }; // game started 1 minute ago
  const pastGame = { gameDate: Date.now() - 60 * 1000 * 60 * 5 };
  const pastGame2 = { gameDate: Date.now() - 60 * 1000 * 60 * 4 };
  const futureGame = { gameDate: Date.now() + 60 * 1000 * 60 * 1 };
  const futureGame1 = { gameDate: Date.now() + 60 * 1000 * 60 * 2 };

  const favouriteTeamId = 111;
  const favouriteTeam = {
    team: {
      id: favouriteTeamId,
    },
  };
  const gamesWithFavTeam = [
    {
      doubleHeader: 'N',
      teams: {
        away: {
          team: {
            id: 110,
          },
        },
        home: {
          ...favouriteTeam,
        },
      },
    },
    {
      doubleHeader: 'N',
      teams: {
        away: {
          team: {
            id: 123,
          },
        },
        home: {
          ...favouriteTeam,
        },
      },
    },
  ];
  const gamesWithOutFavTeam = [
    {
      doubleHeader: 'N',
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
      doubleHeader: 'N',
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

  it('no games by on the given date', () => {
    expect(sortGames([], favouriteTeamId).length).toBe(0);
  });
  it('no games by by favourite team', () => {
    expect(sortGames(gamesWithOutFavTeam, favouriteTeamId).length).toBe(2);
    expect(sortGames(gamesWithOutFavTeam, favouriteTeamId)).toStrictEqual(
      gamesWithOutFavTeam,
    );
  });

  describe('with games by favourite team', () => {
    it('sort fav team games on top', () => {
      let dummyGames = [
        ...gamesWithOutFavTeam,
        gamesWithFavTeam[0],
        ...gamesWithOutFavTeam,
        gamesWithFavTeam[1],
      ];

      const res = sortGames(dummyGames, favouriteTeamId);

      expect(res.length).toBe(6);
      expect(
        res[0].teams.away.team.id == favouriteTeamId ||
          res[0].teams.home.team.id == favouriteTeamId,
      ).toBe(true);
      expect(
        res[1].teams.away.team.id == favouriteTeamId ||
          res[1].teams.home.team.id == favouriteTeamId,
      ).toBe(true);
    });
  });

  describe('with past games by favourite team', () => {
    it('single session doubleheader games', () => {
      const singleSessionGameOne = {
        ...gamesWithFavTeam[0],
        doubleHeader: 'Y',
        status: { startTimeTBD: true },
      };
      const singleSessionGameTwo = {
        ...gamesWithFavTeam[1],
        doubleHeader: 'Y',
        status: { startTimeTBD: false },
      };
      let dummyGames = [
        ...gamesWithOutFavTeam,
        singleSessionGameOne,
        singleSessionGameTwo,
      ];

      const res = sortGames(dummyGames, favouriteTeamId);

      expect(res.length).toBe(4);
      expect(res[0]).toStrictEqual(singleSessionGameTwo);
      expect(res[1]).toStrictEqual(singleSessionGameOne);
    });

    it('split session doubleheader games', () => {
      const splitSessionGameOne = {
        ...gamesWithFavTeam[0],
        doubleHeader: 'S',
        ...pastGame,
      };
      const splitSessionGameTwo = {
        ...gamesWithFavTeam[0],
        doubleHeader: 'S',
        ...pastGame2,
      };
      let dummyGames = [
        splitSessionGameOne,
        ...gamesWithOutFavTeam,
        splitSessionGameTwo,
      ];

      const res = sortGames(dummyGames, favouriteTeamId);

      expect(res.length).toBe(4);
      expect(res[0]).toStrictEqual(splitSessionGameOne);
      expect(res[1]).toStrictEqual(splitSessionGameTwo);
    });

    describe('with future games by favourite team', () => {
      it('FUTURE GAMES: single session doubleheader games', () => {
        'this tested with past single session doubleheader games';
      });

      it('FUTURE GAMES: split session doubleheader games', () => {
        const splitSessionGameOne = {
          ...gamesWithFavTeam[0],
          doubleHeader: 'S',
          ...futureGame1,
        };
        const splitSessionGameTwo = {
          ...gamesWithFavTeam[0],
          doubleHeader: 'S',
          ...futureGame,
        };
        let dummyGames = [
          splitSessionGameOne,
          ...gamesWithOutFavTeam,
          splitSessionGameTwo,
        ];

        const res = sortGames(dummyGames, favouriteTeamId);

        expect(res.length).toBe(4);
        expect(res[0]).toStrictEqual(splitSessionGameTwo);
        expect(res[1]).toStrictEqual(splitSessionGameOne);
      });
    });

    describe('with live game by favourite team', () => {
      it('LIVE GAME: single game', () => {
        const gameLive = {
          ...gamesWithFavTeam[0],
          doubleHeader: 'N',
          ...liveGame,
        };
        let dummyGames = [...gamesWithOutFavTeam, gameLive];

        let res = sortGames(dummyGames, favouriteTeamId);

        expect(res.length).toBe(3);
        expect(res[0]).toStrictEqual(gameLive);
      });

      it('LIVE GAME: single session doubleheader games', () => {
        const singleSessionGameLive = {
          ...gamesWithFavTeam[0],
          doubleHeader: 'Y',
          ...liveGame,
          status: { startTimeTBD: true },
        };
        const singleSessionGameTwo = {
          ...gamesWithFavTeam[1],
          doubleHeader: 'Y',
          status: { startTimeTBD: false },
          ...pastGame,
        };
        const singleSessionGameThree = {
          ...gamesWithFavTeam[1],
          doubleHeader: 'Y',
          status: { startTimeTBD: false },
          ...futureGame,
        };
        let dummyGames = [
          ...gamesWithOutFavTeam,
          singleSessionGameLive,
          singleSessionGameTwo,
        ];

        let res = sortGames(dummyGames, favouriteTeamId);

        expect(res.length).toBe(4);
        expect(res[0]).toStrictEqual(singleSessionGameLive);
        expect(res[1]).toStrictEqual(singleSessionGameTwo);

        dummyGames = [
          singleSessionGameThree,
          ...gamesWithOutFavTeam,
          singleSessionGameLive,
        ];

        res = sortGames(dummyGames, favouriteTeamId);

        expect(res.length).toBe(4);
        expect(res[0]).toStrictEqual(singleSessionGameLive);
        expect(res[1]).toStrictEqual(singleSessionGameThree);
      });

      it('LIVE GAME: split session doubleheader games', () => {
        const splitSessionGameOne = {
          ...gamesWithFavTeam[0],
          doubleHeader: 'S',
          ...pastGame,
        };
        const splitSessionGameTwo = {
          ...gamesWithFavTeam[0],
          doubleHeader: 'S',
          ...futureGame,
        };
        const splitSessionGameLive = {
          ...gamesWithFavTeam[0],
          doubleHeader: 'S',
          ...liveGame,
        };

        let dummyGames = [
          splitSessionGameOne,
          ...gamesWithOutFavTeam,
          splitSessionGameLive,
        ];

        let res = sortGames(dummyGames, favouriteTeamId);

        expect(res.length).toBe(4);
        expect(res[0]).toStrictEqual(splitSessionGameLive);
        expect(res[1]).toStrictEqual(splitSessionGameOne);

        dummyGames = [
          ...gamesWithOutFavTeam,
          splitSessionGameLive,
          splitSessionGameTwo,
        ];

        res = sortGames(dummyGames, favouriteTeamId);

        expect(res.length).toBe(4);
        expect(res[0]).toStrictEqual(splitSessionGameLive);
        expect(res[1]).toStrictEqual(splitSessionGameTwo);
      });
    });
  });
});
