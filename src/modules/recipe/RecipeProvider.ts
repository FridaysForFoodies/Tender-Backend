import { User } from "../../model/User";
import { Inject, Service } from "typedi";
import { DATABASE, IDatabase } from "../../Database";
import { Recipe } from "../../model/Recipe";
import { Record } from "neo4j-driver";

export const RECIPE_PROVIDER = "recipe-provider";

export interface IRecipeProvider {
  _mock_getRecipes(user: User): Promise<Recipe[]>;
}

@Service(RECIPE_PROVIDER)
export class RecipeProvider implements IRecipeProvider {
  constructor(@Inject(DATABASE) private readonly db: IDatabase) {}

  private static recordToRecipe(record: Record): Recipe {
    const properties = record.get("recipe").properties;
    return new Recipe(
      properties.recipeId,
      properties.name,
      properties.subtitle,
      properties.description,
      properties.yieldOptions,
      properties.imagePath,
      properties.difficulty,
      properties.duration,
      JSON.parse(properties.instructionSteps),
      null,
      null
    );
  }

  async _mock_getRecipes(user: User): Promise<Recipe[]> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        `MATCH (n:Recipe) RETURN n AS recipe LIMIT 5`
      );
      return result.records.map((r) => RecipeProvider.recordToRecipe(r));
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }
}
