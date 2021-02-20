import { buildSchema } from "type-graphql";
import { GraphQLSchema } from "graphql";
import { IngredientResolver } from "./modules/ingredients/IngredientResolver";
import { Container } from "typedi";
import { UserResolver } from "./modules/user/UserResolver";
import { RecipePreferencesResolver } from "./modules/recipe_preferences/RecipePreferencesResolver";
import { RecipeResolver } from "./modules/recipe/RecipeResolver";
import { TagResolver } from "./modules/tag/TagResolver";

export default async function createSchema(): Promise<GraphQLSchema> {
  return await buildSchema({
    resolvers: [
      IngredientResolver,
      UserResolver,
      RecipePreferencesResolver,
      RecipeResolver,
      TagResolver,
    ],
    emitSchemaFile: true,
    validate: true,
    container: Container,
  });
}
