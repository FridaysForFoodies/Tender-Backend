import { User } from "../../model/User";
import { Inject, Service } from "typedi";
import { DATABASE, IDatabase } from "../../Database";
import { Recipe } from "../../model/Recipe";
import { Integer, Record } from "neo4j-driver";
import { InstructionStep } from "../../model/InstructionStep";
import { Ingredient } from "../../model/Ingredient";
import { IngredientProvider } from "../ingredients/IngredientProvider";
import { Yield } from "../../model/Yield";

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

  private static recordToYield(record: Record): Yield {
    const properties = record.get("yield").properties;
    return new Yield(
      Number.parseFloat(properties.amount),
      properties.unit,
      Number.parseFloat(properties.yields)
    );
  }

  async _mock_getRecipes(
    user: User,
    take: number,
    skip: number
  ): Promise<Recipe[]> {
    const session = this.db.getSession();
    try {
      let result = await session.run(
        `MATCH (n:Recipe) RETURN n AS recipe SKIP toInteger($skip) LIMIT toInteger($limit)`,
        {
          limit: take,
          skip: skip,
        }
      );

      const recipes: Recipe[] = result.records.map((r) =>
        RecipeProvider.recordToRecipe(r)
      );

      for (const recipe of recipes) {
        const ingredientResult = await session.run(
          `MATCH (recipe:Recipe {recipeId: $recipeId}) \n
          MATCH (recipe)<-[:USED_IN]-(ingredient:Ingredient) \n
          RETURN ingredient`,
          {
            recipeId: recipe.recipeId,
          }
        );
        const ingredients: Ingredient[] = ingredientResult.records.map((r) =>
          IngredientProvider.recordToIngredient(r)
        );

        for (const ingredient of ingredients) {
          const yieldResult = await session.run(
            `MATCH (n:Recipe {recipeId: $recipeId}) \n
              MATCH (i:Ingredient {ingredientId: $ingredientId}) \n
              MATCH p=(n)<-[yield:USED_IN]-(i) \n
              RETURN yield`,
            {
              recipeId: recipe.recipeId,
              ingredientId: ingredient.id,
            }
          );
          ingredient.yields = yieldResult.records.map((r) =>
            RecipeProvider.recordToYield(r)
          ) as [Yield];
        }
        recipe.ingredients = ingredients as [Ingredient];

        const rand = Math.floor(Math.random() * (ingredients.length - 1) * 0.3);
        recipe.missingIngredients = ingredients.filter((value, index) => {
          return index < rand;
        }) as [Ingredient];
      }

      return recipes;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }
}
