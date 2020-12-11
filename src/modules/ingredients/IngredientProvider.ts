import { Ingredient, Unit } from "../../model/Ingredient";
import { Inject, Service } from "typedi";
import { DATABASE, IDatabase } from "../../Database";

export const INGREDIENT_PROVIDER = "ingredient-provider";

export interface IIngredientProvider {
  getAllWhereNameContains(filter: string): Promise<Ingredient[]>
}

@Service(INGREDIENT_PROVIDER)
export class IngredientProvider implements IIngredientProvider {

  constructor(@Inject(DATABASE) private readonly db: IDatabase) { }

  async getAllWhereNameContains(filter: string): Promise<Ingredient[]> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        "MATCH (i:Ingredient) WHERE i.name CONTAINS $filter RETURN i",
        { filter: filter }
      );
      return result.records
        .map(r => r.get("i").properties)
        .map(i => new Ingredient(0, i.name, Unit.GRAMS, i.calories.toNumber()));
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }
}
