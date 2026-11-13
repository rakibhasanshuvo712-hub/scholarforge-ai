'use client';

import React, { useState } from 'react';
import { GeneratedDocument, VisualTheme, ReportSection } from '@/types';
import { UniversityCoverPage } from './UniversityCoverPage';
import { MermaidRenderer } from './MermaidRenderer';
import { Edit3, Check, Trash2, Copy, BookOpen } from 'lucide-react';

interface DocumentViewerProps {
  document: GeneratedDocument;
  theme: VisualTheme;
  onUpdateSection?: (sectionIndex: number, updated: ReportSection) => void;
  onUpdatePrimaryDiagram?: (code: string) => void;
  onPngReady?: (pngUrl: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document: doc,
  theme,
  onUpdateSection,
  onUpdatePrimaryDiagram,
  onPngReady,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  const handleCopyRefs = () => {
    if (!doc.references) return;
    navigator.clipboard.writeText(doc.references.join('\n\n'));
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="printable-document w-full max-w-4xl mx-auto space-y-10">
      {/* Edit Toggle Pill in preview (no-print) */}
      <div className="no-print flex items-center justify-between bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <BookOpen className="w-4 h-4 text-indigo-500" />
          <span>Interactive Academic Paper View</span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isEditing
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
          {isEditing ? 'Done Editing' : 'Edit Text Live'}
        </button>
      </div>

      {/* 1. Formal University Cover Page */}
      <div className="avoid-break shadow-lg rounded-xl overflow-hidden">
        <UniversityCoverPage
          metadata={doc.metadata}
          title={doc.title}
          subtitle={doc.subtitle}
          mode={doc.mode}
          theme={theme}
        />
      </div>

      <div className="page-break" />

      {/* 2. Document Body Sheet */}
      <div className="bg-white text-slate-900 rounded-xl border border-slate-200 shadow-md p-8 sm:p-14 font-serif space-y-10">
        {/* Executive Summary / Abstract */}
        <section className="avoid-break space-y-3 pb-8 border-b border-slate-200">
          <h2
            className="text-lg font-sans font-bold tracking-wide uppercase"
            style={{ color: theme.primary }}
          >
            Abstract & Executive Summary
          </h2>
          <div className="p-4 bg-slate-50 rounded-lg border-l-4" style={{ borderColor: theme.accent }}>
            <p className="text-sm leading-relaxed text-slate-700 italic">
              {doc.executiveSummary}
            </p>
          </div>
        </section>

        {/* Primary Architecture Diagram */}
        {doc.primaryDiagram?.code && (
          <section className="avoid-break space-y-3 pb-8 border-b border-slate-200">
            <h2
              className="text-lg font-sans font-bold tracking-wide uppercase"
              style={{ color: theme.primary }}
            >
              System Architecture & Methodology Flowchart
            </h2>
            <div className="font-sans">
              <MermaidRenderer
                code={doc.primaryDiagram.code}
                title={doc.primaryDiagram.title}
                caption={doc.primaryDiagram.caption}
                editable={isEditing}
                onCodeChange={onUpdatePrimaryDiagram}
                onPngReady={onPngReady}
              />
            </div>
          </section>
        )}

        {/* Structured Sections */}
        {doc.sections && doc.sections.length > 0 && (
          <div className="space-y-10">
            {doc.sections.map((section, idx) => (
              <section key={section.id || idx} className="avoid-break space-y-4">
                {/* Section Heading */}
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={section.heading}
                      onChange={(e) =>
                        onUpdateSection?.(idx, { ...section, heading: e.target.value })
                      }
                      className="w-full text-xl font-bold font-sans bg-slate-50 px-2 py-1 rounded border border-indigo-400"
                    />
                  ) : (
                    <h3
                      className="text-xl font-sans font-bold tracking-tight"
                      style={{ color: theme.primary }}
                    >
                      {section.heading}
                    </h3>
                  )}

                  {section.subheading && (
                    <p
                      className="text-xs font-sans font-medium italic mt-0.5"
                      style={{ color: theme.secondary }}
                    >
                      {section.subheading}
                    </p>
                  )}
                </div>

                {/* Section Main Paragraph Content */}
                {isEditing ? (
                  <textarea
                    value={section.content}
                    onChange={(e) =>
                      onUpdateSection?.(idx, { ...section, content: e.target.value })
                    }
                    rows={5}
                    className="w-full text-sm leading-relaxed bg-slate-50 p-3 rounded border border-indigo-300 font-serif"
                  />
                ) : (
                  <p className="text-sm leading-relaxed text-slate-800 text-justify">
                    {section.content}
                  </p>
                )}

                {/* Bullet Points */}
                {section.bulletPoints && section.bulletPoints.length > 0 && (
                  <ul className="space-y-2 pl-4">
                    {section.bulletPoints.map((bp, bIdx) => (
                      <li key={bIdx} className="text-sm text-slate-700 flex items-start gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                          style={{ backgroundColor: theme.accent }}
                        />
                        {isEditing ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={bp}
                              onChange={(e) => {
                                const newPts = [...section.bulletPoints!];
                                newPts[bIdx] = e.target.value;
                                onUpdateSection?.(idx, { ...section, bulletPoints: newPts });
                              }}
                              className="flex-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-300 text-xs"
                            />
                            <button
                              onClick={() => {
                                const newPts = section.bulletPoints!.filter((_, i) => i !== bIdx);
                                onUpdateSection?.(idx, { ...section, bulletPoints: newPts });
                              }}
                              className="text-rose-500 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span>{bp}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Data Table */}
                {section.tableData && (
                  <div className="overflow-x-auto my-4 font-sans text-xs">
                    <table className="w-full border-collapse border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                      <thead>
                        <tr style={{ backgroundColor: theme.primary, color: '#ffffff' }}>
                          {section.tableData.headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-2.5 text-left font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {section.tableData.rows.map((r, rIdx) => (
                          <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}>
                            {r.map((c, cIdx) => (
                              <td key={cIdx} className="p-2.5 text-slate-700">
                                {c}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Code Snippet Box */}
                {section.codeSnippet && (
                  <div className="my-4 rounded-lg bg-slate-900 border border-slate-800 p-3.5 font-mono text-xs text-sky-300 overflow-x-auto shadow-inner">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[10px] text-slate-400">
                      <span>{section.codeLanguage?.toUpperCase() || 'SOURCE CODE'}</span>
                      <span>Verified Snippet</span>
                    </div>
                    <pre className="mt-2 whitespace-pre-wrap">{section.codeSnippet}</pre>
                  </div>
                )}

                {/* Section Specific Diagram */}
                {section.diagramCode && (
                  <div className="my-4 font-sans">
                    <MermaidRenderer
                      code={section.diagramCode}
                      title={section.diagramCaption || 'Section Diagram'}
                      editable={isEditing}
                      onCodeChange={(newCode) =>
                        onUpdateSection?.(idx, { ...section, diagramCode: newCode })
                      }
                    />
                  </div>
                )}
              </section>
            ))}
          </div>
        )}

        {/* References Section */}
        {doc.references && doc.references.length > 0 && (
          <section className="avoid-break space-y-4 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h2
                className="text-lg font-sans font-bold tracking-wide uppercase"
                style={{ color: theme.primary }}
              >
                Scholarly References & Bibliography
              </h2>
              <button
                onClick={handleCopyRefs}
                className="no-print inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-sans p-1 rounded"
                title="Copy all citations"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRef ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {doc.references.map((ref, idx) => (
                <li key={idx} className="pl-2">
                  <span className="font-serif">{ref}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
};
