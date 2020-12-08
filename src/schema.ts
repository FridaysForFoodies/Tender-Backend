import { buildSchema } from "type-graphql";
import { ExampleResolver } from "./modules/example/ExampleResolver";
import { GraphQLSchema } from "graphql";
import { IngredientResolver } from "./modules/ingredients/IngredientResolver";
import { Container } from "typedi";

export default async function createSchema(): Promise<GraphQLSchema> {
  return await buildSchema({
    resolvers: [ExampleResolver, IngredientResolver],
    emitSchemaFile: true,
    validate: false,
    container: Container
  });
}
