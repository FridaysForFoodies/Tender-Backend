import { IngredientProvider } from "../../../../src/modules/ingredients/IngredientProvider";
import { Unit } from "../../../../src/model/Ingredient";

let ingredientProvider: IngredientProvider;

beforeAll(() => {
  ingredientProvider = new IngredientProvider();
});

describe("All ingredients where", () => {
  it("should return only the ingredients that fit the filter", () => {
    // TODO: Fix test as soon as provider is implemented correctly (not using sample data array)
    const filter = i => i.name == "Water" || i.name == "Bell Pepper";
    expect(ingredientProvider.getAllWhereNameContains(filter)).resolves.toMatchObject([
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
