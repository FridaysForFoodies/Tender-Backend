import { ApolloServer } from "apollo-server-express";
import * as neo4j from "neo4j-driver";
import * as Express from "express";
import * as dotenv from "dotenv";
import "reflect-metadata";
import createSchema from "./schema";

const main = async () => {
  dotenv.config();

  const schema = await createSchema();
  const app = Express();

  const driver = neo4j.driver(
    process.env.DATABASE_URL,
    neo4j.auth.basic(
      process.env.DATABASE_USERNAME,
      process.env.DATABASE_PASSWORD
    )
  );

  const server = new ApolloServer({ schema, context: driver });
  // @ts-ignore
  server.applyMiddleware({ app });

  app.listen({ port: 3333 }, () =>
    console.log(
      `🚀 Server ready and listening at ==> http://localhost:3333${server.graphqlPath}`
    )
  );
};

main().catch((error) => {
  console.log(error, "error");
});
