import { Arg, Args, Query, Resolver } from "type-graphql";
import { Inject } from "typedi";
import { IRecipeProvider, RECIPE_PROVIDER } from "./RecipeProvider";
import { Recipe } from "../../model/Recipe";
import CurrentUser from "../../decorator/current_user";
import { User } from "../../model/User";
import { SearchRecipesArgs } from "./SearchRecipesArgs";

@Resolver(RecipeResolver)
export class RecipeResolver {
  constructor(
    @Inject(RECIPE_PROVIDER) private readonly recipeProvider: IRecipeProvider
  ) {}

  @Query(() => [Recipe])
  async searchForRecipes(
    @CurrentUser() user: User,
    @Args() { take, skip, searchOptions }: SearchRecipesArgs
  ): Promise<Recipe[]> {
    return this.recipeProvider._mock_getRecipes(
      user,
      take,
      skip,
      searchOptions.ingredients,
      searchOptions.tags
    );
  }
}
