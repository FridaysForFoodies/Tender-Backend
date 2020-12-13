import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import * as dotenv from "dotenv";
import "reflect-metadata";
import createSchema from "./schema";

const main = async () => {
  dotenv.config();

  const schema = await createSchema();
  const app = Express();

  const server = new ApolloServer({ schema });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
