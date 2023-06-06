import { Prop, Ref, getModelForClass, index } from "@typegoose/typegoose";
import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "./user.schema";
import { v4 as uuidv4 } from "uuid";
import { IsNumber, MaxLength, Min, MinLength } from "class-validator";

@ObjectType()
@index({ productId: 1 })
export class Product {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => String)
  @Prop({ required: true, ref: () => User })
  user: Ref<User>;

  @Field(() => String)
  @Prop({ required: true })
  description: string;

  @Field(() => String)
  @Prop({ required: true })
  price: string;

  @Field(() => String)
  @Prop({
    required: true,
    default: () => `product_id_${uuidv4()}`,
    unique: true,
  })
  productId: string;
}

export const ProductModel = getModelForClass<typeof Product>(Product);

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @MinLength(50, {
    message: "Description should not be less than 50 characters",
  })
  @MaxLength(1000, {
    message: "Description should not be more than 1000 characters",
  })
  @Field()
  description: string;

  @IsNumber()
  @Min(1)
  @Field()
  price: number;
}

@InputType()
export class GetProductInput {
  @Field()
  productId: string;
}
