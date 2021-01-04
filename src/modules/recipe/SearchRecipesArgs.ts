import { ArgsType, Field, Int } from "type-graphql";
import { Max, Min } from "class-validator";
import { SearchOptionsInput } from "./SearchOptionsInput";

@ArgsType()
export class SearchRecipesArgs {
  @Field(() => Int, { defaultValue: 0 })
  @Min(0)
  skip: number;

  @Field(() => Int, { defaultValue: 25 })
  @Min(1)
  @Max(50)
  take: number;

  @Field()
  searchOptions: SearchOptionsInput;
}
