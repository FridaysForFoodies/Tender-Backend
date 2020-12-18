import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  uuid: string;

  constructor(uuid: string) {
    this.uuid = uuid;
  }
}
