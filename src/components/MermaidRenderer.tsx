'use client';

import React, { useEffect, useState } from 'react';
import { convertMermaidToPng } from '@/utils/mermaidToPng';
import { Code2, RefreshCw, Check, AlertCircle, Copy, Download, Eye } from 'lucide-react';

interface MermaidRendererProps {
  code: string;
  title?: string;
  caption?: string;
  onCodeChange?: (newCode: string) => void;
  onPngReady?: (pngDataUrl: string) => void;
  editable?: boolean;
}

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({
  code,
  title,
  caption,
  onCodeChange,
  onPngReady,
  editable = true,
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [pngUrl, setPngUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [currentCode, setCurrentCode] = useState<string>(code);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync internal state when external prop changes
  useEffect(() => {
    setCurrentCode(code);
  }, [code]);

  // Render diagram whenever currentCode changes
  useEffect(() => {
    let isCancelled = false;

    async function renderDiagram() {
      if (!currentCode.trim()) {
        setSvgContent('');
        setPngUrl('');
        setIsRendering(false);
        return;
      }

      setIsRendering(true);
      setError(null);

      try {
        const { svg, pngDataUrl } = await convertMermaidToPng(currentCode, {
          backgroundColor: '#ffffff',
          scale: 2,
        });

        if (!isCancelled) {
          setSvgContent(svg);
          setPngUrl(pngDataUrl);
          setIsRendering(false);
          if (onPngReady) {
            onPngReady(pngDataUrl);
          }
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error('Mermaid render error:', err);
          setError(err?.message || 'Failed to parse Mermaid diagram syntax');
          setIsRendering(false);
        }
      }
    }

    const timeout = setTimeout(renderDiagram, 300);
    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [currentCode, onPngReady]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    if (!pngUrl) return;
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `${title || 'scholar-diagram'}.png`;
    link.click();
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <h4 className="text-xs font-semibold tracking-wide uppercase text-slate-700 dark:text-slate-300">
            {title || 'Academic Architecture Diagram'}
          </h4>
        </div>
        
        <div className="flex items-center gap-1.5">
          {editable && (
            <button
              onClick={() => setShowCode(!showCode)}
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                showCode
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
              title="Toggle Live Mermaid Code Editor"
            >
              {showCode ? <Eye className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
              {showCode ? 'View Preview' : 'Edit Syntax'}
            </button>
          )}

          <button
            onClick={handleCopyCode}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="Copy Mermaid Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {pngUrl && (
            <button
              onClick={handleDownloadPng}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              title="Download PNG directly"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Code Editor Drawer */}
      {showCode && editable && (
        <div className="p-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center justify-between pb-1.5 text-[11px] text-slate-400">
            <span>Live Mermaid.js Editor (updates real-time)</span>
            <span className="text-indigo-400">flowchart / sequence / class / er</span>
          </div>
          <textarea
            value={currentCode}
            onChange={(e) => {
              setCurrentCode(e.target.value);
              if (onCodeChange) onCodeChange(e.target.value);
            }}
            rows={7}
            className="w-full font-mono text-xs bg-slate-950 text-emerald-400 p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
            placeholder="flowchart TD..."
          />
        </div>
      )}

      {/* Diagram Canvas Body */}
      <div className="p-4 bg-white dark:bg-slate-950/40 flex flex-col items-center justify-center min-h-[220px] overflow-x-auto">
        {isRendering ? (
          <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
            <span className="text-xs">Rendering diagram graphics...</span>
          </div>
        ) : error ? (
          <div className="w-full p-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
            <div className="flex items-center gap-2 mb-1 font-semibold text-xs">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Mermaid Compilation Error</span>
            </div>
            <p className="text-xs font-mono break-all">{error}</p>
            <p className="text-[11px] mt-2 text-rose-600 dark:text-rose-400">
              Tip: Click <strong>"Edit Syntax"</strong> above and ensure node labels with spaces are enclosed in double quotes (e.g. <code>A[&quot;Label&quot;] --&gt; B[&quot;Step&quot;]</code>).
            </p>
          </div>
        ) : svgContent ? (
          <div
            className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto transition-transform duration-200 hover:scale-[1.01]"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <p className="text-xs text-slate-400 italic">No diagram code provided.</p>
        )}
      </div>

      {/* Caption footer */}
      {caption && (
        <div className="px-4 py-2 bg-slate-50/80 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <p className="text-[11px] italic font-serif text-slate-600 dark:text-slate-400">
            {caption}
          </p>
        </div>
      )}
    </div>
  );
};
