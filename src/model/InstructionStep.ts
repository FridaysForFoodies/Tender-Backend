import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class InstructionStep {
  @Field()
  instruction: string;

  @Field({ nullable: true })
  imagePath: string;

  @Field({ nullable: true })
  imageCaption: string;

  constructor(instruction: string, imagePath: string, imageCaption: string) {
    this.instruction = instruction;
    this.imagePath = imagePath;
    this.imageCaption = imageCaption;
  }
}
