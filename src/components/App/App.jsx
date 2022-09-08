import React, { Component } from 'react';
import store from 'store';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Alert, Empty, Layout, Pagination, Space, Spin } from 'antd';
import { format, parseISO } from 'date-fns';

import { Context } from '../../context/genres-context';
import MoviesService from '../../services/movies-sevice';
import { MoviesList } from '../MoviesList';
import { Search } from '../Search';
import outOfPosterImg from '../../assets/images/Out_Of_Poster.jpg';
import { Header } from '../Header';

import './App.css';
import 'antd/dist/antd.css';

export default class App extends Component {
  state = {
    movies: [],
    ratedFilm: [],
    genresList: [],
    isLoading: false,
    isError: false,
    notFound: false,
    searchQuery: '',
    numberPage: 1,
    totalPagesMovies: 0,
    totalPagesRateMovies: 0,
    guestSessionId: '',
    tabPane: '1',
  };

  getGenresList = () => {
    const callMovieDbService = new MoviesService();
    callMovieDbService
      .getGenersList()
      .then((body) => {
        this.setState({
          genresList: [...body.genres],
        });
      })
      .catch(() => {
        this.setState({
          isLoading: false,
          notFound: false,
          isError: true,
        });
      });
  };

  componentDidMount() {
    if (!store.get('guestSessionId')) {
      this.createGuestSession();
    } else {
      this.setState({
        guestSessionId: store.get('guestSessionId'),
      });
    }

    this.getGenresList();
  }

  searchMovies = () => {
    const { searchQuery, numberPage } = this.state;
    const callMovieDbService = new MoviesService();
    this.setState({
      movies: [],
      isLoading: true,
      notFound: false,
      isError: false,
    });

    if (searchQuery !== '') {
      callMovieDbService
        .searchMovies(searchQuery, numberPage)
        .then((item) => {
          this.setState({
            totalPagesMovies: item.total_pages,
            numberPage,
          });
          if (item.results.length === 0) {
            this.setState({
              isLoading: false,
              notFound: true,
            });
          }
          item.results.forEach((elm) => {
            this.addItemToList(elm);
          });
        })
        .catch(() => {
          this.setState({
            isLoading: false,
            notFound: false,
            isError: true,
          });
        });
    }
  };

  getRatedMovies = () => {
    const { guestSessionId, numberPage } = this.state;
    const callMovieDbService = new MoviesService();
    this.setState({
      ratedFilm: [],
      isLoading: true,
      notFound: false,
      isError: false,
    });
    callMovieDbService
      .getRatedMovies(guestSessionId, numberPage)
      .then((item) => {
        this.setState({
          totalPagesRateMovies: item.total_pages,
          numberPage,
        });
        if (item.results.length === 0) {
          this.setState({
            isLoading: false,
            notFound: true,
          });
        }
        item.results.forEach((elm) => {
          this.addRatedItemToList(elm);
        });
      })
      .catch(() => {
        this.setState({
          isLoading: false,
          notFound: false,
          isError: true,
        });
      });
  };

  getGenresFilm = (genresIds) => {
    const filmGenres = [];
    const { genresList } = this.state;
    // eslint-disable-next-line no-restricted-syntax
    for (const genreId of genresIds) {
      genresList.forEach((el) => {
        if (el.id === genreId) {
          filmGenres.push(el.name);
        }
      });
    }
    return filmGenres;
  };

  addItemToList = (item) => {
    const newItem = this.createItem(item);

    this.setState(({ movies }) => {
      const newDataStream = [...movies, newItem];
      return {
        movies: newDataStream,
        isLoading: false,
      };
    });
  };

  addRatedItemToList = (item) => {
    const newItem = this.createItem(item);

    this.setState(({ ratedFilm }) => {
      const newDataStream = [...ratedFilm, newItem];
      return {
        ratedFilm: newDataStream,
        isLoading: false,
      };
    });
  };

  createGuestSession = () => {
    const callMovieDbService = new MoviesService();
    callMovieDbService
      .guestSession()
      .then((body) => {
        store.set('guestSessionId', `${body.guest_session_id}`);
        this.setState({
          guestSessionId: body.guest_session_id,
          isLoading: false,
        });
      })
      .catch(() => {
        this.setState({
          isLoading: false,
          notFound: false,
          isError: true,
        });
      });
  };

  changeTab = (key) => {
    if (key === '2') {
      this.setState(
        {
          tabPane: key,
          numberPage: 1,
        },
        () => {
          this.getRatedMovies();
        }
      );
    } else {
      this.setState({
        notFound: false,
        tabPane: key,
        numberPage: 1,
      });
    }
  };

  createItem = (item) => {
    const releaseDate = item.release_date ? format(parseISO(item.release_date), 'MMMM dd, yyyy') : 'no release date';
    const filmTitle = item.title || 'Movie title not specified';
    const overview = item.overview || 'Movie overview not specified';
    const popularity = item.vote_average || 0;
    const rating = store.get(`${item.id}`) || item.rating || 0;
    let posterURL = `${outOfPosterImg}`;

    if (item.poster_path) {
      posterURL = `https://image.tmdb.org/t/p/original${item.poster_path}`;
    }

    const genres = this.getGenresFilm(item.genre_ids);

    return {
      id: item.id,
      filmTitle,
      posterURL,
      releaseDate,
      overview,
      popularity,
      rating,
      genres,
    };
  };

  searchQueryChange = (searchQuery) => {
    this.setState(
      {
        searchQuery,
        numberPage: 1,
      },
      () => {
        this.searchMovies();
      }
    );
  };

  changePage = (page) => {
    const { tabPane } = this.state;
    this.setState(
      {
        numberPage: page,
      },
      () => {
        if (tabPane === '1') {
          this.searchMovies();
        } else {
          this.getRatedMovies();
        }
      }
    );
  };

  render() {
    const {
      movies,
      isLoading,
      isError,
      notFound,
      totalPagesMovies,
      numberPage,
      totalPagesRateMovies,
      guestSessionId,
      tabPane,
      ratedFilm,
    } = this.state;
    const contextValue = { movies, ratedFilm, tabPane, guestSessionId };

    const totalPages = tabPane === '1' ? totalPagesMovies : totalPagesRateMovies;
    const foundMovies = notFound ? <Empty /> : <MoviesList />;
    const errorMessage = isError ? (
      <Alert message="Error" description="Rick and Morty stole movies" type="error" showIcon />
    ) : null;
    const spinner =
      isLoading && !isError ? (
        <div className="example">
          <Spin size="large" />
        </div>
      ) : null;
    const search = tabPane === '1' ? <Search searchQueryChange={this.searchQueryChange} movies={movies} /> : null;
    const pagination =
      totalPages > 0 && !isLoading ? (
        <Pagination
          defaultCurrent={1}
          current={numberPage}
          total={totalPages}
          showSizeChanger={false}
          onChange={this.changePage}
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        />
      ) : null;

    return (
      <div className="container">
        <Layout
          style={{
            background: 'none',
          }}
        >
          <Context.Provider value={contextValue}>
            <Header changeTab={this.changeTab} />
            {search}
            <Space direction="vertical" size="middle">
              {spinner}
              {foundMovies}
              {errorMessage}
              {pagination}
            </Space>
          </Context.Provider>
        </Layout>
      </div>
    );
  }
}
