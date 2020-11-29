import { ObjectType, Field, ID } from "type-graphql";

@ObjectType({ description: "The Example model" })
export class Example {
  constructor(id: number, name: String, description: String) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  @Field(() => ID)
  id: number;

  @Field()
  name: String;

  @Field()
  description: String;
}
