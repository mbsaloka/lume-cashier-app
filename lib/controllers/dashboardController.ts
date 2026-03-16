import { NextResponse } from 'next/server';
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

    const salesByMethod = await Transaction.aggregate([
      {
        $group: {
          _id: '$method',
          totalSales: { $sum: '$total' },
        },
      },
      { $project: { _id: 0, method: '$_id', totalSales: 1 } },
    ]);

    const transactionsByMethod = await Transaction.aggregate([
      {
        $group: {
          _id: '$method',
          totalTransactions: { $sum: 1 },
        },
      },
      { $project: { _id: 0, method: '$_id', totalTransactions: 1 } },
    ]);

    const itemsSoldByMethod = await Transaction.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$method',
          totalItemsSold: { $sum: '$items.quantity' },
        },
      },
      { $project: { _id: 0, method: '$_id', totalItemsSold: 1 } },
    ]);

    const methods = new Set<string>([
      ...salesByMethod.map((x: any) => x.method),
      ...transactionsByMethod.map((x: any) => x.method),
      ...itemsSoldByMethod.map((x: any) => x.method),
    ]);

    const byMethod: Record<
      string,
      { totalSales: number; totalTransactions: number; totalItemsSold: number }
    > = {};

    for (const method of methods) {
      const sales = salesByMethod.find((x: any) => x.method === method)?.totalSales ?? 0;
      const tx = transactionsByMethod.find((x: any) => x.method === method)?.totalTransactions ?? 0;
      const items = itemsSoldByMethod.find((x: any) => x.method === method)?.totalItemsSold ?? 0;
      byMethod[method] = { totalSales: sales, totalTransactions: tx, totalItemsSold: items };
    }

    return NextResponse.json(
      {
        totalSales: totalSales[0] ? totalSales[0].total : 0,
        totalTransactions,
        totalItemsSold: totalItemsSold[0] ? totalItemsSold[0].totalItems : 0,
        byMethod,
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

