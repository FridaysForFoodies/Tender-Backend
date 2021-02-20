import { ArgsType, Field, Int } from "type-graphql";
import { Max, Min } from "class-validator";

@ArgsType()
export class ResultCountArgs {
  @Field(() => Int, { defaultValue: 5 })
  @Min(1)
  @Max(50)
  count: number;
}
