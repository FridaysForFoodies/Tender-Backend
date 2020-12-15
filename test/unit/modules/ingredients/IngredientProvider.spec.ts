import { IngredientProvider } from "../../../../src/modules/ingredients/IngredientProvider";
import { DatabaseMock, mockResult } from "../../../__mocks__/Database";
import { int } from "neo4j-driver";
import { Ingredient } from "../../../../src/model/Ingredient";
import { Unit } from "../../../../src/model/Unit";
import * as faker from "faker";

beforeAll(() => {
  faker.seed(1337);
});

describe("All ingredients where name contains", () => {
  it("should return database result mapped to ingredient objects",  () => {
    const ingredient = new Ingredient(
      faker.random.number(),
      faker.random.word(),
      new Unit(
        faker.random.number(),
        faker.random.word(),
        faker.random.alpha({ count: 2 })
      ),
      faker.random.number(),
      faker.random.number()
    );

    const runMock = jest.fn().mockResolvedValue(mockResult([{
      ingredient: {
        identity: int(ingredient.id),
        properties: {
          name: ingredient.name,
          calories: int(ingredient.calories),
          searchCount: int(ingredient.searchCount)
        }
      },
      unit: {
        identity: int(ingredient.unit.id),
        properties: {
          name: ingredient.unit.name,
          abbreviation: ingredient.unit.abbreviation
        }
      }
    }]));
    const ingredientProvider = new IngredientProvider(new DatabaseMock({ runMock: runMock }));

    expect(ingredientProvider.getAllWhereNameContains("", 0)).resolves.toMatchObject([ingredient]);
  });

  it("should close the database session", async () => {
    const closeMock = jest.fn();
    const ingredientProvider = new IngredientProvider(new DatabaseMock({ closeMock: closeMock }));

    await ingredientProvider.getAllWhereNameContains("", 0);

    expect(closeMock.mock.calls).toHaveLength(1);
  });
});

describe("Popular ingredients", () => {
  it("should return database result mapped to ingredient objects",  () => {
    const ingredient = new Ingredient(
      faker.random.number(),
      faker.random.word(),
      new Unit(
        faker.random.number(),
        faker.random.word(),
        faker.random.alpha({ count: 2 })
      ),
      faker.random.number(),
      faker.random.number()
    );

    const runMock = jest.fn().mockResolvedValue(mockResult([{
      ingredient: {
        identity: int(ingredient.id),
        properties: {
          name: ingredient.name,
          calories: int(ingredient.calories),
          searchCount: int(ingredient.searchCount)
        }
      },
      unit: {
        identity: int(ingredient.unit.id),
        properties: {
          name: ingredient.unit.name,
          abbreviation: ingredient.unit.abbreviation
        }
      }
    }]));
    const ingredientProvider = new IngredientProvider(new DatabaseMock({ runMock: runMock }));

    expect(ingredientProvider.getPopular(1)).resolves.toMatchObject([ingredient]);
  });

  it("should close the database session", async () => {
    const closeMock = jest.fn();
    const ingredientProvider = new IngredientProvider(new DatabaseMock({ closeMock: closeMock }));

    await ingredientProvider.getPopular(1);

    expect(closeMock.mock.calls).toHaveLength(1);
  });
});
