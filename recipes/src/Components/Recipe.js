import React, {Component} from 'react'
import StarRating from './StarRating';
// eslint-disable-next-line
import { RecipeDefinition, getRecipeById } from '../Lib/Api';

export const RecipeComponent = /**
 * @param {{ recipe: RecipeDefinition; }} props
 */
 props =>     
    <div>
        <h5>{props.recipe.Id}</h5>
        <img src={props.recipe.ImageUrl} alt="" />
        <h2>{props.recipe.Title}</h2>
        <StarRating starRating={props.recipe.Rating} />
        <p>{props.recipe.Description}</p>
        <p>Preparation time: {props.recipe.Time} minutes</p>
        {props.recipe.Ingredients.map(ingredient => <div>{ingredient.Name}</div>)}
        {props.recipe.Instructions.map(instruction => <div>{instruction}</div>)}
    </div>

export class Recipe extends Component {

  //TODO make ingredients an object that can be clicked and has its own page?

  constructor() {
    super();
    this.state = {
      recipe: new RecipeDefinition(0, "", 0, "", 0, [], [], "")
    }
  }

  componentDidMount() {
    getRecipeById(parseInt(this.props.match.params.id, 10)).then(recipe =>
        this.setState({recipe: recipe})
    );

    // this.setState({
    //   img:"https://recipeland.com/images/r/21338/7bc142d52b0eee85ff8a_550.jpg",
    //   title:"Betty Crocker Pancakes",
    //   rating:4,
    //   description:"This is the Betty Crocker pancake recipe, from the 6th Edition Betty Crocker Cookbook, to make pancakes from scratch. ",
    //   preparationTime:55,
    //   ingredients:["1 egg", "3/4 cup milk", "1 cup all-purpose flour", "1 tablespoon sugar", "2 tablespoons vegetable oil", "3 teasponns baking powder", "1/2 teaspoon salt"],
    //   instructions:["Beat egg with hand beater until fluffy", "beat in remaining ingredients just until mixed. "]
    // });
  }

  render() {
    return <RecipeComponent recipe={this.state.recipe} />
    //   <div>
    //     <h5>{this.props.match.params.id}</h5>
    //     <img src={this.state.recipe.ImageUrl} alt="" />
    //     <h2>{this.state.recipe.Title}</h2>
    //     <StarRating starRating={this.state.recipe.Rating} />
    //     <p>{this.state.recipe.Description}</p>
    //     <p>Preparation time: {this.state.recipe.Time} minutes</p>
    //     {this.state.recipe.Ingredients.map(ingredient => <div>{ingredient}</div>)}
    //     {this.state.recipe.Instructions.map(instruction => <div>{instruction}</div>)}
    //   </div>
    // );
  }
}

export default Recipe;