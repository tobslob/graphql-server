import {
  CreateProductInput,
  GetProductInput,
  ProductModel,
} from "../schema/product.schema";
import { User } from "../schema/user.schema";

export class ProductService {
  async createProduct(input: CreateProductInput & { user: User["_id"] }) {
    return await ProductModel.create(input);
  }

  async findSingleProduct(input: GetProductInput) {
    return await ProductModel.findOne(input).lean();
  }

  async getAllProduct() {
    return await ProductModel.find().lean();
  }
}
