import { Ingredient } from "../../src/model/Ingredient";
import { IIngredientProvider } from "../../src/modules/ingredients/IngredientProvider";
import { Unit } from "../../src/model/Unit";
import * as faker from "faker";

export const ingredientProviderMock = {
  getAllWhereNameContains: jest.fn(() => new Promise((resolve) => resolve(generateTestData())))
} as IIngredientProvider;

const generateTestData = () => {
  faker.seed(1337);

  const units = [];
  for (let i = 0; i < 3; i++) {
    units.push(new Unit(faker.random.number(), faker.random.word(), faker.random.alpha({ count: 2 })));
  }

  const ingredients = [];
  for (let i = 0; i < 10; i++) {
    ingredients.push(new Ingredient(faker.random.number(), faker.random.word(), units[faker.random.number(units.length)], faker.random.number()));
  }
  return ingredients;
}
