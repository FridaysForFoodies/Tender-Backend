import { Field, Float, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Yield {
  @Field(() => Float)
  amount: number;

  @Field(() => String)
  unit: string;

  @Field(() => Int)
  yield: number;

  constructor(amount: number, unit: string, yields: number) {
    this.amount = amount;
    this.unit = unit;
    this.yield = yields;
  }
}
