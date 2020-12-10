import { IngredientProvider } from "../../../src/modules/ingredients/IngredientProvider";
import { Unit } from "../../../src/model/Ingredient";

let ingredientProvider: IngredientProvider;

beforeAll(() => {
  ingredientProvider = new IngredientProvider();
});

// TODO: Fix test as soon as provider is implemented correctly (not using sample data array)

describe("All ingredients where", () => {
  it("should return only the ingredients that fit the filter", () => {
    const filter = i => i.name == "Water" || i.name == "Bell Pepper";
    expect(ingredientProvider.getAllWhere(filter)).resolves.toMatchObject([
      {
        id: 1,
        name: "Water",
        unit: Unit.LITRES,
        calories: 0
      },
      {
        id: 4,
        name: "Bell Pepper",
        unit: Unit.PIECES,
        calories: 20
      }
    ])
  });
});

describe("Popular ingredients", () => {
  it("should return the specified number of ingredients", () => {
    const count = 3;
    expect(ingredientProvider.getPopular(count)).resolves.toHaveLength(count);
  });

  it("should return the ingredients with search count in descending order", async () => {
    const ingredients = await ingredientProvider.getPopular(3);
    for (let i = 1; i < ingredients.length; i++)
      expect(ingredients[i - 1].searchCount).toBeGreaterThanOrEqual(ingredients[i].searchCount);
  });
});
