import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ImageRun,
  PageBreak,
} from 'docx';
import { saveAs } from 'file-saver';
import { GeneratedDocument, VisualTheme } from '@/types';
import { convertMermaidToPng } from './mermaidToPng';

/**
 * Converts a base64 Data URL to a Uint8Array for docx ImageRun embedding
 */
function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64Data = dataUrl.split(',')[1] || dataUrl;
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function exportToDocx(
  doc: GeneratedDocument,
  theme: VisualTheme,
  cachedDiagramPng?: string
): Promise<void> {
  const colors = theme.docx;
  const isLab = doc.mode === 'lab_report';
  const isPres = doc.mode === 'presentation';

  // Pre-render diagram if needed
  let primaryDiagramBytes: Uint8Array | null = null;
  if (doc.primaryDiagram?.code) {
    let pngUrl = cachedDiagramPng;
    if (!pngUrl) {
      try {
        const res = await convertMermaidToPng(doc.primaryDiagram.code, { scale: 2 });
        pngUrl = res.pngDataUrl;
      } catch (err) {
        console.warn('Could not render primary diagram for DOCX:', err);
      }
    }
    if (pngUrl) {
      try {
        primaryDiagramBytes = dataUrlToUint8Array(pngUrl);
      } catch (e) {
        console.warn('Failed to convert diagram PNG to buffer for docx:', e);
      }
    }
  }

  // Build Document Elements
  const docChildren: any[] = [];

  // ==========================================
  // 1. FORMAL UNIVERSITY COVER PAGE
  // ==========================================
  
  // Institution Name (Large bold centered)
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: (doc.metadata.institution || 'UNIVERSITY ACADEMIC FACULTY').toUpperCase(),
          font: 'Times New Roman',
          size: 32, // 16pt
          bold: true,
          color: colors.primary,
        }),
      ],
    })
  );

  // Department
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `DEPARTMENT OF ${(doc.metadata.department || 'COMPUTER SCIENCE & ENGINEERING').toUpperCase()}`,
          font: 'Times New Roman',
          size: 24, // 12pt
          color: '475569',
        }),
      ],
    })
  );

  // Course Code & Title
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: `${doc.metadata.courseCode} — ${doc.metadata.courseTitle}`,
          font: 'Times New Roman',
          size: 26,
          bold: true,
          color: colors.secondary,
        }),
      ],
    })
  );

  // Document Mode Badge / Sub-heading
  const modeLabel = isLab
    ? 'FORMAL LABORATORY EXPERIMENT REPORT'
    : isPres
    ? 'EXECUTIVE PRESENTATION COMPENDIUM'
    : 'ACADEMIC COURSEWORK ASSIGNMENT';

  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: `[ ${modeLabel} ]`,
          font: 'Times New Roman',
          size: 22,
          bold: true,
          color: colors.accent,
        }),
      ],
    })
  );

  // Title
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 300 },
      children: [
        new TextRun({
          text: doc.title,
          font: 'Times New Roman',
          size: 40, // 20pt
          bold: true,
          color: colors.primary,
        }),
      ],
    })
  );

  if (doc.subtitle) {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 },
        children: [
          new TextRun({
            text: doc.subtitle,
            font: 'Times New Roman',
            size: 24,
            italics: true,
            color: '64748B',
          }),
        ],
      })
    );
  } else {
    docChildren.push(new Paragraph({ spacing: { after: 600 }, children: [] }));
  }

  // Metadata Table (Formal academic cover page layout)
  const metaTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: colors.border },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: colors.border },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.DOTTED, size: 1, color: 'CBD5E1' },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: { top: 120, bottom: 120, left: 100, right: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'SUBMITTED BY:\n', bold: true, size: 20, color: colors.primary }),
                  new TextRun({ text: `Student Name: `, bold: true, size: 20 }),
                  new TextRun({ text: `${doc.metadata.studentName}\n`, size: 20 }),
                  new TextRun({ text: `Student ID: `, bold: true, size: 20 }),
                  new TextRun({ text: `${doc.metadata.studentId}\n`, size: 20 }),
                  new TextRun({ text: `Department: `, bold: true, size: 20 }),
                  new TextRun({ text: `${doc.metadata.department}`, size: 20 }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: { top: 120, bottom: 120, left: 100, right: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'SUBMITTED TO:\n', bold: true, size: 20, color: colors.primary }),
                  new TextRun({ text: `Course Instructor: `, bold: true, size: 20 }),
                  new TextRun({ text: `${doc.metadata.instructorName}\n`, size: 20 }),
                  new TextRun({ text: `Course Title: `, bold: true, size: 20 }),
                  new TextRun({ text: `${doc.metadata.courseTitle}\n`, size: 20 }),
                  new TextRun({ text: `Submission Date: `, bold: true, size: 20 }),
                  new TextRun({ text: `${doc.metadata.submissionDate}`, size: 20 }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  docChildren.push(metaTable);

  // Page break after cover page
  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // 2. EXECUTIVE SUMMARY / ABSTRACT
  // ==========================================
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'Executive Summary & Abstract',
          bold: true,
          size: 28,
          color: colors.primary,
        }),
      ],
    })
  );

  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: doc.executiveSummary || 'This document provides formal derivations, system architecture models, and empirical analyses.',
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  // ==========================================
  // 3. SECTIONS (FOR LAB REPORTS & ASSIGNMENTS)
  // ==========================================
  if (doc.sections && doc.sections.length > 0) {
    for (const sec of doc.sections) {
      docChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 120 },
          children: [
            new TextRun({
              text: sec.heading,
              bold: true,
              size: 24,
              color: colors.primary,
            }),
          ],
        })
      );

      if (sec.subheading) {
        docChildren.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: sec.subheading,
                italics: true,
                size: 20,
                color: colors.secondary,
              }),
            ],
          })
        );
      }

      if (sec.content) {
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: sec.content,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
          })
        );
      }

      // Bullet points
      if (sec.bulletPoints && sec.bulletPoints.length > 0) {
        for (const pt of sec.bulletPoints) {
          docChildren.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 80 },
              children: [
                new TextRun({
                  text: pt,
                  size: 22,
                  font: 'Times New Roman',
                }),
              ],
            })
          );
        }
      }

      // Data Tables if present
      if (sec.tableData && sec.tableData.headers && sec.tableData.rows) {
        const tableHeaderCells = sec.tableData.headers.map(
          (h) =>
            new TableCell({
              shading: { fill: colors.tableHeaderBg },
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: h,
                      bold: true,
                      size: 20,
                      color: 'FFFFFF',
                    }),
                  ],
                }),
              ],
            })
        );

        const tableBodyRows = sec.tableData.rows.map(
          (row) =>
            new TableRow({
              children: row.map(
                (cellText) =>
                  new TableCell({
                    margins: { top: 60, bottom: 60, left: 100, right: 100 },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: cellText,
                            size: 20,
                            font: 'Times New Roman',
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            })
        );

        const dataTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
            left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
            right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
          },
          rows: [new TableRow({ children: tableHeaderCells }), ...tableBodyRows],
        });

        docChildren.push(new Paragraph({ spacing: { before: 100, after: 100 }, children: [] }));
        docChildren.push(dataTable);
        docChildren.push(new Paragraph({ spacing: { after: 200 }, children: [] }));
      }

      // Code Block
      if (sec.codeSnippet) {
        docChildren.push(
          new Paragraph({
            spacing: { before: 120, after: 120 },
            shading: { fill: 'F1F5F9' },
            children: [
              new TextRun({
                text: sec.codeSnippet,
                font: 'Courier New',
                size: 18,
                color: '0F172A',
              }),
            ],
          })
        );
      }
    }
  }

  // ==========================================
  // 4. EMBEDDED MERMAID DIAGRAM
  // ==========================================
  if (primaryDiagramBytes) {
    docChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 120 },
        children: [
          new TextRun({
            text: doc.primaryDiagram?.title || 'System Architecture & Flowchart',
            bold: true,
            size: 24,
            color: colors.primary,
          }),
        ],
      })
    );

    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 80 },
        children: [
          new ImageRun({
            type: 'png',
            data: primaryDiagramBytes,
            transformation: {
              width: 540,
              height: 280,
            },
          }),
        ],
      })
    );

    if (doc.primaryDiagram?.caption) {
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: doc.primaryDiagram.caption,
              italics: true,
              size: 20,
              color: '64748B',
            }),
          ],
        })
      );
    }
  }

  // ==========================================
  // 5. SLIDES RECAP (IF PRESENTATION MODE)
  // ==========================================
  if (isPres && doc.slides && doc.slides.length > 0) {
    docChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 },
        children: [
          new TextRun({
            text: 'Slide-by-Slide Content & Speaker Transcript',
            bold: true,
            size: 24,
            color: colors.primary,
          }),
        ],
      })
    );

    for (const slide of doc.slides) {
      docChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 80 },
          children: [
            new TextRun({
              text: `Slide ${slide.slideNumber}: ${slide.title}`,
              bold: true,
              size: 22,
              color: colors.secondary,
            }),
          ],
        })
      );

      for (const bullet of slide.bullets) {
        docChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: bullet,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
          })
        );
      }

      if (slide.speakerNotes) {
        docChildren.push(
          new Paragraph({
            spacing: { before: 60, after: 140 },
            children: [
              new TextRun({ text: 'Speaker Notes: ', italics: true, bold: true, size: 20, color: '475569' }),
              new TextRun({ text: slide.speakerNotes, italics: true, size: 20, color: '64748B' }),
            ],
          })
        );
      }
    }
  }

  // ==========================================
  // 6. REFERENCES
  // ==========================================
  if (doc.references && doc.references.length > 0) {
    docChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 120 },
        children: [
          new TextRun({
            text: 'Scholarly References & Bibliography',
            bold: true,
            size: 24,
            color: colors.primary,
          }),
        ],
      })
    );

    doc.references.forEach((ref, idx) => {
      docChildren.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: `[${idx + 1}] `,
              bold: true,
              size: 20,
              color: colors.primary,
            }),
            new TextRun({
              text: ref,
              size: 20,
              font: 'Times New Roman',
            }),
          ],
        })
      );
    });
  }

  // Build Document
  const wordDoc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(wordDoc);
  const cleanFileName = (doc.title || 'ScholarForge_Document')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 50);

  saveAs(blob, `${cleanFileName}.docx`);
}
