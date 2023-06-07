import dotenv from "dotenv";
dotenv.config();

import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";

import { resolvers } from "./resolvers";
import { connectToMongo } from "./utils/mongo";
import { verifyJwt } from "./utils/jwt";
import { Context } from "./types/context";
import { User } from "./schema/user.schema";
import { authChecker } from "./utils/authChecker";

async function bootstrap() {
  const schema = await buildSchema({
    resolvers,
    authChecker,
  });

  const app = express();
  app.use(cookieParser());
  app.set("trust proxy", process.env.NODE_ENV !== "production");

  const server = new ApolloServer({
    schema,
    context: (ctx: Context) => {
      const context = ctx;
      if (ctx.req.cookies.accessToken) {
        const user = verifyJwt<User>(ctx.req.cookies.accessToken);
        if (user) {
          context.user = user;
        }
      }
      return context;
    },

    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault({
            includeCookies: true,
          })
        : ApolloServerPluginLandingPageGraphQLPlayground({
            settings: {
              "request.credentials": "include",
            },
          }),
    ],
  });
  await connectToMongo();
  await server.start();

  server.applyMiddleware({ app });
  app.listen({ port: process.env.PORT || 4002 }, () => {
    console.log("App is listening to port 4002 ☠️🚚");
  });
}

bootstrap();
