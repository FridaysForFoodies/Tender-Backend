import { Field, ID, Int, ObjectType } from "type-graphql";
import { InstructionStep } from "./InstructionStep";
import { Ingredient } from "./Ingredient";

@ObjectType()
export class Recipe {
  @Field(ID)
  recipeId: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  subtitle: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => [Int])
  yieldOptions: number[];

  @Field(() => String)
  imagePath: string;

  @Field(() => Int)
  difficulty: number;

  @Field(() => Int)
  duration: number;

  @Field(() => [InstructionStep], { nullable: true })
  instructionSteps: InstructionStep[];

  @Field(() => [Ingredient], { nullable: true })
  ingredients: Ingredient[];

  @Field(() => [Ingredient], { nullable: true })
  missingIngredients: Ingredient[];

  @Field(() => [String], { nullable: true })
  tags: string[]; //TODO Replace with explicit Type later

  constructor(
    recipeId: string,
    name: string,
    subtitle: string,
    description: string,
    yieldOptions: number[],
    imagePath: string,
    difficulty: number,
    duration: number,
    instructionSteps: InstructionStep[],
    ingredients: Ingredient[],
    missingIngredients: Ingredient[],
    tags: string[]
  ) {
    this.recipeId = recipeId;
    this.name = name;
    this.subtitle = subtitle;
    this.description = description;
    this.yieldOptions = yieldOptions;
    this.imagePath = imagePath;
    this.difficulty = difficulty;
    this.duration = duration;
    this.instructionSteps = instructionSteps;
    this.ingredients = ingredients;
    this.missingIngredients = missingIngredients;
    this.tags = tags;
  }
}
