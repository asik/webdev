import React, { Component } from 'react';
import SearchField from './SearchField';

class SearchByTitle extends Component {

    onSubmit = e => {
        alert(e); //TODO actually search and display results
    }

    render(){
        return (
            <SearchField placeholder="By title..." onSubmit={this.onSubmit} />
        );
    }
}

export default SearchByTitle;