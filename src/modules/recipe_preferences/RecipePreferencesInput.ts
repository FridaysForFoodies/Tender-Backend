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
  lactosefree: boolean;

  @Field(() => Int)
  cookingTime: number;

  constructor(
    vegan: boolean,
    vegetarian: boolean,
    glutenfree: boolean,
    lactosefree: boolean,
    cookingTime: number
  ) {
    this.vegan = vegan;
    this.vegetarian = vegetarian;
    this.glutenfree = glutenfree;
    this.lactosefree = lactosefree;
    this.cookingTime = cookingTime;
  }
}
