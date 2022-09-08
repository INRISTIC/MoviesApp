import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Search.css';
import { Input } from 'antd';
import debounce from 'lodash.debounce';

export default class Search extends Component {
  onSearch = (event) => {
    const { searchQueryChange } = this.props;
    const trimUserRequest = event.target.value.replace(/ +/g, ' ').trim();
    searchQueryChange(trimUserRequest);
  };

  render() {
    return (
      <Input
        style={{ marginBottom: '32px' }}
        placeholder="Type to search..."
        size="large"
        onChange={debounce(this.onSearch, 1000)}
      />
    );
  }
}

Search.defaultProps = {
  searchQueryChange: () => {},
};

Search.propTypes = {
  searchQueryChange: PropTypes.func,
};
