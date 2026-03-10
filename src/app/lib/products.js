import fs from 'fs/promises';
import path from 'path';

export async function getProducts() {
  try {
    const dataFilePath = path.join(process.cwd(), 'src', 'data', 'products.json');
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}
