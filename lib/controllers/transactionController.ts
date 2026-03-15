import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../db';
import Transaction from '../models/transactionModel';
import Product from '../models/productModel';

export async function getAllTransactions() {
  try {
    await connectDB();
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name price');
    return NextResponse.json(transactions, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error fetching transactions', error: error.message },
      { status: 500 }
    );
  }
}

export async function addTransaction(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { items, total, method, customerName, workerNumber } = body;

    // Validate required fields for "potong gaji" method
    if (method === 'potong gaji') {
      if (!customerName || !workerNumber) {
        return NextResponse.json(
          { message: 'Customer name and worker number are required for salary deduction payment' },
          { status: 400 }
        );
      }
    }

    // Validate and update stock for each product
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { message: `Product with ID ${item.productId} not found` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { message: `Insufficient stock for product ${product.name}` },
          { status: 400 }
        );
      }

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    const newTransaction = new Transaction({
      items,
      total,
      method,
      ...(method === 'potong gaji' && { customerName, workerNumber })
    });
    await newTransaction.save();
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error adding transaction', error: error.message },
      { status: 500 }
    );
  }
}

