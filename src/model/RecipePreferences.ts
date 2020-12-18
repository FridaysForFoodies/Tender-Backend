import { ObjectType, Field } from "type-graphql";
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

  constructor(
    user: User,
    vegan: boolean,
    vegetarian: boolean,
    gluten: boolean,
    dairy: boolean
  ) {
    this.user = user;
    this.vegan = vegan;
    this.vegetarian = vegetarian;
    this.gluten = gluten;
    this.dairy = dairy;
  }
}
