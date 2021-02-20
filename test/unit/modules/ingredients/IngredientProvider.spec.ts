import { IngredientProvider } from "../../../../src/modules/ingredients/IngredientProvider";
import { DatabaseMock, mockResult } from "../../../__mocks__/Database";
import { int, Result } from "neo4j-driver";
import { Ingredient } from "../../../../src/model/Ingredient";
import * as faker from "faker";

export function generateRandomIngredient(): Ingredient {
  return new Ingredient(
    faker.random.alphaNumeric(24),
    faker.random.word(),
    faker.system.filePath(),
    faker.random.number()
  );
}

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

function mockPersonalIngredientResult(
  ingredient: Ingredient,
  personalSearchCount: number
): Result {
  return mockResult([
    {
      ingredient: {
        properties: {
          ingredientId: ingredient.id,
          name: ingredient.name,
          imagePath: ingredient.imagePath,
        },
      },
      relation: {
        properties: {
          searchCount: int(personalSearchCount),
        },
      },
    },
  ]);
}

beforeAll(() => {
  faker.seed(1337);
});

describe("All ingredients where name contains", () => {
  it("should return database result mapped to ingredient objects", async () => {
    const ingredient = generateRandomIngredient();

    const runMock = jest
      .fn()
      .mockResolvedValue(mockIngredientResult(ingredient));
    const ingredientProvider = new IngredientProvider(
      new DatabaseMock({ runMock: runMock })
    );

    const result = await ingredientProvider.getAllWhereNameContains("a", 0);

    expect(result).toMatchObject([ingredient]);
  });

  it("should close the database session", async () => {
    const closeMock = jest.fn();
    const ingredientProvider = new IngredientProvider(
      new DatabaseMock({ closeMock: closeMock })
    );

    await ingredientProvider.getAllWhereNameContains("a", 0);

    expect(closeMock.mock.calls).toHaveLength(1);
  });
});

describe("Popular ingredients", () => {
  it("should return database result mapped to ingredient objects", async () => {
    const ingredient = generateRandomIngredient();

    const runMock = jest
      .fn()
      .mockResolvedValue(mockIngredientResult(ingredient));
    const ingredientProvider = new IngredientProvider(
      new DatabaseMock({ runMock: runMock })
    );

    const result = await ingredientProvider.getPopular(1);

    expect(result).toMatchObject([ingredient]);
  });

  it("should close the database session", async () => {
    const closeMock = jest.fn();
    const ingredientProvider = new IngredientProvider(
      new DatabaseMock({ closeMock: closeMock })
    );

    await ingredientProvider.getPopular(1);

    expect(closeMock.mock.calls).toHaveLength(1);
  });
});

describe("Personal common ingredients", () => {
  it("should return database result mapped to ingredient objects", async () => {
    const ingredient = generateRandomIngredient();
    const personalSearchCount = faker.random.number();

    const runMock = jest
      .fn()
      .mockResolvedValue(
        mockPersonalIngredientResult(ingredient, personalSearchCount)
      );
    const ingredientProvider = new IngredientProvider(
      new DatabaseMock({ runMock: runMock })
    );

    ingredient.searchCount = personalSearchCount;
    const result = await ingredientProvider.getPersonalCommon(
      1,
      faker.random.uuid()
    );

    expect(result).toMatchObject([ingredient]);
  });

  it("should close the database session", async () => {
    const closeMock = jest.fn();
    const ingredientProvider = new IngredientProvider(
      new DatabaseMock({ closeMock: closeMock })
    );

    await ingredientProvider.getPersonalCommon(1, faker.random.uuid());

    expect(closeMock.mock.calls).toHaveLength(1);
  });
});
