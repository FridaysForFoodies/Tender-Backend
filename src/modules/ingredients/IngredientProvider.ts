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
      record.get("i").identity.toNumber(),
      record.get("i").properties.name,
      new Unit(
        record.get("u").identity.toNumber(),
        record.get("u").properties.name,
        record.get("u").properties.abbreviation
      ),
      record.get("i").properties.calories.toNumber(),
      record.get("i").properties.searchCount.toNumber()
    );
  }

  async getAllWhereNameContains(query: string, count: number): Promise<Ingredient[]> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        `MATCH (i:Ingredient)-[:USES]->(u) 
        WHERE i.name CONTAINS $query 
        RETURN i, u
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
        `MATCH (i:Ingredient)-[:USES]->(u)
        RETURN i, u
        ORDER BY i.searchCount DESC
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
