import { buildSchema } from "type-graphql";
import { ExampleResolver } from "./modules/example/ExampleResolver";
import { GraphQLSchema } from "graphql";
import { IngredientResolver } from "./modules/ingredients/IngredientResolver";
import { Container } from "typedi";
import { UserResolver } from "./modules/user/UserResolver";
import { RecipePreferencesResolver } from "./modules/recipe_preferences/RecipePreferencesResolver";

export default async function createSchema(): Promise<GraphQLSchema> {
  return await buildSchema({
    resolvers: [
      ExampleResolver,
      IngredientResolver,
      UserResolver,
      RecipePreferencesResolver,
    ],
    emitSchemaFile: true,
    validate: false,
    container: Container,
  });
}
