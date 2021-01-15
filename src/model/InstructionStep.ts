import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class InstructionStep {
  @Field(() => String)
  instructions: string;

  @Field(() => String, { nullable: true })
  imagePath: string;

  @Field(() => String, { nullable: true })
  imageCaption: string;

  constructor(instructions: string, imagePath: string, imageCaption: string) {
    this.instructions = instructions;
    this.imagePath = imagePath;
    this.imageCaption = imageCaption;
  }
}
