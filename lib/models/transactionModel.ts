import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ITransactionItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

export interface ITransaction extends Document {
  items: ITransactionItem[];
  total: number;
  method: 'cash' | 'qris' | 'transfer' | 'potong gaji';
  customerName?: string;
  workerNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: ['cash', 'qris', 'transfer', 'potong gaji'],
      required: true,
    },
    customerName: {
      type: String,
      required: false,
    },
    workerNumber: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;

