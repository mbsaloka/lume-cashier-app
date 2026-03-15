import { NextRequest } from 'next/server';
import {
  getAllTransactions,
  addTransaction,
} from '@/lib/controllers/transactionController';

export async function GET() {
  return getAllTransactions();
}

export async function POST(request: NextRequest) {
  return addTransaction(request);
}

