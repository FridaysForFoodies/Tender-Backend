import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class User {
  @Field()
  uuid: String;

  constructor(uuid: String) {
    this.uuid = uuid;
  }
}
