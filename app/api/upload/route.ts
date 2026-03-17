import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'asset', 'projects');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedPaths: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = file.name.replace(/\s+/g, '_');
      const filename = `${Date.now()}-${safeName}`;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      uploadedPaths.push(`/asset/projects/${filename}`);
    }

    return NextResponse.json({ paths: uploadedPaths }, { status: 200 });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { path: filePath } = await request.json();

    const allowedDir = path.join(process.cwd(), 'public', 'asset', 'projects');
    const fullPath = path.join(process.cwd(), 'public', filePath);

    if (!fullPath.startsWith(allowedDir)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
