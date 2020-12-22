import { User } from "../../model/User";
import { Inject, Service } from "typedi";
import { DATABASE, IDatabase } from "../../Database";
import { Recipe } from "../../model/Recipe";
import { Integer, Record } from "neo4j-driver";
import { InstructionStep } from "../../model/InstructionStep";

export const RECIPE_PROVIDER = "recipe-provider";

export interface IRecipeProvider {
  _mock_getRecipes(user: User, take: number, skip: number): Promise<Recipe[]>;
}

@Service(RECIPE_PROVIDER)
export class RecipeProvider implements IRecipeProvider {
  constructor(@Inject(DATABASE) private readonly db: IDatabase) {}

  private static parseInstructionStepJSON(steps: string): [InstructionStep] {
    return JSON.parse(steps).map((step) => {
      return new InstructionStep(
        step.instructions,
        step.imagePath,
        step.imageCaption
      );
    });
  }

  private static recordToRecipe(record: Record): Recipe {
    const properties = record.get("recipe").properties;
    return new Recipe(
      properties.recipeId,
      properties.name,
      properties.subtitle,
      properties.description,
      JSON.parse(properties.yieldOptions),
      properties.imagePath,
      properties.difficulty.toNumber(),
      properties.duration.toNumber(),
      RecipeProvider.parseInstructionStepJSON(properties.steps),
      null,
      null,
      null
    );
  }

  async _mock_getRecipes(
    user: User,
    take: number,
    skip: number
  ): Promise<Recipe[]> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        `MATCH (n:Recipe) RETURN n AS recipe SKIP toInteger($skip) LIMIT toInteger($limit)`,
        {
          limit: take,
          skip: skip,
        }
      );
      return result.records.map((r) => RecipeProvider.recordToRecipe(r));
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }
}
