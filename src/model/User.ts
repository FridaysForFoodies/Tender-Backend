import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field((type) => ID)
  uuid: String;

  constructor(uuid: String) {
    this.uuid = uuid;
  }
}
