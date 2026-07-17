import fs from 'fs';
import path from 'path';

export async function extractTextFromFile(filePath: string, originalName: string): Promise<string> {
  const ext = path.extname(originalName).toLowerCase();

  if (ext === '.pdf') {
    return extractFromPdf(filePath);
  }

  if (ext === '.docx' || ext === '.doc') {
    return extractFromDocx(filePath);
  }

  throw new Error(`Unsupported file type: ${ext}`);
}

function cleanExtractedText(text: string): string {
  return text
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function extractFromPdf(filePath: string): Promise<string> {
  const { PDFParse } = require('pdf-parse');
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText({});
  return cleanExtractedText(result.text);
}

async function extractFromDocx(filePath: string): Promise<string> {
  const mammoth = require('mammoth');
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return cleanExtractedText(result.value);
}
