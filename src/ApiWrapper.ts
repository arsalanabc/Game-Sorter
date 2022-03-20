import fetch from 'cross-fetch';

class ApiWrapper {
  API: string;

  constructor(url: string) {
    this.API = `${url}`;
  }
  async getGames(date: string) {
    return await this.fetchCall(`date=${date}`);
  }

  private async fetchCall(q: string) {
    const response = await fetch(`${this.API}&${q}`);
    const data = await response.json();

    if (response.status != 200) {
      return {
        error: {
          statusText: response.statusText,
          status: response.status,
          ...data,
        },
      };
    }

    return data;
  }
}

export default ApiWrapper;
