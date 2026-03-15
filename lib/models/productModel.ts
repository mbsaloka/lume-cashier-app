import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  category: string;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;

