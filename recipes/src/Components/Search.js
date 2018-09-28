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
      SearchMode: SearchMode.ByTitle
    }
  }

  onClickByTitle = () => {
    this.setState({ SearchMode: SearchMode.ByTitle });
  }

  onClickByIngredient = () => {
    this.setState({ SearchMode: SearchMode.ByIngredient });
  }

  render() {
    const searchComponent =
      this.state.SearchMode === SearchMode.ByTitle ? <SearchByTitle /> : <SearchByIngredient />;

    return (
      <div>
        {searchComponent}
        <button onClick={this.onClickByTitle}>By Title</button>
        <button onClick={this.onClickByIngredient}>By Ingredient</button>
        <RecipeList recipes={[
          { id:1234, title: "Coriander-Spiced Pork", time:30, starRating:3},
          { id:4321,title: "Rich Lamb Ragu", time:20, starRating:5}
        ]}/>
      </div>
    );
  }
}

export default Search;