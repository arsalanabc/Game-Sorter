import {
  gamesFilterByTeamId,
  gamesFilterOutByTeamId,
} from '../src/GamesSorter';

describe('Games Sorter', () => {
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
});
