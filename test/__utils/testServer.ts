import {
  ApolloServerTestClient,
  createTestClient,
} from "apollo-server-testing";
import { ApolloServer } from "apollo-server-express";
import createSchema from "../../src/schema";
import * as dotenv from "dotenv";
import * as path from "path";
import { GraphQLServerOptions } from "apollo-server-core/src/graphqlOptions";

export function loadConfig() {
  if (
    process.env.DOTENV_CONFIG_LOCAL !== undefined &&
    process.env.DOTENV_CONFIG_LOCAL
  ) {
    dotenv.config();
  } else {
    dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });
  }
}

export default async function testServer(
  requestOptions?: Partial<GraphQLServerOptions<any>>
): Promise<ApolloServerTestClient> {
  loadConfig();

  const schema = await createSchema();
  const server = new ApolloServer({ schema });
  if (typeof requestOptions != "undefined") {
    server.requestOptions = requestOptions;
  }

  return createTestClient(server);
}
