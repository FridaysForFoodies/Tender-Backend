import {buildSchema} from "type-graphql";
import {ExampleResolver} from "./resolvers/ExampleResolver";
import {GraphQLSchema} from "graphql";


export default async function createSchema(): Promise<GraphQLSchema> {

    return await buildSchema({
        resolvers: [ExampleResolver],
        emitSchemaFile: true,
        validate: false,
    });
}

