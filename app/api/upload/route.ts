import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { read, utils } from 'xlsx';
import pdfParse from 'pdf-parse';

function parseCsv(text: string) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  const [headerLine, ...rows] = lines;
  const headers = headerLine.split(',').map((cell) => cell.trim());
  return rows.map((row) => {
    const values = row.split(',').map((cell) => cell.trim());
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = values[index] ?? '';
    });
    return record;
  });
}

export async function POST(request: Request) {
  try {
    const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET || '' });
    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    let data: unknown;
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.csv')) {
      data = parseCsv(new TextDecoder().decode(buffer));
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const workbook = read(Buffer.from(buffer), { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      data = utils.sheet_to_json(sheet, { defval: '' });
    } else if (fileName.endsWith('.pdf')) {
      const parsed = await pdfParse(Buffer.from(buffer));
      data = { text: parsed.text.slice(0, 2000) };
    } else {
      return NextResponse.json({ error: 'Unsupported file format' }, { status: 400 });
    }

    const uploadResult = await query(
      'INSERT INTO uploads (userid, filename, data, createdat) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [token.sub, file.name, data]
    );

    const upload = uploadResult.rows[0];
    if (!upload) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    return NextResponse.json({ upload });
  } catch (e) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
