import * as ImmutableArray from './ImmutableArray';
import Axios from 'axios';
import { isNullOrUndefined } from 'util';

export class Ingredient {
    /**
     * @param {string} name
     * @param {string} amount
     */
    constructor(name, amount) {
        this.Name = name;
        this.Amount = amount;
    }
}

export class RecipeDefinition {
    /**
     * @param {number} id
     * @param {string} title
     * @param {number} rating
     * @param {string} description
     * @param {number} time
     * @param {Ingredient[]} ingredients
     * @param {string[]} instructions,
     * @param {string} imageUrl
     */
    constructor(id, title, rating, description, time, ingredients, instructions, imageUrl){
        this.Id = id;
        this.Title = title;
        this.Rating = rating;
        this.Description = description;
        this.Time = time;
        this.Ingredients = ingredients;
        this.Instructions = instructions;
        this.ImageUrl = imageUrl;
    }
}

const recipes = [
    new RecipeDefinition(
        2345, 
        "Coriander-Spiced Pork",
        3,
        "This 30-min meal is full of fantastic different flavours. Citrusy-sweet coriander pork, fresh and tangy tomato salsa and jazzed up couscous are the complete package! A perfect spring dish!",
        30,
        [
            new Ingredient("pork chops", "340g"), 
            new Ingredient("cilantro", "1 tablespoon"),
            new Ingredient("vegetable broth concentrate", "1"),
            new Ingredient("couscous", "3/4 cup"),
            new Ingredient("roma tomato", "160g"),
            new Ingredient("parsley", "10g"),
            new Ingredient("green onions", "2"),
            new Ingredient("white wine vinegar", "1 tablespoon"),
        ],
        [
            "do this",
            "do that"
        ],
        "https//invalidurl.jpg"
    ),
    
    new RecipeDefinition(
        4321, 
        "Betty Crocker Pancakes",
        4,
        "This is the Betty Crocker pancake recipe, from the 6th Edition Betty Crocker Cookbook, to make pancakes from scratch.",
        55,
        [
            new Ingredient("egg", "1"), 
            new Ingredient("milk", "3/4 cup"),
            new Ingredient("all-purpose flour", "1 cup"),
            new Ingredient("sugar", "1 tablespoon"),
            new Ingredient("vegetable oil", "2 tablespoons"),
            new Ingredient("baking powder", "3 teaspoons"),
            new Ingredient("salt", "1/2 teaspoon")
        ],
        [
            "Beat egg with hand beater until fluffy", 
            "beat in remaining ingredients just until mixed. "
        ],
        "https://recipeland.com/images/r/21338/7bc142d52b0eee85ff8a_550.jpg"
    ),
    ]

// const recipes = [
//   {
//     id: 2345,
//     title: "Coriander-Spiced Pork",
//     rating: 3,
//     description: "This 30-min meal is full of fantastic different flavours. Citrusy-sweet coriander pork, fresh and tangy tomato salsa and jazzed up couscous are the complete package! A perfect spring dish!",
//     time: 30,
//     ingredients: [
//       {
//         ingredient: "pork chops",
//         amount: "340g"
//       },
//       {
//         ingredient: "cilantro",
//         amount: "1 tablespoon"
//       },
//       {
//         ingredient: "vegetable broth concentrate",
//         amount: "1"
//       },
//       {
//         ingredient: "couscous",
//         amount: "3/4 cup"
//       },
//       {
//         ingredient: "roma tomato",
//         amount: "160g"
//       },
//       {
//         ingredient: "parsley",
//         amount: "10g"
//       },
//       {
//         ingredient: "green onions",
//         amount: "2"
//       },
//       {
//         ingredient: "white wine vinegar",
//         amount: "1 tablespoon"
//       }
//     ]
//   },
//   {
//     id: 4321,
//     title: "Betty Crocker Pancakes",
//     rating: 4,
//     description: "This is the Betty Crocker pancake recipe, from the 6th Edition Betty Crocker Cookbook, to make pancakes from scratch.",
//     time: 55,
//     ingredients: [
//       {
//         ingredient: "egg",
//         amount: "1"
//       },
//       {
//         ingredient: "milk",
//         amount: "3/4 cup"
//       },
//       {
//         ingredient: "all-purpose flour",
//         amount: "1 cup"
//       },
//       {
//         ingredient: "sugar",
//         amount: "1 tablespoon"
//       },
//       {
//         ingredient: "vegetable oil",
//         amount: "2 tablespoons"
//       },
//       {
//         ingredient: "baking powder",
//         amount: "3 teaspoons"
//       },
//       {
//         ingredient: "salt",
//         amount: "1/2 teaspoon"
//       }
//     ]
//   }
// ]

export const getRecipeById = 
    /**
     * @param {number} id
     */
    id => 
        new Promise((resolve, reject) => {
            const res = recipes.find(r => r.Id === id)
            if (isNullOrUndefined(res)) {
                reject("A recipe with id " + id + " was not found");
            }
            else {
                resolve(res);
            }
        })


export const searchIngredients = (searchString) => new Promise((resolve, _reject) => {

  const allMatches =
    recipes
      .map(recipe => recipe.Ingredients)
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
        withs.every(with_ => recipe.Ingredients.some(ingredient => ingredient.Name === with_));
      const doesNotIncludeWithouts =
        withouts.every(without => !(recipe.Ingredients.some(ingredient => ingredient.Name === without)));
      return includesWiths && doesNotIncludeWithouts;
    });

  setTimeout(() => {
    resolve(matches);
  }, 300);
});

export const searchByTitle = (title) => new Promise((resolve, reject) => {
  const titleLowerCase = title.toLowerCase();
  const matches =
    recipes.filter(recipe => recipe.Title.toLowerCase().includes(titleLowerCase));

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
        failure => {
          console.log(failure); 
          reject();
        }
      );
});

export const logout = () => new Promise((resolve, reject) => {
  Axios.get(backendUrl + "/auth/logout")
    .then(
      _success => resolve(), 
      failure => {
        console.log(failure); 
        reject();
      }
    );
});

export const values = () => new Promise((resolve, reject) => {
  Axios.get(backendUrl + "/api/values", {withCredentials: true})
    .then(
      _success => resolve(), 
      failure => {
        console.log(failure); 
        reject();
      }
    );
});

export const register = (emailAddress, password) => new Promise((resolve, reject) => {
  Axios.post(backendUrl + "/auth/register", { EmailAddress: emailAddress, Password: password}, {withCredentials: true})
  .then(
    _success => resolve(), 
    failure => {
      console.log(failure); 
      reject();
    }
  );
})

// Axios.get("https://localhost:44349/api/values", {withCredentials: true})