import React, { Component } from 'react';
import SearchField from './SearchField';
import * as ApiMock from '../Lib/Api';

class SearchByTitle extends Component {

  onSubmit = e => {
    ApiMock.searchByTitle(e).then(results =>
      this.props.onSearchResults(results)
    );
  }

  render() {
    return (
      <SearchField placeholder="By title..." onSubmit={this.onSubmit} />
    );
  }
}

export default SearchByTitle;