import { Ingredient, Unit } from "../../src/model/Ingredient";
import { IIngredientProvider } from "../../src/modules/ingredients/IngredientProvider";

const ingredients = [
  new Ingredient(0, "Flour", Unit.GRAMS, 364, 152),
  new Ingredient(1, "Water", Unit.LITRES, 0, 25),
  new Ingredient(2, "Egg", Unit.PIECES, 155, 395),
  new Ingredient(3, "Salt", Unit.TEASPOONS, 0, 12),
  new Ingredient(4, "Bell Pepper", Unit.PIECES, 20, 492),
  new Ingredient(5, "Black Olives", Unit.GRAMS, 115, 125)
]

export const ingredientProviderMock = {
  getAllWhere: jest.fn(() => new Promise((resolve) => resolve(ingredients))),
  getPopular: jest.fn()
} as IIngredientProvider;
