import { productResolver } from "./product.resolver";
import UserResolver from "./user.resolver";

export const resolvers = [UserResolver, productResolver] as const;
