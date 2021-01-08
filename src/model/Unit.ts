import { Field, ID, ObjectType } from "type-graphql";

@ObjectType({ description: "The unit for ingredient amounts" })
export class Unit {
  @Field(ID)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  abbreviation: string;

  constructor(id: number, name: string, abbreviation: string) {
    this.id = id;
    this.name = name;
    this.abbreviation = abbreviation;
  }
}
