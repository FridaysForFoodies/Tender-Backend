import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { RecipePreferences } from "../../model/RecipePreferences";
import { RecipePreferencesInput } from "./RecipePreferencesInput";
import { User } from "../../model/User";
import CurrentUser from "../../decorator/current_user";
import { Inject } from "typedi";
import {
  IRecipePreferencesProvider,
  RECIPE_PREFERENCES_PROVIDER,
} from "./RecipePreferencesProvider";

@Resolver(RecipePreferences)
export class RecipePreferencesResolver {
  constructor(
    @Inject(RECIPE_PREFERENCES_PROVIDER)
    private readonly recipePreferencesProvider: IRecipePreferencesProvider
  ) {}

  @Query(() => RecipePreferences)
  async recipePreferencesForUser(
    @CurrentUser() user: User
  ): Promise<RecipePreferences> {
    return await this.recipePreferencesProvider.getRecipePreferences(user);
  }

  @Mutation(() => RecipePreferences)
  async setRecipePreferencesForUser(
    @Arg("preferences")
    { dairy, gluten, vegan, vegetarian, cookingTime }: RecipePreferencesInput,
    @CurrentUser() user: User
  ): Promise<RecipePreferences> {
    return await this.recipePreferencesProvider.setRecipePreferences(
      new RecipePreferences(
        user,
        vegan,
        vegetarian,
        gluten,
        dairy,
        cookingTime
      ),
      user
    );
  }
}
