import { ApolloError } from "apollo-server-express";
import { LoginInput, UserModel } from "../schema/user.schema";
import { Context } from "../types/context";
import bcrypt from "bcrypt";
import { signJwt } from "../utils/jwt";

const e = "Invalid email or password";

export class UserService {
  async createUser(input: any) {
    return await UserModel.create(input);
  }

  async login(input: LoginInput, context: Context) {
    const user = await UserModel.find().findByEmail(input.email).lean();
    if (!user) {
      throw new ApolloError(e);
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);

    if (!isValidPassword) {
      throw new ApolloError(e);
    }

    const token = signJwt(user);
    context.res.cookie("accessToken", token, {
      maxAge: 3.154e10,
      httpOnly: true,
      domain: "localhost",
      path: "/",
      sameSite: "none",
      secure: true,
    });

    return token;
  }
}
