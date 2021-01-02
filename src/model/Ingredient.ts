import { Field, ID, ObjectType } from "type-graphql";
import { Yield } from "./Yield";

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

  @Field(() => [Yield])
  yields: [Yield];

  constructor(
    id: string,
    name: string,
    imagePath: string,
    searchCount: number,
    yields?: [Yield]
  ) {
    this.id = id;
    this.name = name;
    this.imagePath = imagePath;
    this.searchCount = searchCount;
    this.yields = yields;
  }
}
