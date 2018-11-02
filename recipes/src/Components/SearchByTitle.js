import React, { Component } from 'react';
import SearchField from './SearchField';
import * as Api from '../Lib/Api';

class SearchByTitle extends Component {

  onSubmit = e => {
    Api.values().then(success=>console.log(success));
    Api.searchByTitle(e).then(results =>
      this.props.onSearchResults(results)
    );
  }

  render() {
    return (
      <SearchField placeholder="By title..." onSubmit={e => this.onSubmit(e)} />
    );
  }
}

export default SearchByTitle;