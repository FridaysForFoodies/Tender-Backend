import testServer, { loadConfig } from "../../../__utils/testServer";
import { Container } from "typedi";
import { DATABASE, IDatabase } from "../../../../src/Database";
import { v4 as uuidv4 } from "uuid";
import * as faker from "faker";
import { User } from "../../../../src/model/User";
import {
  RECIPE_PREFERENCES_PROVIDER,
  RecipePreferencesProvider,
} from "../../../../src/modules/recipe_preferences/RecipePreferencesProvider";
import {
  USER_PROVIDER,
  UserProvider,
} from "../../../../src/modules/user/UserProvider";
import { RecipePreferences } from "../../../../src/model/RecipePreferences";

let query;
let mutation;
let mock_user1: User;

const recipePreferencesForUserQuery = `query {
  recipePreferencesForUser {
    vegan
    vegetarian
    glutenfree
    lactosefree
    cookingTime
  }
}`;

const setRecipePreferencesMutation = `mutation($prefs: RecipePreferencesInput!) {
  setRecipePreferencesForUser(preferences: $prefs) {
    vegan
    vegetarian
    glutenfree
    lactosefree
    cookingTime
  }
}`;

function mockRecipePreferences(user: User): RecipePreferences {
  return new RecipePreferences(
    user,
    faker.random.boolean(),
    faker.random.boolean(),
    faker.random.boolean(),
    faker.random.boolean(),
    faker.random.number(60)
  );
}

beforeAll(async () => {
  faker.seed(1337);
  loadConfig();

  const userProvider = Container.get(USER_PROVIDER) as UserProvider;
  mock_user1 = await userProvider.createUserWithUUID(uuidv4());

  const server = await testServer({
    context() {
      return {
        user: mock_user1,
      };
    },
  });
  query = server.query;
  mutation = server.mutate;
});

afterAll(async () => {
  await (Container.get(DATABASE) as IDatabase).close();
});

describe("QUERY get RecipePreferences", () => {
  let mock_preferences: RecipePreferences;

  beforeAll(async () => {
    const recipePrefProvider = Container.get(
      RECIPE_PREFERENCES_PROVIDER
    ) as RecipePreferencesProvider;

    mock_preferences = await recipePrefProvider.setRecipePreferences(
      mockRecipePreferences(mock_user1),
      mock_user1
    );
  });

  it("should return RecipePreferences for User", async () => {
    const result = await query({ query: recipePreferencesForUserQuery });

    expect(result).toMatchObject({
      data: {
        recipePreferencesForUser: {
          lactosefree: mock_preferences.lactosefree,
          glutenfree: mock_preferences.glutenfree,
          vegan: mock_preferences.vegan,
          vegetarian: mock_preferences.vegetarian,
          cookingTime: mock_preferences.cookingTime,
        },
      },
    });
  });
});

describe("MUTATION for RecipePreferences", () => {
  let mock_preferences: RecipePreferences;

  beforeAll(async () => {
    const recipePrefProvider = Container.get(
      RECIPE_PREFERENCES_PROVIDER
    ) as RecipePreferencesProvider;

    await recipePrefProvider.setRecipePreferences(
      mockRecipePreferences(mock_user1),
      mock_user1
    );

    mock_preferences = mockRecipePreferences(mock_user1);
  });

  it("should set RecipePreferences to new value and return it", async () => {
    const result = await mutation({
      mutation: setRecipePreferencesMutation,
      variables: {
        prefs: {
          lactosefree: mock_preferences.lactosefree,
          glutenfree: mock_preferences.glutenfree,
          vegan: mock_preferences.vegan,
          vegetarian: mock_preferences.vegetarian,
          cookingTime: mock_preferences.cookingTime,
        },
      },
    });

    expect(result).toMatchObject({
      data: {
        setRecipePreferencesForUser: {
          lactosefree: mock_preferences.lactosefree,
          glutenfree: mock_preferences.glutenfree,
          vegan: mock_preferences.vegan,
          vegetarian: mock_preferences.vegetarian,
          cookingTime: mock_preferences.cookingTime,
        },
      },
    });
  });
});
