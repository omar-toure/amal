import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // We use the original filename. We could sanitize it if needed.
    const filename = file.name.replaceAll(" ", "_"); // Replace spaces with underscores to avoid issues
    
    const uploadDir = path.join(process.cwd(), 'public', 'site amal');
    
    // Ensure dir exists (it should, but just in case)
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ message: 'Success', filename: filename });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ message: 'Failed', status: 500 });
  }
}
