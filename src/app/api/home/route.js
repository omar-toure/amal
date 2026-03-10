import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'home.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const homeData = JSON.parse(fileContents);
    return NextResponse.json(homeData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read home data' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const updatedData = await request.json();
    await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2));
    return NextResponse.json(updatedData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update home data' }, { status: 500 });
  }
}
