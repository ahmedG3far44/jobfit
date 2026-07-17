import PDFDocument from 'pdfkit';

interface TemplateStyle {
  name: string;
  font: string;
  headerColor: string;
  headerSize: number;
  sectionTitleSize: number;
  bodySize: number;
  spacing: number;
  lineHeight: number;
}

const TEMPLATES: Record<string, TemplateStyle> = {
  minimal: {
    name: 'Minimal',
    font: 'Helvetica',
    headerColor: '#1a1a1a',
    headerSize: 24,
    sectionTitleSize: 13,
    bodySize: 10,
    spacing: 14,
    lineHeight: 1.4,
  },
  modern: {
    name: 'Modern',
    font: 'Helvetica',
    headerColor: '#2563eb',
    headerSize: 26,
    sectionTitleSize: 12,
    bodySize: 10,
    spacing: 12,
    lineHeight: 1.45,
  },
  classic: {
    name: 'Classic',
    font: 'Times-Roman',
    headerColor: '#1a1a1a',
    headerSize: 22,
    sectionTitleSize: 13,
    bodySize: 11,
    spacing: 16,
    lineHeight: 1.5,
  },
  compact: {
    name: 'Compact',
    font: 'Helvetica',
    headerColor: '#1a1a1a',
    headerSize: 20,
    sectionTitleSize: 11,
    bodySize: 9,
    spacing: 10,
    lineHeight: 1.3,
  },
};

export type PdfTemplate = keyof typeof TEMPLATES;
export const PDF_TEMPLATES = TEMPLATES;
export const PDF_TEMPLATE_KEYS = Object.keys(TEMPLATES) as PdfTemplate[];

interface Section {
  name: string;
  content: string;
}

const SECTION_HEADERS = ['Contact', 'Summary', 'Skills', 'Experience', 'Projects', 'Education'];

function parseSections(text: string): Section[] {
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

export function generatePdf(content: string, templateKey: PdfTemplate = 'minimal'): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const style = TEMPLATES[templateKey] || TEMPLATES.minimal;
    const sections = parseSections(content);
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      info: { Title: 'Optimized Resume' },
    });

    const buffers: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    doc.font(style.font);

    if (sections.length === 0) {
      doc.fontSize(style.bodySize).text(content, { lineGap: 2 });
    } else {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const isContact = section.name === 'Contact';

        if (isContact) {
          const lines = section.content.split('\n').filter((l) => l.trim());
          const nameLine = lines[0] || '';
          const restLines = lines.slice(1);

          if (nameLine) {
            const boldFont = style.font === 'Helvetica' ? 'Helvetica-Bold' : style.font === 'Times-Roman' ? 'Times-Bold' : style.font;
            doc.fontSize(style.headerSize).font(boldFont);
            if (templateKey === 'modern') {
              doc.fillColor('#2563eb').text(nameLine);
            } else if (templateKey === 'classic') {
              doc.fillColor('#000000').text(nameLine);
            } else {
              doc.fillColor('#000000').text(nameLine);
            }
            doc.moveDown(0.4);
          }

          if (restLines.length > 0) {
            doc.fillColor('#000000').fontSize(style.bodySize).font(style.font);
            for (const line of restLines) {
              const urlMatch = line.match(/^(.+?):\s*(https?:\/\/.+)$/);
              if (urlMatch) {
                doc.text(urlMatch[1].trim(), { lineGap: 1 });
              } else {
                doc.text(line.trim(), { lineGap: 1 });
              }
              doc.moveDown(0.1);
            }
          }

          if (i < sections.length - 1) {
            doc.moveDown(1);
          }
          continue;
        }

        if (templateKey === 'modern') {
          doc.fillColor('#2563eb').fontSize(style.sectionTitleSize).font(style.font);
          doc.text(section.name.toUpperCase(), { underline: false });
          doc.fillColor('#000000').fontSize(style.bodySize);
        } else if (templateKey === 'classic') {
          doc.fillColor('#000000').fontSize(style.sectionTitleSize).font(style.font);
          doc.text(section.name.toUpperCase(), { underline: true });
          doc.moveDown(0.3);
          doc.fillColor('#000000').fontSize(style.bodySize);
        } else {
          doc.fillColor('#000000').fontSize(style.sectionTitleSize).font(style.font);
          doc.text(section.name.toUpperCase());
          doc.fillColor('#000000').fontSize(style.bodySize);
        }

        const paragraphs = section.content.split('\n').filter((l) => l.trim());
        for (const p of paragraphs) {
          doc.fillColor('#000000').text(p.trim(), { lineGap: 2, indent: 0 });
          doc.moveDown(0.2);
        }

        if (i < sections.length - 1) {
          doc.moveDown(0.5);
        }
      }
    }

    doc.end();
  });
}
