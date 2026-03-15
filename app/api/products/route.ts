import { NextRequest } from 'next/server';
import { getAllProducts, addProduct } from '@/lib/controllers/productController';

export async function GET() {
  return getAllProducts();
}

export async function POST(request: NextRequest) {
  return addProduct(request);
}

