import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'products.json');

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const updatedData = await request.json();
    
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    let products = JSON.parse(fileContents);
    
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      console.error(`Update failed: Product with ID ${id} not found.`);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    products[productIndex] = { ...products[productIndex], ...updatedData, id }; // Ensure ID hasn't changed
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
    
    return NextResponse.json(products[productIndex]);
  } catch (error) {
    console.error('API Error (PUT /api/products/[id]):', error);
    return NextResponse.json({ error: 'Failed to update product', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    let products = JSON.parse(fileContents);
    
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);
    
    if (products.length === initialLength) {
      console.error(`Delete failed: Product with ID ${id} not found.`);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error (DELETE /api/products/[id]):', error);
    return NextResponse.json({ error: 'Failed to delete product', details: error.message }, { status: 500 });
  }
}
