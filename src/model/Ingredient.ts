import { Field, ID, ObjectType } from "type-graphql";

@ObjectType({ description: "A single ingredient for a recipe" })
export class Ingredient {
  @Field(ID)
  id: string;

  @Field()
  name: string;

  @Field()
  imagePath: string;

  constructor(
    id: string,
    name: string,
    imagePath: string
  ) {
    this.id = id;
    this.name = name;
    this.imagePath = imagePath;
  }
}
