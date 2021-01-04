import { Field, ID, Int, ObjectType } from "type-graphql";
import { Yield } from "./Yield";

@ObjectType({ description: "A single ingredient for a recipe" })
export class Ingredient {
  @Field(ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  imagePath: string;

  @Field(() => Int)
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
