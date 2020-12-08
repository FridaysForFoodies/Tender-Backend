import {
  ApolloServerTestClient,
  createTestClient,
} from "apollo-server-testing";
import { ApolloServer } from "apollo-server-express";
import createSchema from "../../src/schema";
import * as dotenv from "dotenv";
import * as neo4j from "neo4j-driver";

export default async function testServer(): Promise<ApolloServerTestClient> {
  dotenv.config();

  const driver = neo4j.driver(
    process.env.DATABASE_URL,
    neo4j.auth.basic(
      process.env.DATABASE_USERNAME,
      process.env.DATABASE_PASSWORD
    )
  );

  const schema = await createSchema();

  return createTestClient(new ApolloServer({ schema, context: driver }));
}
