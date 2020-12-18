import { Field, ID, ObjectType } from "type-graphql";

@ObjectType({ description: "A single ingredient for a recipe" })
export class Ingredient {
  @Field(ID)
  id: string;

  @Field()
  name: string;

  @Field()
  imagePath: string;

  @Field()
  searchCount: number;

  constructor(
    id: string,
    name: string,
    imagePath: string,
    searchCount: number
  ) {
    this.id = id;
    this.name = name;
    this.imagePath = imagePath;
    this.searchCount = searchCount;
  }
}
