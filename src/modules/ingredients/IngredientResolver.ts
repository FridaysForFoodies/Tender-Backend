import { Ingredient } from "../../model/Ingredient";
import { Arg, Query, Resolver } from "type-graphql";
import { IIngredientProvider, INGREDIENT_PROVIDER } from "./IngredientProvider";
import { Inject } from "typedi";

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
    const ingredients = await this.ingredientProvider.getAllWhereNameContains(query, count);
    return ingredients.sort((left: Ingredient, right: Ingredient) =>
      left.name.indexOf(query) - right.name.indexOf(query));
  }

  @Query(() => [Ingredient])
  async popularIngredients(
    @Arg("count", { defaultValue: 5 }) count: number
  ): Promise<Ingredient[]> {
    return await this.ingredientProvider.getPopular(count);
  }
}
