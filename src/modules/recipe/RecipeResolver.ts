import { Arg, Query, Resolver } from "type-graphql";
import { Inject } from "typedi";
import { IRecipeProvider, RECIPE_PROVIDER } from "./RecipeProvider";
import { Recipe } from "../../model/Recipe";
import CurrentUser from "../../decorator/current_user";
import { User } from "../../model/User";
import { SearchOptionsInput } from "./SearchOptionsInput";

@Resolver(RecipeResolver)
export class RecipeResolver {
  constructor(
    @Inject(RECIPE_PROVIDER) private readonly recipeProvider: IRecipeProvider
  ) {}

  @Query(() => [Recipe])
  async searchForRecipes(
    @CurrentUser() user: User,
    @Arg("searchOptions") { ingredients, tags }: SearchOptionsInput
  ): Promise<Recipe[]> {
    return this.recipeProvider._mock_getRecipes(user);
  }
}
