import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

const ALLOWED_ROOTS = [
  'D:\\GATE',
  'D:\\pictures',
  'D:\\Sony',
  'D:\\Zuk',
  'D:\\Videos And Movies\\SHAADI',
  'C:\\Users\\abhij\\OneDrive',
  'C:\\Users\\abhij\\Desktop'
];

const MIME_MAP: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.mkv': 'video/x-matroska',
  '.mov': 'video/quicktime',
  '.flv': 'video/x-flv',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.opus': 'audio/opus',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.txt': 'text/plain; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.zip': 'application/zip'
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawPath = searchParams.get('path');

  if (!rawPath) {
    return new NextResponse('Missing path parameter', { status: 400 });
  }

  // Resolve absolute path
  let targetPath = path.resolve(rawPath);

  // Security check: must reside inside an allowed root
  const isAllowed = ALLOWED_ROOTS.some(root => {
    const normRoot = path.normalize(root).toLowerCase();
    const normTarget = path.normalize(targetPath).toLowerCase();
    return normTarget.startsWith(normRoot);
  });

  if (!isAllowed) {
    return new NextResponse('Access forbidden', { status: 403 });
  }

  if (!fs.existsSync(targetPath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    return new NextResponse('Directory requested, file expected', { status: 400 });
  }

  const ext = path.extname(targetPath).toLowerCase();
  let mimeType = MIME_MAP[ext] || 'application/octet-stream';

  // Fallback magic byte detection if extension was truncated or missing
  if (mimeType === 'application/octet-stream' || ext === '.mp' || ext === '.m' || ext === '') {
    try {
      const fd = fs.openSync(targetPath, 'r');
      const b = Buffer.alloc(16);
      fs.readSync(fd, b, 0, 16, 0);
      fs.closeSync(fd);
      if (b.toString('utf8').includes('ftyp') || (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70)) {
        mimeType = 'video/mp4';
      } else if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) {
        mimeType = 'video/x-matroska';
      } else if (b.toString('utf8', 0, 4) === '%PDF') {
        mimeType = 'application/pdf';
      }
    } catch {
      // Ignore fallback error
    }
  }

  const fileSize = stat.size;
  const range = request.headers.get('range');

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize || start > end) {
      return new NextResponse('Requested range not satisfiable', {
        status: 416,
        headers: {
          'Content-Range': `bytes */${fileSize}`
        }
      });
    }

    const chunksize = end - start + 1;
    const fileStream = fs.createReadStream(targetPath, { start, end });
    const webStream = Readable.toWeb(fileStream);

    return new Response(webStream as ReadableStream, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } else {
    const fileStream = fs.createReadStream(targetPath);
    const webStream = Readable.toWeb(fileStream);

    return new Response(webStream as ReadableStream, {
      status: 200,
      headers: {
        'Accept-Ranges': 'bytes',
        'Content-Length': fileSize.toString(),
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
}
