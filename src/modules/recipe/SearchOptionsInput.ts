import { Field, InputType } from "type-graphql";

@InputType()
export class SearchOptionsInput {
  @Field()
  ingredients: [string];

  @Field()
  tags: [string];
}
