import React from 'react'
import StarRating from './StarRating';
import {Link} from 'react-router-dom';
// eslint-disable-next-line
import { RecipeDefinition } from '../Lib/Api';

const Recipe = /**
 * @param {{ recipe: RecipeDefinition; }} props
 */
 props =>
  <div>
    <Link to={"/recipe/" + props.recipe.Id}><p>{props.recipe.Title}</p></Link>
    <span>{props.recipe.Time} minutes</span>
    <StarRating starRating={props.recipe.Rating} />
  </div>

const RecipeList = /**
 * @param {{ recipes: RecipeDefinition[] }} props
 */
 props =>
  <div>
    {props.recipes.map(recipe => <Recipe key={recipe.Id} recipe={recipe} />)}
  </div>

export default RecipeList;