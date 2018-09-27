import React, { Component } from 'react';
import SearchField from './SearchField';
import IngredientList from './IngredientList'
import HotIngredientList from './HotIngredientList';
import * as ImmutableArray from '../Lib/ImmutableArray';

const WithOrWithout = {
    With: Symbol("With"),
    Without: Symbol("Without")
}
Object.freeze(WithOrWithout);

class SearchByIngredient extends Component {

    constructor(){
        super();
        this.state={
            WithOrWithout: WithOrWithout.With,
            Withs: ["egg", "pasta", "cucumber", "super cucumber"],
            Withouts: ["lamb", "oh no", "not again"],
            IngredientsHotList: ["mamamia", "lalala"]
        }
    }

    onSubmit = e => {
        console.log(this.state);
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
        //TODO depending on another element state: with or without, add to either withs or withouts list
        this.setState({
            Withs: ImmutableArray.add(this.state.Withs, ingredient)
        });
    }

    render(){
        return (
            <div>
                <SearchField placeholder="By ingredient..." onSubmit={this.onSubmit}/>
                <HotIngredientList ingredients={this.state.IngredientsHotList} onAdd={this.onAddIngredient} />
                <IngredientList title="With" ingredients={this.state.Withs} onRemove={this.onRemoveWith} />
                <IngredientList title="Without" ingredients={this.state.Withouts} onRemove={this.onRemoveWithout} />
            </div>
        );
    }
}

export default SearchByIngredient;