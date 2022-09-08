export default class MoviesService {
  apiKey = 'fa05adf2fe449ee536048668ed27f755';

  baseUrl = 'https://api.themoviedb.org/3/';

  getDataFromServer = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error('Возникла проблема с fetch запросом: ', err.message);
      return err.message;
    }
  };

  searchMovies = async (searchQuery = '1', pageNumber = 1) => {
    const url = `${this.baseUrl}search/movie?api_key=${this.apiKey}&include_adult=false&query=${searchQuery}&page=${pageNumber}`;
    return await this.getDataFromServer(url);
  };

  guestSession = async () => {
    const url = `${this.baseUrl}authentication/guest_session/new?api_key=${this.apiKey}`;
    return await this.getDataFromServer(url);
  };

  getGenersList = async () => {
    const url = `${this.baseUrl}genre/movie/list?api_key=${this.apiKey}`;
    return await this.getDataFromServer(url);
  };

  setMovieRating = async (id, guestSessionToken, rate) => {
    const url = `${this.baseUrl}movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionToken}`;
    const body = {
      value: rate,
    };
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(body),
    }).catch((err) => {
      console.error('Возникла проблема с fetch запросом: ', err.message);
    });
  };

  deleteRateMovie = async (id, guestSessionToken) => {
    const url = `${this.baseUrl}movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionToken}`;
    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
    };
    await fetch(url, {
      method: 'DELETE',
      headers,
    });
  };

  getRatedMovies = async (guestSessionToken, pageNumber = 2) => {
    const url = `${this.baseUrl}guest_session/${guestSessionToken}/rated/movies?api_key=${this.apiKey}&page=${pageNumber}`;
    return await this.getDataFromServer(url);
  };
}
