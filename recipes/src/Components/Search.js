import React, { Component } from 'react';
import SearchByTitle from './SearchByTitle';
import SearchByIngredient from './SearchByIngredient';
import RecipeList from './RecipeList';

const SearchMode = {
  ByTitle: Symbol("ByTitle"),
  ByIngredient: Symbol("ByIngredient")
}
Object.freeze(SearchMode);

class Search extends Component {
  constructor() {
    super();
    this.state = {
      SearchMode: SearchMode.ByTitle,
      Results: []
    }
  }

  onClickByTitle = () => {
    this.setState({ SearchMode: SearchMode.ByTitle });
  }

  onClickByIngredient = () => {
    this.setState({ SearchMode: SearchMode.ByIngredient });
  }

  onSearchResults = results => {
    console.log(results);
    this.setState({
      Results: results
    });
  }

  render = () => {
    const searchComponent =
      this.state.SearchMode === SearchMode.ByTitle 
        ? <SearchByTitle onSearchResults={this.onSearchResults}/> 
        : <SearchByIngredient onSearchResults={this.onSearchResults}/>;

    return (
      <div>
        {searchComponent}
        <button onClick={this.onClickByTitle}>By Title</button>
        <button onClick={this.onClickByIngredient}>By Ingredient</button>
        <RecipeList recipes={this.state.Results}/>
      </div>
    );
  }
}

export default Search;