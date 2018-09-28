import React, { Component } from 'react'
import StarRating from './StarRating';


class Recipe extends Component {

  /*
  This is:
     - An image of the final product
     - A title e.g. Coriander-Spiced Pork
     - A rating out of 5, e.g. 3
     - A short description
     - A preparation time in minutes, e.g. 30
     - A list of ingredients, e.g. 340g Pork Chops, 1bsp Coriander, 3/4 cups Couscous
     - A list of instructions, e.g. "Wash and dry..." "Heat a medium pot..." "Meanwhile, heat a large non-stick pan..."
  */

  //TODO make ingredients an object that can be clicked and has its own page?

  constructor() {
    super();
    this.state = {
      img:"",
      title:"",
      rating:0,
      description:"",
      preparationTime:0,
      ingredients:[],
      instructions:[]
    }
  }

  componentDidMount() {
    this.setState({
      img:"https://recipeland.com/images/r/21338/7bc142d52b0eee85ff8a_550.jpg",
      title:"Betty Crocker Pancakes",
      rating:4,
      description:"This is the Betty Crocker pancake recipe, from the 6th Edition Betty Crocker Cookbook, to make pancakes from scratch. ",
      preparationTime:55,
      ingredients:["1 egg", "3/4 cup milk", "1 cup all-purpose flour", "1 tablespoon sugar", "2 tablespoons vegetable oil", "3 teasponns baking powder", "1/2 teaspoon salt"],
      instructions:["Beat egg with hand beater until fluffy", "beat in remaining ingredients just until mixed. "]
    });
  }

  render() {
    return (
      <div>
        <h5>{this.props.match.params.id}</h5>
        <img src={this.state.img} alt="" />
        <h2>{this.state.title}</h2>
        <StarRating starRating={this.state.rating} />
        <p>{this.state.description}</p>
        <p>Preparation time: {this.state.preparationTime} minutes</p>
        {this.state.ingredients.map(ingredient => <div>{ingredient}</div>)}
        {this.state.instructions.map(instruction => <div>{instruction}</div>)}
      </div>
    );
  }
}

export default Recipe;