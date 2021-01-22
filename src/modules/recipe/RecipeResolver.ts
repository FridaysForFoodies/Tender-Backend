import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";
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
    return this.recipeProvider.getRecipes(
      user,
      take,
      skip,
      searchOptions.ingredients,
      searchOptions.tags
    );
  }

  @Query(() => Recipe, { nullable: true })
  async findRecipe(@Arg("recipeId") recipeId: string): Promise<Recipe> {
    return this.recipeProvider.findRecipe(recipeId);
  }

  @Mutation(() => Recipe, { nullable: true })
  async addRecipeToFavourites(
    @Arg("recipeId") recipeId: string,
    @CurrentUser() user: User
  ): Promise<Recipe> {
    return this.recipeProvider.addToFavourites(recipeId, user.uuid);
  }

  @Query(() => [Recipe])
  async findFavouriteRecipes(@CurrentUser() user: User): Promise<Recipe[]> {
    return this.recipeProvider.findFavouriteRecipes(user.uuid);
  }
}
