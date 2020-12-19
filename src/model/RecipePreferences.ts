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
  gluten: boolean;

  @Field()
  dairy: boolean;

  @Field(() => Int)
  cookingTime: number;

  constructor(
    user: User,
    vegan: boolean,
    vegetarian: boolean,
    gluten: boolean,
    dairy: boolean,
    cookingTime: number
  ) {
    this.user = user;
    this.vegan = vegan;
    this.vegetarian = vegetarian;
    this.gluten = gluten;
    this.dairy = dairy;
    this.cookingTime = cookingTime;
  }
}
