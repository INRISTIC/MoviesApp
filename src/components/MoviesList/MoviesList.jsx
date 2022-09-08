import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { MoviesItem } from '../MoviesItem';
import { Context } from '../../context/genres-context';
import './MoviesList.css';

const MoviesList = () => {
  const { movies, ratedFilm, tabPane, guestSessionId } = useContext(Context);
  const movieDataFromBase = tabPane === '1' ? movies : ratedFilm;
  const elements = movieDataFromBase.map((movie) => {
    const { ...props } = movie;
    return (
      <li key={movie.id}>
        <MoviesItem {...props} guestSessionId={guestSessionId} />
      </li>
    );
  });
  return <ul className="listFilms">{elements}</ul>;
};

MoviesList.defaultProps = {
  movieDataFromBase: [],
  guestSessionId: '',
};

MoviesList.propTypes = {
  movieDataFromBase: PropTypes.instanceOf(Array),
  guestSessionId: PropTypes.string,
};
export default MoviesList;
