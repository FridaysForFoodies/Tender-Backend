import { DatabaseMock, mockResult } from "../../../__mocks__/Database";
import * as faker from "faker";
import { User } from "../../../../src/model/User";
import { RecipePreferencesProvider } from "../../../../src/modules/recipe_preferences/RecipePreferencesProvider";
import { RecipePreferences } from "../../../../src/model/RecipePreferences";

let user: User;
let mock_recipePreferences: RecipePreferences;

beforeAll(() => {
  faker.seed(1337);

  user = new User("mock_uuid");
  mock_recipePreferences = new RecipePreferences(
    user,
    faker.random.boolean(),
    faker.random.boolean(),
    faker.random.boolean(),
    faker.random.boolean(),
    faker.random.number(60)
  );
});

describe("Get Recipe Prefernces from Database", () => {
  let recipePreferencesProvider: RecipePreferencesProvider;

  beforeEach(() => {
    const runMock = jest.fn().mockResolvedValue(
      mockResult([
        {
          prefs: {
            properties: {
              vegan: mock_recipePreferences.vegan,
              vegetarian: mock_recipePreferences.vegetarian,
              gluten: mock_recipePreferences.gluten,
              dairy: mock_recipePreferences.dairy,
              cookingTime: mock_recipePreferences.cookingTime,
            },
          },
        },
      ])
    );
    recipePreferencesProvider = new RecipePreferencesProvider(
      new DatabaseMock({ runMock: runMock })
    );
  });

  it("should return Recipe Preferences for User from Database", async () => {
    const result = recipePreferencesProvider.getRecipePreferences(user);

    await expect(result).resolves.toMatchObject(mock_recipePreferences);
  });

  it("should set or update Recipe Preferences for User and return it from Database", async () => {
    const result = recipePreferencesProvider.setRecipePreferences(
      mock_recipePreferences,
      user
    );

    await expect(result).resolves.toMatchObject(mock_recipePreferences);
  });
});
