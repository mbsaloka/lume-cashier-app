import { NextRequest } from 'next/server';
import { updateProduct, deleteProduct } from '@/lib/controllers/productController';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return updateProduct(request, id);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return deleteProduct(id);
}

