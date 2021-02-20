import { Ingredient } from "../../model/Ingredient";
import { Arg, Args, ArgumentValidationError, Field, Query, Resolver } from "type-graphql";
import { IIngredientProvider, INGREDIENT_PROVIDER } from "./IngredientProvider";
import { Inject } from "typedi";
import CurrentUser from "../../decorator/current_user";
import { User } from "../../model/User";
import { Max } from "class-validator";
import { ResultCountArgs } from "../ResultCountArgs";

@Resolver(Ingredient)
export class IngredientResolver {
  constructor(
    @Inject(INGREDIENT_PROVIDER)
    private readonly ingredientProvider: IIngredientProvider
  ) {}

  @Query(() => [Ingredient], { nullable: true })
  async ingredientSuggestions(
    @Arg("query") query: string,
    @Args() { count }: ResultCountArgs
  ): Promise<Ingredient[]> {
    const ingredients = await this.ingredientProvider.getAllWhereNameContains(query, count);
    return ingredients.sort((left: Ingredient, right: Ingredient) =>
      left.name.indexOf(query) - right.name.indexOf(query));
  }

  @Query(() => [Ingredient])
  async popularIngredients(
    @Args() { count }: ResultCountArgs
  ): Promise<Ingredient[]> {
    return await this.ingredientProvider.getPopular(count);
  }

  @Query(() => [Ingredient])
  async personalCommonIngredients(
    @Args() { count }: ResultCountArgs,
    @CurrentUser() user: User
  ): Promise<Ingredient[]> {
    return await this.ingredientProvider.getPersonalCommon(count, user.uuid);
  }
}
