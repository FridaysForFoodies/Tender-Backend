import { Ingredient } from "../../model/Ingredient";
import { Arg, Query, Resolver } from "type-graphql";
import { IIngredientProvider, INGREDIENT_PROVIDER } from "./IngredientProvider";
import { Inject } from "typedi";
import CurrentUser from "../../decorator/current_user";
import { User } from "../../model/User";

@Resolver(Ingredient)
export class IngredientResolver {
  constructor(
    @Inject(INGREDIENT_PROVIDER)
    private readonly ingredientProvider: IIngredientProvider
  ) {}

  @Query(() => [Ingredient], { nullable: true })
  async ingredientSuggestions(
    @Arg("query") query: string,
    @Arg("count", { defaultValue: 5 }) count: number
  ): Promise<Ingredient[]> {
    return await this.ingredientProvider.getAllWhereNameContains(query, count);
  }

  @Query(() => [Ingredient])
  async popularIngredients(
    @Arg("count", { defaultValue: 5 }) count: number
  ): Promise<Ingredient[]> {
    return await this.ingredientProvider.getPopular(count);
  }

  @Query(() => [Ingredient])
  async personalCommonIngredients(
    @Arg("count", { defaultValue: 5 }) count: number,
    @CurrentUser() user: User
  ): Promise<Ingredient[]> {
    return await this.ingredientProvider.getPersonalCommon(count, user.uuid);
  }
}
