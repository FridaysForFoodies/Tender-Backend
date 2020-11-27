import { Resolver, Mutation, Arg, Query } from "type-graphql";
import {Example} from "../types/Example"

@Resolver()
export class ExampleResolver {

    @Query(_returns => Example, { nullable: false})
    async returnExample(@Arg("id") id: string){
        const example = new Example();
        example.name = "Max";
        example.description = "Mustermann";
        return example;
    };


    // @Query(() => [ExampleType])
    // async returnAllExamples(){
    //     return ;
    // };

    // @Mutation(() => Boolean)
    // async createCategory(@Arg("data"){name,description}: ExampleType) {
    //
    //     return true;
    // };

}