import * as ImmutableArray from './ImmutableArray';
import Axios from 'axios';


const recipes = [
  {
    id: 2345,
    title: "Coriander-Spiced Pork",
    rating: 3,
    description: "This 30-min meal is full of fantastic different flavours. Citrusy-sweet coriander pork, fresh and tangy tomato salsa and jazzed up couscous are the complete package! A perfect spring dish!",
    time: 30,
    ingredients: [
      {
        ingredient: "pork chops",
        amount: "340g"
      },
      {
        ingredient: "cilantro",
        amount: "1 tablespoon"
      },
      {
        ingredient: "vegetable broth concentrate",
        amount: "1"
      },
      {
        ingredient: "couscous",
        amount: "3/4 cup"
      },
      {
        ingredient: "roma tomato",
        amount: "160g"
      },
      {
        ingredient: "parsley",
        amount: "10g"
      },
      {
        ingredient: "green onions",
        amount: "2"
      },
      {
        ingredient: "white wine vinegar",
        amount: "1 tablespoon"
      }
    ]
  },
  {
    id: 4321,
    title: "Betty Crocker Pancakes",
    rating: 4,
    description: "This is the Betty Crocker pancake recipe, from the 6th Edition Betty Crocker Cookbook, to make pancakes from scratch.",
    time: 55,
    ingredients: [
      {
        ingredient: "egg",
        amount: "1"
      },
      {
        ingredient: "milk",
        amount: "3/4 cup"
      },
      {
        ingredient: "all-purpose flour",
        amount: "1 cup"
      },
      {
        ingredient: "sugar",
        amount: "1 tablespoon"
      },
      {
        ingredient: "vegetable oil",
        amount: "2 tablespoons"
      },
      {
        ingredient: "baking powder",
        amount: "3 teaspoons"
      },
      {
        ingredient: "salt",
        amount: "1/2 teaspoon"
      }
    ]
  }
]


export const searchIngredients = (searchString) => new Promise((resolve, _reject) => {

  const allMatches =
    recipes
      .map(recipe => recipe.ingredients)
      .flat()
      .map(ingredient => ingredient.ingredient)
      .filter(ingredient => ingredient.includes(searchString));
  const matches = ImmutableArray.uniqueValues(allMatches);

  setTimeout(() => {
    resolve(matches);
  }, 300);
});

export const searchByIngredients = (withs, withouts) => new Promise((resolve, reject) => {
  const matches =
    recipes.filter(recipe => {
      const includesWiths =
        withs.every(with_ => recipe.ingredients.some(ingredient => ingredient.ingredient === with_));
      const doesNotIncludeWithouts =
        withouts.every(without => !(recipe.ingredients.some(ingredient => ingredient.ingredient === without)));
      return includesWiths && doesNotIncludeWithouts;
    });

  setTimeout(() => {
    resolve(matches);
  }, 300);
});

export const searchByTitle = (title) => new Promise((resolve, reject) => {
  const titleLowerCase = title.toLowerCase();
  const matches =
    recipes.filter(recipe => recipe.title.toLowerCase().includes(titleLowerCase));

  setTimeout(() => {
    resolve(matches);
  }, 300);
});

//let users = [{ Username: "john", Password: "123456"}]
let backendUrl = "https://localhost:44349"

export const login = (emailAddress, password) => new Promise((resolve, reject) => {  
    Axios
      .post(backendUrl + "/auth/login", { EmailAddress: emailAddress, Password: password}, {withCredentials: true})
      .then(
        _success => resolve(), 
        _failure => _failure => {console.log(_failure); reject();}
      );
});

export const logout = () => new Promise((resolve, reject) => {
  Axios.get(backendUrl + "/auth/logout")
    .then(
      _success => resolve(), 
      _failure => {console.log(_failure); reject();}
    );
});

export const values = () => new Promise((resolve, reject) => {
  Axios.get(backendUrl + "/api/values", {withCredentials: true})
    .then(
      _success => resolve(), 
      _failure => {console.log(_failure); reject();}
    );
});

export const register = (username, password) => new Promise((resolve, reject) => {

})

// Axios.get("https://localhost:44349/api/values", {withCredentials: true})