import { GeneratedDocument, VisualTheme } from '@/types';
import { convertMermaidToPng } from './mermaidToPng';

export async function exportToPptx(
  doc: GeneratedDocument,
  theme: VisualTheme,
  cachedDiagramPng?: string
): Promise<void> {
  // Dynamically load pptxgenjs on client
  const pptxModule = await import('pptxgenjs');
  const pptxgen = pptxModule.default;
  const pptx = new pptxgen();

  pptx.layout = 'LAYOUT_16x9';
  pptx.author = doc.metadata.studentName || 'ScholarForge AI';
  pptx.company = doc.metadata.institution || 'University';
  pptx.title = doc.title;
  pptx.subject = `${doc.metadata.courseCode} - ${doc.metadata.courseTitle}`;

  const colors = theme.pptx;

  // 1. TITLE / COVER SLIDE
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: colors.bg };

  // Top course badge
  titleSlide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 0.8,
    w: 11.7,
    h: 0.5,
    fill: { color: colors.primary },
    rectRadius: 0.05,
  });

  titleSlide.addText(`${doc.metadata.courseCode.toUpperCase()} • ${doc.metadata.courseTitle.toUpperCase()}`, {
    x: 1.0,
    y: 0.8,
    w: 11.3,
    h: 0.5,
    fontFace: 'Arial',
    fontSize: 12,
    bold: true,
    color: 'FFFFFF',
    valign: 'middle',
  });

  // Presentation Title
  titleSlide.addText(doc.title, {
    x: 0.8,
    y: 1.6,
    w: 11.7,
    h: 1.5,
    fontFace: 'Arial',
    fontSize: 28,
    bold: true,
    color: colors.primary,
    valign: 'top',
  });

  if (doc.subtitle) {
    titleSlide.addText(doc.subtitle, {
      x: 0.8,
      y: 3.1,
      w: 11.7,
      h: 0.6,
      fontFace: 'Arial',
      fontSize: 16,
      color: colors.text,
      italic: true,
    });
  }

  // Metadata Card / Bottom Box
  titleSlide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 4.2,
    w: 11.7,
    h: 2.3,
    fill: { color: colors.cardBg },
    line: { color: colors.primary, width: 1.5 },
    rectRadius: 0.1,
  });

  const leftColMeta = [
    { text: 'PRESENTER INFORMATION\n', options: { bold: true, fontSize: 11, color: colors.primary } },
    { text: `Student Name: `, options: { bold: true, fontSize: 11, color: colors.text } },
    { text: `${doc.metadata.studentName}\n`, options: { fontSize: 11, color: colors.text } },
    { text: `Student ID: `, options: { bold: true, fontSize: 11, color: colors.text } },
    { text: `${doc.metadata.studentId}\n`, options: { fontSize: 11, color: colors.text } },
    { text: `Department: `, options: { bold: true, fontSize: 11, color: colors.text } },
    { text: `${doc.metadata.department}`, options: { fontSize: 11, color: colors.text } },
  ];

  titleSlide.addText(leftColMeta, {
    x: 1.1,
    y: 4.4,
    w: 5.4,
    h: 1.9,
    fontFace: 'Arial',
  });

  const rightColMeta = [
    { text: 'INSTITUTION & SUBMISSION\n', options: { bold: true, fontSize: 11, color: colors.primary } },
    { text: `Institution: `, options: { bold: true, fontSize: 11, color: colors.text } },
    { text: `${doc.metadata.institution}\n`, options: { fontSize: 11, color: colors.text } },
    { text: `Course Instructor: `, options: { bold: true, fontSize: 11, color: colors.text } },
    { text: `${doc.metadata.instructorName}\n`, options: { fontSize: 11, color: colors.text } },
    { text: `Date of Submission: `, options: { bold: true, fontSize: 11, color: colors.text } },
    { text: `${doc.metadata.submissionDate}`, options: { fontSize: 11, color: colors.text } },
  ];

  titleSlide.addText(rightColMeta, {
    x: 6.8,
    y: 4.4,
    w: 5.4,
    h: 1.9,
    fontFace: 'Arial',
  });

  titleSlide.addNotes(`Presentation Title: ${doc.title}. Introduction of research scope and student credentials.`);

  // 2. CONTENT SLIDES
  if (doc.slides && doc.slides.length > 0) {
    for (const slideData of doc.slides) {
      if (slideData.slideNumber === 1 && slideData.title.toLowerCase().includes('distributed') && doc.title.toLowerCase().includes('distributed')) {
        continue;
      }

      const slide = pptx.addSlide();
      slide.background = { color: colors.bg };

      // Slide Header Accent Bar
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: 0.6,
        w: 0.15,
        h: 0.7,
        fill: { color: colors.accent },
      });

      slide.addText(slideData.title, {
        x: 1.1,
        y: 0.5,
        w: 11.4,
        h: 0.55,
        fontFace: 'Arial',
        fontSize: 22,
        bold: true,
        color: colors.primary,
        valign: 'middle',
      });

      if (slideData.subtitle) {
        slide.addText(slideData.subtitle, {
          x: 1.1,
          y: 1.05,
          w: 11.4,
          h: 0.35,
          fontFace: 'Arial',
          fontSize: 12,
          italic: true,
          color: colors.secondary,
        });
      }

      const hasDiagram = Boolean(slideData.diagramCode);
      const hasCode = Boolean(slideData.codeSnippet);
      const contentWidth = hasDiagram || hasCode ? 5.8 : 11.5;

      // Bullets
      if (slideData.bullets && slideData.bullets.length > 0) {
        const bulletObjects = slideData.bullets.map((b) => ({
          text: b,
          options: {
            bullet: { type: 'bullet' as const, code: '2022' },
            fontFace: 'Arial',
            fontSize: 14,
            color: colors.text,
            spaceAfter: 12,
          },
        }));

        slide.addText(bulletObjects, {
          x: 0.8,
          y: 1.6,
          w: contentWidth,
          h: 4.8,
          valign: 'top',
        });
      }

      // If slide has embedded diagram
      if (hasDiagram && slideData.diagramCode) {
        try {
          const { pngDataUrl } = await convertMermaidToPng(slideData.diagramCode);
          slide.addImage({
            data: pngDataUrl,
            x: 6.9,
            y: 1.6,
            w: 5.5,
            h: 4.2,
            sizing: { type: 'contain', w: 5.5, h: 4.2 },
          });

          if (slideData.diagramCaption) {
            slide.addText(slideData.diagramCaption, {
              x: 6.9,
              y: 5.9,
              w: 5.5,
              h: 0.5,
              fontSize: 10,
              fontFace: 'Arial',
              italic: true,
              color: colors.secondary,
              align: 'center',
            });
          }
        } catch (e) {
          console.warn('Failed to embed slide diagram PNG:', e);
        }
      } else if (hasCode && slideData.codeSnippet) {
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 6.9,
          y: 1.6,
          w: 5.5,
          h: 4.8,
          fill: { color: '1E293B' },
          rectRadius: 0.05,
        });

        slide.addText(slideData.codeSnippet, {
          x: 7.1,
          y: 1.8,
          w: 5.1,
          h: 4.4,
          fontFace: 'Courier New',
          fontSize: 9.5,
          color: '38BDF8',
          valign: 'top',
        });
      }

      if (slideData.callout && !hasDiagram && !hasCode) {
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.8,
          y: 5.4,
          w: 11.5,
          h: 1.2,
          fill: { color: colors.cardBg },
          line: { color: colors.accent, width: 1 },
          rectRadius: 0.05,
        });

        slide.addText(
          [
            { text: 'KEY TAKEAWAY: ', options: { bold: true, color: colors.accent, fontSize: 11 } },
            { text: slideData.callout, options: { italic: true, color: colors.text, fontSize: 11 } },
          ],
          {
            x: 1.0,
            y: 5.5,
            w: 11.1,
            h: 1.0,
            fontFace: 'Arial',
            valign: 'middle',
          }
        );
      }

      if (slideData.speakerNotes) {
        slide.addNotes(slideData.speakerNotes);
      }
    }
  }

  // 3. PRIMARY ARCHITECTURE DIAGRAM SLIDE
  if (doc.primaryDiagram?.code) {
    let pngDataUrl = cachedDiagramPng;
    if (!pngDataUrl) {
      try {
        const result = await convertMermaidToPng(doc.primaryDiagram.code, { scale: 2 });
        pngDataUrl = result.pngDataUrl;
      } catch (e) {
        console.warn('Could not render primary diagram for PPTX slide:', e);
      }
    }

    if (pngDataUrl) {
      const diagramSlide = pptx.addSlide();
      diagramSlide.background = { color: colors.bg };

      diagramSlide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: 0.6,
        w: 0.15,
        h: 0.7,
        fill: { color: colors.accent },
      });

      diagramSlide.addText(doc.primaryDiagram.title || 'System Architecture & Data Flow', {
        x: 1.1,
        y: 0.5,
        w: 11.4,
        h: 0.55,
        fontFace: 'Arial',
        fontSize: 22,
        bold: true,
        color: colors.primary,
        valign: 'middle',
      });

      diagramSlide.addImage({
        data: pngDataUrl,
        x: 1.0,
        y: 1.5,
        w: 11.3,
        h: 4.8,
        sizing: { type: 'contain', w: 11.3, h: 4.8 },
      });

      diagramSlide.addText(doc.primaryDiagram.caption || 'Figure: Primary System Architecture Flow', {
        x: 1.0,
        y: 6.4,
        w: 11.3,
        h: 0.4,
        fontSize: 11,
        fontFace: 'Arial',
        italic: true,
        color: colors.secondary,
        align: 'center',
      });

      diagramSlide.addNotes('Walk through the primary system architecture diagram. Explain message routing, consensus validation, and persistence.');
    }
  }

  // 4. REFERENCES / CLOSING SLIDE
  if (doc.references && doc.references.length > 0) {
    const refSlide = pptx.addSlide();
    refSlide.background = { color: colors.bg };

    refSlide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 0.6,
      w: 0.15,
      h: 0.7,
      fill: { color: colors.accent },
    });

    refSlide.addText('Scholarly References & Literature', {
      x: 1.1,
      y: 0.5,
      w: 11.4,
      h: 0.55,
      fontFace: 'Arial',
      fontSize: 22,
      bold: true,
      color: colors.primary,
      valign: 'middle',
    });

    const refBullets = doc.references.map((ref) => ({
      text: ref,
      options: {
        bullet: { type: 'bullet' as const, code: '2022' },
        fontFace: 'Arial',
        fontSize: 12,
        color: colors.text,
        spaceAfter: 12,
      },
    }));

    refSlide.addText(refBullets, {
      x: 0.8,
      y: 1.6,
      w: 11.7,
      h: 4.5,
      valign: 'top',
    });

    refSlide.addText('Thank you! Questions and Discussion', {
      x: 0.8,
      y: 6.2,
      w: 11.7,
      h: 0.5,
      fontSize: 16,
      bold: true,
      color: colors.primary,
      align: 'center',
    });

    refSlide.addNotes('Acknowledge sources and open the floor to instructor and peer inquiries.');
  }

  const cleanFileName = (doc.title || 'ScholarForge_Presentation')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 50);

  await pptx.writeFile({ fileName: `${cleanFileName}.pptx` });
}
