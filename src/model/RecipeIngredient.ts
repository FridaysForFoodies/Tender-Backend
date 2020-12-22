import { Field, Int, ObjectType } from "type-graphql";
import { Ingredient } from "./Ingredient";

@ObjectType()
export class RecipeIngredient {
  @Field(() => Ingredient)
  ingredient: Ingredient;

  @Field()
  amount: number;

  @Field()
  unit: string;

  @Field(() => Int)
  yields: number;

  constructor(
    ingredient: Ingredient,
    amount: number,
    unit: string,
    yields: number
  ) {
    this.ingredient = ingredient;
    this.amount = amount;
    this.unit = unit;
    this.yields = yields;
  }
}
