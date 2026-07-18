import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { generatePdf, type PdfTemplate } from '../services/pdf.service';

const SECTION_HEADERS = ['Contact', 'Summary', 'Skills', 'Experience', 'Projects', 'Education'];

function parseSections(text: string): { name: string; content: string }[] {
  const lines = text.split('\n');
  const sections: { name: string; content: string[] }[] = [];
  let current: { name: string; content: string[] } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const headerMatch = SECTION_HEADERS.find(
      (h) => trimmed.toLowerCase() === h.toLowerCase() || trimmed.toLowerCase().startsWith(h.toLowerCase() + ':')
    );
    if (headerMatch) {
      if (current) sections.push(current);
      current = { name: headerMatch, content: [] };
    } else if (current) {
      current.content.push(line);
    }
  }
  if (current) sections.push(current);

  return sections.map((s) => ({
    name: s.name,
    content: s.content.join('\n').trim(),
  }));
}

function sanitizeFilename(name: string): string {
  return (name || 'optimized-resume')
    .replace(/[^a-zA-Z0-9\s\-_]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 100) || 'optimized-resume';
}

function buildDocx(content: string): Document {
  const sections = parseSections(content);
  const children: (Paragraph)[] = [];

  if (sections.length === 0) {
    content.split('\n').forEach((line) => {
      children.push(new Paragraph({ children: [new TextRun(line)] }));
    });
  } else {
    for (const section of sections) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: section.name, bold: true, size: 28 })],
          spacing: { before: 400, after: 100 },
        })
      );

      const paragraphs = section.content.split('\n').filter((l) => l.trim());
      for (const p of paragraphs) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: p.trim(), size: 22 })],
            spacing: { after: 80 },
          })
        );
      }
    }
  }

  return new Document({
    title: 'Optimized Resume',
    description: 'AI-optimized resume',
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22 },
          paragraph: { spacing: { after: 120 } },
        },
      },
    },
    sections: [{ children }],
  });
}

export const exportPdf = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { content, filename, template, user } = req.body;
    if (!content) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }

    const safeName = sanitizeFilename(filename);
    const pdfBuffer = await generatePdf(content, (template || 'minimal') as PdfTemplate, user);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

export const exportDocx = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { content, filename } = req.body;
    if (!content) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }

    const safeName = sanitizeFilename(filename);
    const doc = buildDocx(content);
    const buffer = await Packer.toBuffer(doc);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}.docx"`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};
