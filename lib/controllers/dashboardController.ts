import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../db';
import Transaction from '../models/transactionModel';

export async function getDashboardStats() {
  try {
    await connectDB();

    const totalSales = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
        },
      },
    ]);

    const totalTransactions = await Transaction.countDocuments();

    const totalItemsSold = await Transaction.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: null,
          totalItems: { $sum: '$items.quantity' },
        },
      },
    ]);

    return NextResponse.json(
      {
        totalSales: totalSales[0] ? totalSales[0].total : 0,
        totalTransactions,
        totalItemsSold: totalItemsSold[0] ? totalItemsSold[0].totalItems : 0,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error fetching dashboard stats', error: error.message },
      { status: 500 }
    );
  }
}

