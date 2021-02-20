import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import * as dotenv from "dotenv";
import "reflect-metadata";
import createSchema from "./schema";
import { User } from "./model/User";
import * as depthLimit from "graphql-depth-limit";
import * as helmet from "helmet";

const main = async () => {
  dotenv.config();

  const schema = await createSchema();
  const app = Express();
  app.use(helmet());

  const server = new ApolloServer({
    schema,
    validationRules: [depthLimit(5)],
    playground: false,
    introspection: false,
    context: ({ req }) => {
      const uuid = req.headers.authorization;
      return {
        user: new User(uuid),
      };
    },
  });

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
