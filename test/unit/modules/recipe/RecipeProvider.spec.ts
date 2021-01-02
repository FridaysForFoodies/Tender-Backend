import { IngredientProvider } from "../../../../src/modules/ingredients/IngredientProvider";
import { DatabaseMock, mockResult } from "../../../__mocks__/Database";
import { int, Result } from "neo4j-driver";
import { Ingredient } from "../../../../src/model/Ingredient";
import * as faker from "faker";

function mockIngredientResult(ingredient: Ingredient): Result {
  return mockResult([
    {
      ingredient: {
        properties: {
          ingredientId: ingredient.id,
          name: ingredient.name,
          imagePath: ingredient.imagePath,
          searchCount: int(ingredient.searchCount),
        },
      },
    },
  ]);
}
