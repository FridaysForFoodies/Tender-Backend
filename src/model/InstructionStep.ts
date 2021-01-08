import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class InstructionStep {
  @Field(() => String)
  instruction: string;

  @Field(() => String, { nullable: true })
  imagePath: string;

  @Field(() => String, { nullable: true })
  imageCaption: string;

  constructor(instruction: string, imagePath: string, imageCaption: string) {
    this.instruction = instruction;
    this.imagePath = imagePath;
    this.imageCaption = imageCaption;
  }
}
