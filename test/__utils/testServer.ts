import {
  ApolloServerTestClient,
  createTestClient,
} from "apollo-server-testing";
import { ApolloServer } from "apollo-server-express";
import createSchema from "../../src/schema";
import * as dotenv from "dotenv";
import * as path from "path";

export default async function testServer(): Promise<ApolloServerTestClient> {
  if (
    process.env.DOTENV_CONFIG_LOCAL !== undefined &&
    process.env.DOTENV_CONFIG_LOCAL
  ) {
    dotenv.config();
  } else {
    dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });
  }

  const schema = await createSchema();

  return createTestClient(new ApolloServer({ schema }));
}
