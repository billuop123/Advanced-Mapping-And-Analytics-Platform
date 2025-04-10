// app/api/upload/route.js
import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import { writeFile } from 'fs/promises';
import { prisma } from '@/app/services/prismaClient';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public');
console.log(uploadDir);
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
    await prisma.sVG.create({
        data: {
            name: formData.get('name') as string,
            icon: `${formData.get('name')}.svg`,
        }
    })
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${formData.get('name')}.svg`;

  try {
    await writeFile(`${uploadDir}/${filename}`, buffer);
    return NextResponse.json({ message: 'Upload successful', filename });
  } catch (err) {
    console.error('File write error:', err);
    return NextResponse.json({ error: 'Failed to save file.' }, { status: 500 });
  }
}
