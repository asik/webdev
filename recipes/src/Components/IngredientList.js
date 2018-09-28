import React from 'react';

const IngredientListItem = props =>
  <div>
    <span>{props.name}</span>
    <button type="button" onClick={() => props.onRemove(props.name)}>Remove</button>
  </div>

const IngredientList = props =>
  <div>
    <h3>{props.title}</h3>
    <ul>
      {props.ingredients.map(ingredient => <IngredientListItem key={ingredient} name={ingredient} onRemove={props.onRemove} />)}
    </ul>
  </div>

export default IngredientList;