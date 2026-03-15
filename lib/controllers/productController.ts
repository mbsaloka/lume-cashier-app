import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../db';
import Product from '../models/productModel';

export async function getAllProducts() {
  try {
    await connectDB();
    const products = await Product.find();
    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error fetching products', error: error.message },
      { status: 500 }
    );
  }
}

export async function addProduct(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, price, category, stock } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { message: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    const newProduct = new Product({ name, price, category, stock });
    await newProduct.save();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error adding product', error: error.message },
      { status: 500 }
    );
  }
}

export async function updateProduct(request: NextRequest, id: string) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, price, category, stock } = body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, category, stock },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error updating product', error: error.message },
      { status: 500 }
    );
  }
}

export async function deleteProduct(id: string) {
  try {
    await connectDB();
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error deleting product', error: error.message },
      { status: 500 }
    );
  }
}

