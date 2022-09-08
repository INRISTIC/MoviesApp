import React, { Component } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

import { RateStars } from '../RateStars';
import './MoviesItem.css';

export default class MoviesItem extends Component {
  short_text(longText, maxLength) {
    let pos;
    return (pos = longText.indexOf(' ', maxLength)) === -1 ? longText : `${longText.substr(0, pos)}...`;
  }

  render() {
    const { genres, popularity, posterURL, filmTitle, releaseDate, overview, guestSessionId, rating, id } = this.props;
    const generesList = (
      <ul className="genresList">
        {genres.map((genre) => {
          return (
            <li className="genresItem" key={genre}>
              {genre}
            </li>
          );
        })}
      </ul>
    );

    const inputClasses = ['card-popularity-count'];
    if (popularity >= 3 && popularity < 5) {
      inputClasses.push('orange');
    }
    if (popularity >= 5 && popularity < 7) {
      inputClasses.push('yellow');
    }
    if (popularity >= 7) {
      inputClasses.push('green');
    }

    return (
      <div className="itemFilms">
        <div className="itemFilmsImg">
          <img src={posterURL} alt="1" className="" />
        </div>
        <div className="itemFilmsInformation">
          <div className="headerItem">
            <h3 className="titleFilm">{filmTitle}</h3>
            <span className={inputClasses.join(' ')}>{popularity}</span>
          </div>

          <div className="dateFilm">{releaseDate}</div>
          {generesList}
          <div className="descriptonFilm">{this.short_text(overview, 140)}</div>
          <RateStars id={id} guestSessionId={guestSessionId} rating={rating} />
        </div>
      </div>
    );
  }
}

MoviesItem.defaultProps = {
  guestSessionId: '',
};

MoviesItem.propTypes = {
  guestSessionId: PropTypes.string,
};
