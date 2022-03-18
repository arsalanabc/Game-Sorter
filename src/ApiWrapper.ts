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
    try {
      const response = await fetch(`${this.API}&${q}`);
      const data = await response.json();

      return data;
    } catch (error) {
      console.log('error', error);
    }
  }
}

export default ApiWrapper;
