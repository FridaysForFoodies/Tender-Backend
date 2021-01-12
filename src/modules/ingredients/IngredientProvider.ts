import { Ingredient } from "../../model/Ingredient";
import { Inject, Service } from "typedi";
import { DATABASE, IDatabase } from "../../Database";
import { Record } from "neo4j-driver";

export const INGREDIENT_PROVIDER = "ingredient-provider";

export interface IIngredientProvider {
  getAllWhereNameContains(query: string, count: number): Promise<Ingredient[]>;
  getPopular(count: number): Promise<Ingredient[]>;
  getPersonalCommon(count: number, userId: string): Promise<Ingredient[]>;
}

@Service(INGREDIENT_PROVIDER)
export class IngredientProvider implements IIngredientProvider {
  constructor(@Inject(DATABASE) private readonly db: IDatabase) {}

  public static recordToIngredient(record: Record): Ingredient {
    return new Ingredient(
      record.get("ingredient").properties.ingredientId,
      record.get("ingredient").properties.name,
      record.get("ingredient").properties.imagePath,
      (record.get("ingredient").properties.searchCount?.toInt() || 0)
    );
  }

  private static recordToPersonalIngredient(record: Record): Ingredient {
    return new Ingredient(
      record.get("ingredient").properties.ingredientId,
      record.get("ingredient").properties.name,
      record.get("ingredient").properties.imagePath,
      (record.get("relation").properties.searchCount?.toInt() || 0)
    )
  }

  async getAllWhereNameContains(
    query: string,
    count: number
  ): Promise<Ingredient[]> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        `MATCH (ingredient:Ingredient)
        WHERE ingredient.name CONTAINS $query 
        RETURN ingredient
        LIMIT toInteger($count)`,
        {
          query: query,
          count: count,
        }
      );
      return result.records.map((r) =>
        IngredientProvider.recordToIngredient(r)
      );
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
        `MATCH (ingredient:Ingredient)
        RETURN ingredient
        ORDER BY ingredient.searchCount DESC
        LIMIT toInteger($count)`,
        { count: count }
      );
      return result.records.map((r) =>
        IngredientProvider.recordToIngredient(r)
      );
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }

  async getPersonalCommon(count: number, userId: string): Promise<Ingredient[]> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        `MATCH (user: User { uuid: $userId })-[relation:SEARCHED_FOR]->(ingredient:Ingredient)
        RETURN ingredient, relation
        ORDER BY relation.searchCount DESC
        LIMIT toInteger($count)`,
        { count: count, userId: userId }
      );
      return result.records.map((r) =>
        IngredientProvider.recordToPersonalIngredient(r)
      );
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }
}
