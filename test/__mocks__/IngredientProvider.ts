import { Ingredient, Unit } from "../../src/model/Ingredient";
import { IIngredientProvider } from "../../src/modules/ingredients/IngredientProvider";

export const ingredientProviderMock = {
  getAllWhereNameContains: jest.fn(() => new Promise((resolve) => resolve([
    new Ingredient(0, "Flour", Unit.GRAMS, 364),
    new Ingredient(1, "Water", Unit.LITRES, 0),
    new Ingredient(2, "Egg", Unit.PIECES, 155),
    new Ingredient(3, "Salt", Unit.TEASPOONS, 0),
    new Ingredient(4, "Bell Pepper", Unit.PIECES, 20),
    new Ingredient(5, "Black Olives", Unit.GRAMS, 115)
  ])))
} as IIngredientProvider;
