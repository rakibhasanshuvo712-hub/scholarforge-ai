/**
 * Utility to render Mermaid diagram syntax and convert to high-resolution PNG data URL.
 * Designed to run in browser environments for seamless PPTX & DOCX export embedding.
 */

export async function convertMermaidToPng(
  mermaidCode: string,
  options: {
    theme?: 'default' | 'neutral' | 'dark' | 'forest';
    backgroundColor?: string;
    scale?: number;
  } = {}
): Promise<{ svg: string; pngDataUrl: string }> {
  if (typeof window === 'undefined') {
    throw new Error('convertMermaidToPng must be called in a browser environment');
  }

  const { default: mermaid } = await import('mermaid');

  const { theme = 'default', backgroundColor = '#ffffff', scale = 2 } = options;

  mermaid.initialize({
    startOnLoad: false,
    theme: theme as any,
    securityLevel: 'loose',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  });

  const renderId = `scholar-mermaid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Render SVG using mermaid
  const { svg } = await mermaid.render(renderId, mermaidCode.trim());

  // Convert SVG string to PNG via HTML5 Canvas
  const pngDataUrl = await new Promise<string>((resolve, reject) => {
    try {
      // Create a temporary DOM parser to inspect dimensions
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, 'image/svg+xml');
      const svgElement = doc.documentElement;

      let width = parseFloat(svgElement.getAttribute('width') || '0');
      let height = parseFloat(svgElement.getAttribute('height') || '0');

      if (!width || !height) {
        const viewBox = svgElement.getAttribute('viewBox');
        if (viewBox) {
          const parts = viewBox.split(/\s+|,/).map(parseFloat);
          if (parts.length === 4) {
            width = parts[2];
            height = parts[3];
          }
        }
      }

      if (!width || width <= 0) width = 800;
      if (!height || height <= 0) height = 450;

      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context not supported'));
        return;
      }

      // Draw solid background so exported PNG is crisp on slides and Word docs
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const img = new Image();
      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(new Error(`Failed to load SVG into image: ${err}`));
      };

      img.src = url;
    } catch (e) {
      reject(e);
    }
  });

  return { svg, pngDataUrl };
}
