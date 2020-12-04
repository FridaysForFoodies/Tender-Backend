import {
  ApolloServerTestClient,
  createTestClient,
} from "apollo-server-testing";
import { ApolloServer } from "apollo-server-express";
import createSchema from "../../src/schema";

export default async function testServer(): Promise<ApolloServerTestClient> {
  const schema = await createSchema();

  return createTestClient(new ApolloServer({ schema }));
}
