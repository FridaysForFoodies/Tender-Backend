import { Field, ID, ObjectType } from "type-graphql";
import { InstructionStep } from "./InstructionStep";
import { RecipeIngredient } from "./RecipeIngredient";

@ObjectType()
export class Recipe {
  @Field(ID)
  recipeId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  subtitle: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  yieldOptions: [string];

  @Field()
  imagePath: string;

  @Field()
  difficulty: number;

  @Field()
  duration: number;

  @Field(() => [InstructionStep])
  instructionSteps: [InstructionStep];

  @Field(() => [RecipeIngredient], { nullable: true })
  ingredients: [RecipeIngredient];

  @Field({ nullable: true })
  tags: [string]; //TODO Replace with explicit Type later

  constructor(
    recipeId: string,
    name: string,
    subtitle: string,
    description: string,
    yieldOptions: [string],
    imagePath: string,
    difficulty: number,
    duration: number,
    instructionSteps: [InstructionStep],
    ingredients: [RecipeIngredient],
    tags: [string]
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
    this.tags = tags;
  }
}
