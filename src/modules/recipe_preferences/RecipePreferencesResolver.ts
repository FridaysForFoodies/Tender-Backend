import { Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { RecipePreferences } from "../../model/RecipePreferences";
import { RecipePreferencesInput } from "./RecipePreferencesInput";
import { User } from "../../model/User";
import CurrentUser from "../../decorator/current_user";

@Resolver(RecipePreferences)
export class RecipePreferencesResolver {
  @Query(() => RecipePreferences)
  async recipePreferencesForUser(
    @CurrentUser() user: User
  ): Promise<RecipePreferences> {
    return null;
  }

  @Mutation()
  async setRecipePreferencesForUser(
    @Args() { dairy, gluten, vegan, vegetarian }: RecipePreferencesInput,
    @CurrentUser() user: User
  ) {}
}
