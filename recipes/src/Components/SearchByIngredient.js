import React, { Component } from 'react';
import SearchField from './SearchField';
import IngredientList from './IngredientList'
import HotIngredientList from './HotIngredientList';
import * as ImmutableArray from '../Lib/ImmutableArray';
import * as ApiStub from '../Lib/Api';

const WithOrWithout = {
  With: Symbol("With"),
  Without: Symbol("Without")
}
Object.freeze(WithOrWithout);

const WithOrWithoutSelector = props => {
  const text = props.withOrWithout === WithOrWithout.With ? "With" : "Without";
  return (
    <button type="button" onClick={_ => props.onClick()}>{text}</button>
  );
}

class SearchByIngredient extends Component {

  constructor() {
    super();
    this.state = {
      WithOrWithout: WithOrWithout.With,
      Withs: [],
      Withouts: [],
      IngredientsHotList: []
    }
  }

  onSubmit = e => {
    console.log(this.state);
  }

  onChange = e => {
    if (e.length > 2)
    {
      ApiStub.searchIngredients(e).then(result => 
        this.setState({
          IngredientsHotList: result
        }));
    }
    else
    {
      this.setState({
        IngredientsHotList: []
      })
    }
  }

  onRemoveWith = with_ => {
    const index = this.state.Withs.indexOf(with_);
    if (index > -1) {
      this.setState({
        Withs: ImmutableArray.removeAt(this.state.Withs, index)
      });
    }
  }

  onRemoveWithout = without => {
    const index = this.state.Withouts.indexOf(without);
    if (index > -1) {
      this.setState({
        Withouts: ImmutableArray.removeAt(this.state.Withouts, index)
      });
    }
  }

  onAddIngredient = ingredient => {
    this.setState(
      this.state.WithOrWithout === WithOrWithout.With
        ? { Withs: ImmutableArray.uniqueValues(ImmutableArray.add(this.state.Withs, ingredient)) }
        : { Withouts: ImmutableArray.uniqueValues(ImmutableArray.add(this.state.Withouts, ingredient)) }
    );
  }

  onWithOrWithoutClicked = () => {
    this.setState({
      WithOrWithout: this.state.WithOrWithout === WithOrWithout.With ? WithOrWithout.Without : WithOrWithout.With
    });
  }

  render() {
    return (
      <div>
        <SearchField placeholder="By ingredient..." onChange={this.onChange} onSubmit={this.onSubmit} />
        <WithOrWithoutSelector withOrWithout={this.state.WithOrWithout} onClick={this.onWithOrWithoutClicked} />
        <HotIngredientList ingredients={this.state.IngredientsHotList} onAdd={this.onAddIngredient} />
        <IngredientList title="With" ingredients={this.state.Withs} onRemove={this.onRemoveWith} />
        <IngredientList title="Without" ingredients={this.state.Withouts} onRemove={this.onRemoveWithout} />
      </div>
    );
  }
}

export default SearchByIngredient;