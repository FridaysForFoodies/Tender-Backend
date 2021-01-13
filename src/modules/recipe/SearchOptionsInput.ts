import { Field, InputType } from "type-graphql";

@InputType()
export class SearchOptionsInput {
  @Field(() => [String])
  ingredients: [string];

  @Field(() => [String])
  tags: [string];

  @Field(() => [String])
  preferenceTagsInclude: [string];

  @Field(() => [String])
  preferenceTagsExclude: [string];
}
