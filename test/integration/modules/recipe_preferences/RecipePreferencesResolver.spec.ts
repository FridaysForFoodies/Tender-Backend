import testServer, { loadConfig } from "../../../__utils/testServer";
import { Container } from "typedi";
import { DATABASE, IDatabase } from "../../../../src/Database";
import { v4 as uuidv4 } from "uuid";
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
import mock = jest.mock;

let query;
let mutation;
let mock_user1: User;

const recipePreferencesForUserQuery = `query {
  recipePreferencesForUser {
    vegan
    vegetarian
    gluten
    dairy
  }
}`;

const setRecipePreferencesMutation = `mutation($prefs: RecipePreferencesInput!) {
  setRecipePreferencesForUser(preferences: $prefs) {
    vegan
    vegetarian
    gluten
    dairy
  }
}`;

beforeAll(async () => {
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
      new RecipePreferences(mock_user1, true, false, false, true),
      mock_user1
    );
  });

  it("should return RecipePreferences for User", async () => {
    const result = await query({ query: recipePreferencesForUserQuery });

    expect(result).toMatchObject({
      data: {
        recipePreferencesForUser: {
          dairy: mock_preferences.dairy,
          gluten: mock_preferences.gluten,
          vegan: mock_preferences.vegan,
          vegetarian: mock_preferences.vegetarian,
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
      new RecipePreferences(mock_user1, true, false, false, true),
      mock_user1
    );

    mock_preferences = new RecipePreferences(
      mock_user1,
      false,
      false,
      false,
      false
    );
  });

  it("should set RecipePreferences to new value and retrun it", async () => {
    const result = await mutation({
      mutation: setRecipePreferencesMutation,
      variables: {
        prefs: {
          dairy: mock_preferences.dairy,
          gluten: mock_preferences.gluten,
          vegan: mock_preferences.vegan,
          vegetarian: mock_preferences.vegetarian,
        },
      },
    });

    expect(result).toMatchObject({
      data: {
        setRecipePreferencesForUser: {
          dairy: mock_preferences.dairy,
          gluten: mock_preferences.gluten,
          vegan: mock_preferences.vegan,
          vegetarian: mock_preferences.vegetarian,
        },
      },
    });
  });
});
