import * as ImmutableArray from './ImmutableArray';

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


export const searchIngredients = (searchString) => new Promise(function (resolve, reject) {

  const allMatches = 
    recipes
      .map(recipe => recipe.ingredients)
      .flat()
      .map(ingredient => ingredient.ingredient)
      .filter(ingredient => ingredient.includes(searchString));
  const matches =  ImmutableArray.uniqueValues(allMatches);

  setTimeout(function () {
    resolve(matches);
  }, 300);
});