import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'products.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const products = JSON.parse(fileContents);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newProduct = await request.json();
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const products = JSON.parse(fileContents);
    
    // Generate simple ID
    const id = newProduct.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const productWithId = { ...newProduct, id: id + '-' + Date.now().toString().slice(-4) };
    
    products.push(productWithId);
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
    
    return NextResponse.json(productWithId, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
