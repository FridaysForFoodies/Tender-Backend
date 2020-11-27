import { ObjectType, Field, ID } from "type-graphql";

@ObjectType({ description: "The Example model" })
export class Example {

    @Field(()=> ID)
    id: string;

    @Field()
    name: String;

    @Field()
    description: String;
}