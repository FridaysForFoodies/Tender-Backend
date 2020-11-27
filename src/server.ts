import {ApolloServer} from "apollo-server-express";
import * as Express from 'express';
import "reflect-metadata";
import {buildSchema} from "type-graphql";

// resolvers
import {ExampleResolver} from "./api/resolvers/ExampleResolver";


const main = async () => {
    const schema = await buildSchema({
        resolvers: [ExampleResolver],
        emitSchemaFile: true,
        validate: false,
    });

    const app = Express();

    const server = new ApolloServer({schema});
    // @ts-ignore
    server.applyMiddleware({app});

    app.listen({port: 3333}, () =>
        console.log(`🚀 Server ready and listening at ==> http://localhost:3333${server.graphqlPath}`))
};

main().catch((error) => {
    console.log(error, 'error');
})