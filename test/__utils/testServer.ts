import {
  ApolloServerTestClient,
  createTestClient,
} from "apollo-server-testing";
import { ApolloServer } from "apollo-server-express";
import createSchema from "../../src/schema";
import * as dotenv from "dotenv";

export default async function testServer(): Promise<ApolloServerTestClient> {
  dotenv.config();

  const schema = await createSchema();

  return createTestClient(new ApolloServer({ schema }));
}
