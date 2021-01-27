import { User } from "../../model/User";
import { Inject, Service } from "typedi";
import { DATABASE, IDatabase } from "../../Database";
import { Recipe } from "../../model/Recipe";
import { Record } from "neo4j-driver";
import { InstructionStep } from "../../model/InstructionStep";
import { Ingredient } from "../../model/Ingredient";
import { IngredientProvider } from "../ingredients/IngredientProvider";
import { Yield } from "../../model/Yield";

export const RECIPE_PROVIDER = "recipe-provider";

export interface IRecipeProvider {
  _mock_getRecipes(
    user: User,
    take: number,
    skip: number,
    availableIngredients: [string]
  ): Promise<Recipe[]>;

  getRecipes(
    user: User,
    take: number,
    skip: number,
    availableIngredients: [string],
    swipeTagsInclude: [string]
  ): Promise<Recipe[]>;
  findRecipe(recipeId: string): Promise<Recipe>;
  addToFavourites(recipeId: string, userId: string): Promise<Recipe>;
  findFavouriteRecipes(userId: string): Promise<Recipe[]>;
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

  async getRecipes(
    user: User,
    take: number,
    skip: number,
    availableIngredients: [string],
    swipeTagsInclude: [string]
  ): Promise<Recipe[]> {
    const session = this.db.getSession();
    try {
      let query = `
        // ranking-algorithm-v1
        // This algorithm consists of four stages.
        // 1. The recipes are filtered by preferences set by the user. If none to in- or exclude are set, the according step needs to be skipped.
        // 2. All recipes receive a rank that indicates the amount of ingredients matching the required ones.
        // 3. The ranks of the recipes are multiplied by a factor if the tag applies to the recipe. Otherwise [WIP], they will be factored out.
        // 3.5. User preferences are applied to adjust the ranking.
        // 4. The ranks of all recipes are sorted descending. The highest ranked recipes should be the best fits.
      `;

      if (user.uuid !== undefined) {
        query += `
          // Stage 1: Preferences
          WITH '${user.uuid}' AS uuid
          MATCH (r:Recipe)<-[:APPLIES]-(t:Tag)-[p:IS_PREF]->(u)
          WHERE u.uuid = uuid AND p.active = true
        `;
      } else {
        query += `
          // Stage 1: Preferences
          MATCH (r:Recipe)
        `;
      }

      query += `
        // Stage 2: Ingredients
        WITH ["${availableIngredients.join('", "')}"] AS ingredientIds, r AS r
        UNWIND ingredientIds AS ingredientId
        MATCH (r:Recipe)
        WHERE EXISTS {
          MATCH (r:Recipe)<-[u:USED_IN]-(i:Ingredient)
          WHERE i.ingredientId = ingredientId
        }
        WITH collect(r) AS recipes
        UNWIND recipes AS recipe
        
        // Stage 3: Tags/Swipes
        WITH recipe AS r, count(recipe) AS rank, ["${swipeTagsInclude.join(
          '", "'
        )}"] AS tagIds
        UNWIND tagIds AS tagId
        CALL {
          // Increase the rank when the tag matches
          WITH r, rank, tagId
          MATCH (r:Recipe)<-[:APPLIES]-(t:Tag)
          WHERE t.tagId = tagId
          RETURN r AS recipe, rank * 4 AS rankTagged
          
          UNION
          
          // Reset rank to 0 to exclude the recipe from factoring
          WITH r, rank, tagId
          MATCH (r:Recipe)<-[:APPLIES]-(t:Tag)
          WHERE t.tagId <> tagId
          RETURN r AS recipe, rank / 4 AS rankTagged
        }
        WITH collect(recipe) AS recipes, rankTagged AS rank
        UNWIND recipes AS recipe
        
        // Stage 4: Result aggregation and output
        WITH recipe, sum(rank) AS rank
        RETURN recipe, rank
        ORDER BY rank DESC
        SKIP ${skip} LIMIT ${take}
      `;

      const result = await session.run(query);

      const recipes: Recipe[] = result.records.map((r) =>
        RecipeProvider.recordToRecipe(r)
      );

      // copied from _mock_getRecipes(), can be improved
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
            `MATCH (recipe:Recipe {recipeId: $recipeId}) \n
              MATCH (ingredient:Ingredient {ingredientId: $ingredientId}) \n
              MATCH (recipe)<-[yield:USED_IN]-(ingredient) \n
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

        recipe.missingIngredients = ingredients.filter((ingredient) => {
          return !availableIngredients.includes(ingredient.id);
        }) as [Ingredient];
      }

      return recipes;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }

  async _mock_getRecipes(
    user: User,
    take: number,
    skip: number,
    availableIngredients: [string]
  ): Promise<Recipe[]> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        `MATCH (recipe:Recipe) RETURN recipe SKIP toInteger($skip) LIMIT toInteger($limit)`,
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
            `MATCH (recipe:Recipe {recipeId: $recipeId}) \n
              MATCH (ingredient:Ingredient {ingredientId: $ingredientId}) \n
              MATCH (recipe)<-[yield:USED_IN]-(ingredient) \n
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

        recipe.missingIngredients = ingredients.filter((ingredient) => {
          return !availableIngredients.includes(ingredient.id);
        }) as [Ingredient];
      }

      return recipes;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }

  async findRecipe(recipeId: string): Promise<Recipe> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        `MATCH (recipe:Recipe {recipeId: $recipeId})<-[:USED_IN]-(ingredient:Ingredient) 
        RETURN DISTINCT recipe, ingredient`,
        {
          recipeId: recipeId,
        }
      );

      // No recipe found, return
      if (result.records.length === 0) return null;

      const recipe = RecipeProvider.recordToRecipe(result.records[0]);
      recipe.ingredients = result.records.map((r) =>
        IngredientProvider.recordToIngredient(r)
      );

      for (const ingredient of recipe.ingredients) {
        const yieldResult = await session.run(
          `MATCH (:Recipe {recipeId: $recipeId})<-[yield:USED_IN]-(ingredient:Ingredient {ingredientId: $ingredientId})
          RETURN yield`,
          {
            recipeId: recipe.recipeId,
            ingredientId: ingredient.id,
          }
        );
        ingredient.yields = yieldResult.records.map((r) =>
          RecipeProvider.recordToYield(r)
        );
      }

      return recipe;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }

  async addToFavourites(recipeId: string, userId: string): Promise<Recipe> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        `MATCH (recipe:Recipe {recipeId: $recipeId}), (user:User {uuid: $userId})
        MERGE (user)-[:LIKED]->(recipe)
        RETURN recipe`,
        {
          recipeId: recipeId,
          userId: userId,
        }
      );

      // Recipe not found, return null
      if (result.records.length === 0) return null;

      return RecipeProvider.recordToRecipe(result.records[0]);
    } catch (e) {
      return Promise.reject(e);
    } finally {
      await session.close();
    }
  }

  async findFavouriteRecipes(userId: string): Promise<Recipe[]> {
    const session = this.db.getSession();
    try {
      const result = await session.run(
        `MATCH (:User {uuid: $userId})-[:LIKED]->(recipe:Recipe)
        RETURN recipe`,
        {
          userId: userId,
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
