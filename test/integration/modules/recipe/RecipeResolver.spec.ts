import testServer from "../../../__utils/testServer";
import { Container } from "typedi";
import { DATABASE, IDatabase } from "../../../../src/Database";

const TEST_RECIPE_ID = "5e886949c44d94aaee375a6e";
const TEST_INVALID_RECIPE_ID = "0022e730-10f8-460b-95e6-037d65940eaf";

let query;

const findRecipeQuery = `query {
  findRecipe(recipeId: "${TEST_RECIPE_ID}") {
    ID
  }
}`;

const findRecipeInvalidIDQuery = `query {
  findRecipe(recipeId: "${TEST_INVALID_RECIPE_ID}") {
    ID
  }
}`;

beforeAll(async () => {
  query = (await testServer()).query;
});

afterAll(async () => {
  await (Container.get(DATABASE) as IDatabase).close();
});

describe("QUERY find recipe by ID", () => {
  it("should return the recipe with the specified ID", async () => {
    const result = await query({ query: findRecipeQuery });

    expect(result.data.findRecipe.ID.toLowerCase())
      .toMatch(TEST_RECIPE_ID.toLowerCase());
  });

  it("should return null for invalid recipe ID", async () => {
    const result = await query({ query: findRecipeInvalidIDQuery });

    expect(result.data.findRecipe).toBeNull();
  });
});
