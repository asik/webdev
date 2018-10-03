import React from 'react'
import StarRating from './StarRating';
import {Link} from 'react-router-dom';

const Recipe = props =>
  <div>
    <Link to={"/recipe/" + props.recipe.id}><p>{props.recipe.title}</p></Link>
    <span>{props.recipe.time} minutes</span>
    <StarRating starRating={props.recipe.rating} />
  </div>

const RecipeList = props =>
  <div>
    {props.recipes.map(recipe => <Recipe key={recipe.id} recipe={recipe} />)}
  </div>

export default RecipeList;