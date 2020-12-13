import { Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { RecipiePreferences } from "../../model/RecipiePreferences";
import { RecipePreferencesInput } from "./RecipePreferencesInput";
import { User } from "../../model/User";

@Resolver(RecipiePreferences)
export class RecipiePreferencesResolver {
  @Query()
  async recipePreferencesForUser(@Ctx("user") user: User) {}

  @Mutation()
  async setRecipePreferencesForUser(
    @Args() { dairy, gluten, vegan, vegetarian }: RecipePreferencesInput,
    @Ctx("user") user: User
  ) {}
}
