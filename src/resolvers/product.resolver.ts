import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { ProductService } from "../service/product.service";
import { CreateProductInput, Product } from "../schema/product.schema";
import { Context } from "../types/context";

@Resolver()
export class productResolver {
  constructor(private productService: ProductService) {
    this.productService = new ProductService();
  }

  @Authorized()
  @Mutation(() => Product)
  createProduct(
    @Arg("input") input: CreateProductInput,
    @Ctx() context: Context
  ) {
    return this.productService.createProduct({
      ...input,
      user: context.user?._id!,
    });
  }
}
