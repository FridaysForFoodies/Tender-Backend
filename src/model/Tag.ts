import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Tag {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  imagePath: string;

  constructor(id: string, name: string, imagePath: string) {
    this.id = id;
    this.name = name;
    this.imagePath = imagePath;
  }
}
