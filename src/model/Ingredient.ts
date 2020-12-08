import { Field, ID, ObjectType } from "type-graphql";

@ObjectType({ description: "A single ingredient for a recipe" })
export class Ingredient {
  @Field(ID)
  id: number;

  @Field()
  name: string;

  @Field()
  unit: Unit;

  @Field()
  calories: number;

  constructor(id: number, name: string, unit: Unit, calories: number) {
    this.id = id;
    this.name = name;
    this.unit = unit;
    this.calories = calories;
  }
}

export enum Unit {
  GRAMS= "g",
  LITRES = "l",
  PIECES = "pcs",
  TEASPOONS = "tsp"
}
