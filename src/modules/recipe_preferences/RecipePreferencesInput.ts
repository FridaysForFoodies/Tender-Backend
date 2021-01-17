import { Field, InputType, Int } from "type-graphql";

@InputType()
export class RecipePreferencesInput {
  @Field()
  vegan: boolean;

  @Field()
  vegetarian: boolean;

  @Field()
  glutenfree: boolean;

  @Field()
  dairyfree: boolean;

  @Field(() => Int)
  cookingTime: number;

  constructor(
    vegan: boolean,
    vegetarian: boolean,
    glutenfree: boolean,
    dairyfree: boolean,
    cookingTime: number
  ) {
    this.vegan = vegan;
    this.vegetarian = vegetarian;
    this.glutenfree = glutenfree;
    this.dairyfree = dairyfree;
    this.cookingTime = cookingTime;
  }
}
