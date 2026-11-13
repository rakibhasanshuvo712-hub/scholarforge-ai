'use client';

import React, { useState } from 'react';
import {
  AcademicMode,
  CoverPageMetadata,
  GeneratedDocument,
  ThemeId,
  SlideItem,
  ReportSection,
} from '@/types';
import { THEMES } from '@/types/themes';
import { UnifiedInputForm } from '@/components/UnifiedInputForm';
import { PresentationViewer } from '@/components/PresentationViewer';
import { DocumentViewer } from '@/components/DocumentViewer';
import { ExportToolbar } from '@/components/ExportToolbar';
import {
  GraduationCap,
  Sparkles,
  Presentation,
  FileText,
  Workflow,
  CheckCircle2,
} from 'lucide-react';

export default function Home() {
  const [document, setDocument] = useState<GeneratedDocument | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>('academic_classic');
  const [cachedDiagramPng, setCachedDiagramPng] = useState<string | undefined>(undefined);
  const [apiNotice, setApiNotice] = useState<string | null>(null);

  const activeTheme = THEMES[selectedThemeId] || THEMES.academic_classic;

  const handleGenerate = async (formData: {
    mode: AcademicMode;
    title: string;
    description: string;
    metadata: CoverPageMetadata;
    codeSnippet?: string;
    count: number;
    themeId: ThemeId;
    apiKey?: string;
  }) => {
    setIsLoading(true);
    setApiNotice(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(formData.apiKey ? { 'x-gemini-key': formData.apiKey } : {}),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success && data.document) {
        setDocument(data.document);
        setSelectedThemeId(formData.themeId);

        if (data.isMockFallback) {
          setApiNotice('Generated using ScholarForge Offline Academic Template Engine (Full multi-format export ready!)');
        } else {
          setApiNotice('Generated via Google Gemini 1.5 Pro/Flash AI Engine with structured validation.');
        }
      } else {
        alert(`Generation failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Error in handleGenerate:', err);
      alert(`Network or Server error: ${err?.message || 'Failed to connect to /api/generate'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers for updating slides
  const handleUpdateSlide = (slideIndex: number, updatedSlide: SlideItem) => {
    if (!document || !document.slides) return;
    const newSlides = [...document.slides];
    newSlides[slideIndex] = updatedSlide;
    setDocument({ ...document, slides: newSlides });
  };

  const handleAddSlide = () => {
    if (!document || !document.slides) return;
    const newSlide: SlideItem = {
      id: `slide-${document.slides.length + 1}`,
      slideNumber: document.slides.length + 1,
      title: 'New Investigation Topic',
      subtitle: 'Key Discussion Point',
      bullets: ['Comprehensive analytical review', 'Empirical validation metrics'],
      speakerNotes: 'Discuss key findings and observations.',
    };
    setDocument({ ...document, slides: [...document.slides, newSlide] });
  };

  // Handlers for updating report sections
  const handleUpdateSection = (sectionIndex: number, updatedSection: ReportSection) => {
    if (!document || !document.sections) return;
    const newSections = [...document.sections];
    newSections[sectionIndex] = updatedSection;
    setDocument({ ...document, sections: newSections });
  };

  const handleUpdatePrimaryDiagram = (code: string) => {
    if (!document) return;
    setDocument({
      ...document,
      primaryDiagram: {
        ...document.primaryDiagram,
        code,
      },
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Academic Header */}
      <header className="no-print border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ScholarForge AI
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Architect Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                AI Presentation Maker • Lab Reports • Word &amp; PPTX Multi-Export
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Workflow className="w-3.5 h-3.5 text-emerald-500" /> Mermaid.js
              </span>
              <span>•</span>
              <span className="font-mono text-orange-500">.pptx</span>
              <span>•</span>
              <span className="font-mono text-blue-500">.docx</span>
              <span>•</span>
              <span className="font-mono text-purple-500">.pdf</span>
            </div>

            {document && (
              <button
                onClick={() => setDocument(null)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                + New Document
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* If no document has been generated yet, show the hero & input form */}
        {!document ? (
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Hero Banner */}
            <div className="text-center space-y-3 pt-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Next-Gen Academic Productivity Suite</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Forge Publication-Grade Presentations, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  Lab Reports &amp; University Assignments
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Turn topics, experiment notes, and code snippets into fully-structured slide decks (.pptx), formatted Word docs (.docx) with formal university cover pages, and embedded Mermaid system diagrams.
              </p>
            </div>

            {/* Input Form Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
              <UnifiedInputForm
                onGenerate={handleGenerate}
                isLoading={isLoading}
                selectedThemeId={selectedThemeId}
                onThemeSelect={setSelectedThemeId}
              />
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm space-y-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Presentation className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Editable PowerPoint (.pptx)</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Generates 16:9 presentation decks with title slides, bullet hierarchies, speaker notes, and embedded vector diagrams via pptxgenjs.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Formal Word (.docx) Reports</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Complete with institutional headers, student signature blocks, styled data tables, formatted code blocks, and diagrams.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Workflow className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Live Mermaid Diagram Engine</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Compiles Mermaid.js syntax into SVG, converts to high-res PNG canvas in real-time, and embeds directly into exported files.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* If document is generated, show the Live Interactive Editor & Preview Workspace */
          <div className="space-y-6">
            {/* Optional Status Banner */}
            {apiNotice && (
              <div className="no-print p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-between text-xs text-indigo-800 dark:text-indigo-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{apiNotice}</span>
                </div>
                <span className="text-[10px] text-indigo-500 font-semibold uppercase">
                  Ready for export
                </span>
              </div>
            )}

            {/* Top Export Toolbar */}
            <ExportToolbar
              document={document}
              theme={activeTheme}
              cachedDiagramPng={cachedDiagramPng}
              onThemeChange={setSelectedThemeId}
              onReset={() => setDocument(null)}
            />

            {/* Main Workspace Preview Switcher */}
            {document.mode === 'presentation' && document.slides ? (
              <div className="space-y-8">
                {/* 16:9 Presentation Viewer */}
                <PresentationViewer
                  slides={document.slides}
                  theme={activeTheme}
                  title={document.title}
                  courseCode={document.metadata.courseCode}
                  onUpdateSlide={handleUpdateSlide}
                  onAddSlide={handleAddSlide}
                />

                {/* Additional Information / References below deck */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Presentation Syllabus &amp; Research Citations
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    {document.executiveSummary}
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                    {document.references.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              /* Lab Report or Assignment Paginated Document View */
              <DocumentViewer
                document={document}
                theme={activeTheme}
                onUpdateSection={handleUpdateSection}
                onUpdatePrimaryDiagram={handleUpdatePrimaryDiagram}
                onPngReady={setCachedDiagramPng}
              />
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          ScholarForge AI • Senior Full-Stack Academic Architecture • Built with Next.js 14, Mermaid, pptxgenjs, docx &amp; Google Gemini
        </p>
      </footer>
    </main>
  );
}
