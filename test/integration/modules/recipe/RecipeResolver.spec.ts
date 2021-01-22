import testServer, { loadConfig } from "../../../__utils/testServer";
import { Container } from "typedi";
import { DATABASE, IDatabase } from "../../../../src/Database";
import {
  USER_PROVIDER,
  UserProvider,
} from "../../../../src/modules/user/UserProvider";

const TEST_RECIPE_ID = "5e886949c44d94aaee375a6e";
const TEST_INVALID_RECIPE_ID = "0022e730-10f8-460b-95e6-037d65940eaf";
const TEST_UUID = "0022e730-10f8-460b-95e6-037d65940eaf";

let query;
let mutation;
let mockUser;

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

const addRecipeToFavouritesQuery = `mutation {
  addRecipeToFavourites(recipeId: "${TEST_RECIPE_ID}") {
    ID
  }
}`;

const addRecipeToFavouritesInvalidIDQuery = `mutation {
  addRecipeToFavourites(recipeId: "${TEST_INVALID_RECIPE_ID}") {
    ID
  }
}`;

const findFavouriteRecipesQuery = `query {
  findFavouriteRecipes {
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

    expect(result.data.findRecipe.ID.toLowerCase()).toMatch(
      TEST_RECIPE_ID.toLowerCase()
    );
  });

  it("should return null for invalid recipe ID", async () => {
    const result = await query({ query: findRecipeInvalidIDQuery });

    expect(result.data.findRecipe).toBeNull();
  });
});

describe("MUTATION add recipe to favourites", () => {
  beforeAll(async () => {
    loadConfig();

    const userProvider = Container.get(USER_PROVIDER) as UserProvider;
    mockUser = await userProvider.createUserWithUUID(TEST_UUID);

    const server = await testServer({
      context() {
        return {
          user: mockUser,
        };
      },
    });
    mutation = server.mutate;
  });

  it("should return the recipe with the specified ID", async () => {
    const result = await mutation({ query: addRecipeToFavouritesQuery });

    expect(result.data.addRecipeToFavourites.ID.toLowerCase()).toMatch(
      TEST_RECIPE_ID.toLowerCase()
    );
  });

  it("should return null for invalid recipe ID", async () => {
    const result = await mutation({
      query: addRecipeToFavouritesInvalidIDQuery,
    });

    expect(result.data.addRecipeToFavourites).toBeNull();
  });
});

describe("QUERY find favourite recipes", () => {
  beforeAll(async () => {
    loadConfig();

    const userProvider = Container.get(USER_PROVIDER) as UserProvider;
    mockUser = await userProvider.createUserWithUUID(TEST_UUID);

    const server = await testServer({
      context() {
        return {
          user: mockUser,
        };
      },
    });
    query = server.query;
  });

  it("should return a list of favourite recipes", async () => {
    const result = await query({ query: findFavouriteRecipesQuery });

    result.data.findFavouriteRecipes.forEach((r) =>
      expect(r.ID.toLowerCase()).toMatch(TEST_RECIPE_ID.toLowerCase())
    );
  });
});
