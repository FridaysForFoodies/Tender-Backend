import { Ingredient } from "../../model/Ingredient";
import { Inject, Service } from "typedi";
import { DATABASE, IDatabase } from "../../Database";
import { Unit } from "../../model/Unit";

export const INGREDIENT_PROVIDER = "ingredient-provider";

export interface IIngredientProvider {
  getAllWhereNameContains(filter: string): Promise<Ingredient[]>
}

@Service(INGREDIENT_PROVIDER)
export class IngredientProvider implements IIngredientProvider {

  constructor(@Inject(DATABASE) private readonly db: IDatabase) { }

  async getAllWhereNameContains(query: string): Promise<Ingredient[]> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        `MATCH (i:Ingredient)-[:USES]->(u) 
        WHERE i.name CONTAINS $query 
        RETURN i, u`,
        { query: query }
      );
      return result.records.map(r => new Ingredient(
        r.get("i").identity.toNumber(),
        r.get("i").properties.name,
        new Unit(r.get("u").identity.toNumber(), r.get("u").properties.name, r.get("u").properties.abbreviation),
        r.get("i").properties.calories.toNumber()
      ));
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }
}
