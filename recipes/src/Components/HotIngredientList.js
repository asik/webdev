import React from "react";

const HotIngredientItem = props =>
    <div>
        <span>{props.name}</span>
        <button type="button" onClick={() => props.onAdd(props.name)}>Add</button>
    </div>

const HotIngredientList = props =>
    <div>
        {props.ingredients.map(ingredient => <HotIngredientItem key={ingredient} name={ingredient} onAdd={props.onAdd} />)}
    </div>

export default HotIngredientList;