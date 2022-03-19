import { gamesFilterByTeamId } from '../src/GamesSorter';

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
  it('should filter games by team id', async () => {
    const filteredGames = gamesFilterByTeamId(123, testGames);
    filteredGames.forEach((g: any) => {
      expect(g.teams.away.team.id == 123 || g.teams.home.team.id == 123).toBe(
        true,
      );
    });
  });

  it('should filter games by team id 2', async () => {
    const filteredGames = gamesFilterByTeamId(114, testGames);
    filteredGames.forEach((g: any) => {
      expect(g.teams.away.team.id == 114 || g.teams.home.team.id == 114).toBe(
        true,
      );
    });
  });
});
