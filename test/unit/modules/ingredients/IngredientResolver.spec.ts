import { IngredientResolver } from "../../../../src/modules/ingredients/IngredientResolver";
import { ingredientProviderMock } from "../../../__mocks__/IngredientProvider";

let ingredientResolver: IngredientResolver;

beforeAll(() => {
  ingredientResolver = new IngredientResolver(ingredientProviderMock);
});

describe("Ingredients Suggestions Endpoint", () => {
  it("should return the specified number of ingredients", async () => {
    const count = 5;
    const result = await ingredientResolver.ingredientSuggestions("", count);
    expect(result.length).toBe(count);
  });
});
