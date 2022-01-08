import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloReolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import session from "express-session";
// import pg from "pg";
// const pgSession = require("connect-pg-simple")(expressSession);

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();

  // const pgPool = new pg.Pool({
  // });

  app.use(
    session({
      name: "qid",
      // store: new pgSession({
      //   pool: pgPool, // Connection pool
      // tableName: "user_sessions", // Use another table-name than the default "session" one,
      // }),
      cookie: {
        maxAge: 90 * 24 * 60 * 60 * 1000, //90days
        httpOnly: true,
        secure: __prod__, //cookie only works in https
        sameSite: "lax",
      },
      saveUninitialized: false,
      secret: "lkjlhhgklkjljkjhjf",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloReolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started");
  });
};

main();
