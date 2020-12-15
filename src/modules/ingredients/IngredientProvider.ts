import { Ingredient } from "../../model/Ingredient";
import { Inject, Service } from "typedi";
import { DATABASE, IDatabase } from "../../Database";
import { Unit } from "../../model/Unit";
import { Record } from "neo4j-driver";

export const INGREDIENT_PROVIDER = "ingredient-provider";

export interface IIngredientProvider {
  getAllWhereNameContains(query: string, count: number): Promise<Ingredient[]>
  getPopular(count: number): Promise<Ingredient[]>
}

@Service(INGREDIENT_PROVIDER)
export class IngredientProvider implements IIngredientProvider {

  constructor(@Inject(DATABASE) private readonly db: IDatabase) { }

  private static recordToIngredient(record: Record): Ingredient {
    return new Ingredient(
      record.get("ingredient").identity.toNumber(),
      record.get("ingredient").properties.name,
      new Unit(
        record.get("unit").identity.toNumber(),
        record.get("unit").properties.name,
        record.get("unit").properties.abbreviation
      ),
      record.get("ingredient").properties.calories.toNumber(),
      record.get("ingredient").properties.searchCount.toNumber()
    );
  }

  async getAllWhereNameContains(query: string, count: number): Promise<Ingredient[]> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        `MATCH (ingredient:Ingredient)-[:USES]->(unit) 
        WHERE ingredient.name CONTAINS $query 
        RETURN ingredient, unit
        LIMIT toInteger($count)`,
        {
          query: query,
          count: count
        }
      );
      return result.records.map(r => IngredientProvider.recordToIngredient(r));
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }

  async getPopular(count: number): Promise<Ingredient[]> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        `MATCH (ingredient:Ingredient)-[:USES]->(unit)
        RETURN ingredient, unit
        ORDER BY ingredient.searchCount DESC
        LIMIT toInteger($count)`,
        { count: count }
      );
      return result.records.map(r => IngredientProvider.recordToIngredient(r));
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }
}
