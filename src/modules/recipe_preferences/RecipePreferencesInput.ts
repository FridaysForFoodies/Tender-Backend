import { Field, InputType } from "type-graphql";

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

  constructor(
    vegan: boolean,
    vegetarian: boolean,
    gluten: boolean,
    dairy: boolean
  ) {
    this.vegan = vegan;
    this.vegetarian = vegetarian;
    this.gluten = gluten;
    this.dairy = dairy;
  }
}
