import * as faker from "faker";
import { DatabaseMock, mockResult } from "../../../__mocks__/Database";
import { int, Result } from "neo4j-driver";
import { Recipe } from "../../../../src/model/Recipe";
import { InstructionStep } from "../../../../src/model/InstructionStep";
import { Ingredient } from "../../../../src/model/Ingredient";
import { Yield } from "../../../../src/model/Yield";
import { RecipeProvider } from "../../../../src/modules/recipe/RecipeProvider";

function generateRandomYields(): Yield[] {
  return [
    new Yield(
      faker.random.number(),
      faker.random.alpha(),
      2
    ),
    new Yield(
      faker.random.number(),
      faker.random.alpha(),
      3
    ),
    new Yield(
      faker.random.number(),
      faker.random.alpha(),
      4
    ),
  ];
}

function generateRandomIngredient(yields: Yield[]): Ingredient {
  return new Ingredient(
    faker.random.alphaNumeric(24),
    faker.random.word(),
    faker.system.filePath(),
    faker.random.number(),
    yields
  );
}

function generateRandomRecipe(yields): Recipe {
  const instructions = [];
  for (let i = 0; i < 6; ++i) {
    instructions.push(new InstructionStep(
      faker.random.words(),
      faker.system.filePath(),
      faker.random.words()
    ));
  }

  const ingredients = [];
  for (let i = 0; i < 10; ++i) {
    ingredients.push(generateRandomIngredient(yields))
  }

  return new Recipe(
    faker.random.uuid(),
    faker.random.words(),
    faker.random.words(),
    faker.random.words(),
    yields.map(y => y.yields),
    faker.system.filePath(),
    faker.random.number(3),
    faker.random.number(),
    instructions,
    ingredients,
    null,
    null
  );
}

function mockRecipeResult(recipe: Recipe): Result {
  const records = [];
  for (const ingredient of recipe.ingredients) {
    records.push({
      recipe: {
        properties: {
          recipeId: recipe.recipeId,
          name: recipe.name,
          subtitle: recipe.subtitle,
          description: recipe.description,
          yieldOptions: JSON.stringify(recipe.yieldOptions),
          imagePath: recipe.imagePath,
          difficulty: int(recipe.difficulty),
          duration: int(recipe.duration),
          steps: JSON.stringify(recipe.instructionSteps),
        }
      },
      ingredient: {
        properties: {
          ingredientId: ingredient.id,
          name: ingredient.name,
          imagePath: ingredient.imagePath,
          searchCount: int(ingredient.searchCount)
        }
      }
    });
  }
  return mockResult(records);
}

function mockYieldResult(yields: Yield[]): Result {
  const records = [];
  for (const _yield of yields) {
    records.push({
      yield: {
        properties: {
          amount: _yield.amount,
          unit: _yield.unit,
          yields: _yield.yields,
        }
      }
    });
  }

  return mockResult(records);
}

beforeAll(() => {
  faker.seed(1337);
});

describe("Find a recipe by its ID", () => {
  it("should return database result mapped to recipe object", async () => {
    const yields = generateRandomYields();
    const recipe = generateRandomRecipe(yields);

    const runMock = jest.fn()
      .mockResolvedValueOnce(mockRecipeResult(recipe))
      .mockResolvedValue(mockYieldResult(yields));
    const recipeProvider = new RecipeProvider(
      new DatabaseMock({ runMock: runMock })
    );

    const result = await recipeProvider.findRecipe("");

    expect(result).toMatchObject(recipe);
  });

  it("should close the database session", async () => {
    const closeMock = jest.fn();
    const recipeProvider = new RecipeProvider(
      new DatabaseMock({ closeMock: closeMock })
    );

    await recipeProvider.findRecipe("");

    expect(closeMock.mock.calls).toHaveLength(1);
  });
});
