import { ObjectType, Field, Int } from "type-graphql";
import { User } from "./User";

@ObjectType()
export class RecipePreferences {
  @Field(() => User)
  user: User;

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
    user: User,
    vegan: boolean,
    vegetarian: boolean,
    glutenfree: boolean,
    dairyfree: boolean,
    cookingTime: number
  ) {
    this.user = user;
    this.vegan = vegan;
    this.vegetarian = vegetarian;
    this.glutenfree = glutenfree;
    this.dairyfree = dairyfree;
    this.cookingTime = cookingTime;
  }
}
