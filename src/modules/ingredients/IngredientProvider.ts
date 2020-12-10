import { Ingredient, Unit } from "../../model/Ingredient";
import { Service } from "typedi";

export const INGREDIENT_PROVIDER = "ingredient-provider";

export interface IIngredientProvider {
  getAllWhere(filter: (Ingredient) => boolean): Promise<Ingredient[]>
  getPopular(count: number): Promise<Ingredient[]>
}

@Service(INGREDIENT_PROVIDER)
export class IngredientProvider implements IIngredientProvider {
  private readonly ingredients: Ingredient[] = [
    new Ingredient(0, "Flour", Unit.GRAMS, 364, 152),
    new Ingredient(1, "Water", Unit.LITRES, 0, 25),
    new Ingredient(2, "Egg", Unit.PIECES, 155, 395),
    new Ingredient(3, "Salt", Unit.TEASPOONS, 0, 12),
    new Ingredient(4, "Bell Pepper", Unit.PIECES, 20, 492),
    new Ingredient(5, "Black Olives", Unit.GRAMS, 115, 125)
  ];

  async getAllWhere(filter: (Ingredient) => boolean): Promise<Ingredient[]> {
    return this.ingredients.filter(filter);
  }

  async getPopular(count: number): Promise<Ingredient[]> {
    return this.ingredients
      .sort((a, b) => b.searchCount - a.searchCount)
      .slice(0, count);
  }
}
