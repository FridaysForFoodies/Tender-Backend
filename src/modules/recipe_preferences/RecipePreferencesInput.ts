import { Field, InputType, Int } from "type-graphql";

@InputType()
export class RecipePreferencesInput {
  @Field()
  vegan: boolean;

  @Field()
  vegetarian: boolean;

  @Field()
  gluten: boolean;

  @Field()
  dairy: boolean;

  @Field(() => Int)
  cookingTime: number;

  constructor(
    vegan: boolean,
    vegetarian: boolean,
    gluten: boolean,
    dairy: boolean,
    cookingTime: number
  ) {
    this.vegan = vegan;
    this.vegetarian = vegetarian;
    this.gluten = gluten;
    this.dairy = dairy;
    this.cookingTime = cookingTime;
  }
}
