'use client';

import React, { useState } from 'react';
import { GeneratedDocument, VisualTheme, ThemeId } from '@/types';
import { THEMES } from '@/types/themes';
import { exportToPptx } from '@/utils/pptxExporter';
import { exportToDocx } from '@/utils/docxExporter';
import {
  Printer,
  Palette,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';

interface ExportToolbarProps {
  document: GeneratedDocument;
  theme: VisualTheme;
  cachedDiagramPng?: string;
  onThemeChange: (themeId: ThemeId) => void;
  onReset: () => void;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({
  document: doc,
  theme,
  cachedDiagramPng,
  onThemeChange,
  onReset,
}) => {
  const [isExportingPptx, setIsExportingPptx] = useState<boolean>(false);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportPptx = async () => {
    try {
      setIsExportingPptx(true);
      await exportToPptx(doc, theme, cachedDiagramPng);
      showToast('PPTX presentation deck exported successfully!');
    } catch (err: any) {
      console.error('PPTX export error:', err);
      alert(`PPTX Export Error: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsExportingPptx(false);
    }
  };

  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      await exportToDocx(doc, theme, cachedDiagramPng);
      showToast('DOCX Word document with Cover Page exported successfully!');
    } catch (err: any) {
      console.error('DOCX export error:', err);
      alert(`DOCX Export Error: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="no-print sticky top-4 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-3 sm:p-4 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Mode Badge & Quick Title */}
        <div className="flex items-center gap-2">
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: theme.primary }}
          >
            {doc.mode === 'presentation'
              ? 'Presentation'
              : doc.mode === 'lab_report'
              ? 'Lab Report'
              : 'Assignment'}
          </span>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs">
            {doc.title}
          </span>
        </div>

        {/* Center: Theme Selector */}
        <div className="flex items-center gap-2 text-xs">
          <Palette className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 hidden sm:inline">Theme:</span>
          <select
            value={theme.id}
            onChange={(e) => onThemeChange(e.target.value as ThemeId)}
            className="text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
          >
            {Object.values(THEMES).map((th) => (
              <option key={th.id} value={th.id}>
                {th.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Export Buttons */}
        <div className="flex items-center gap-2">
          {/* PPTX Export Button */}
          <button
            onClick={handleExportPptx}
            disabled={isExportingPptx}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-sm transition-all disabled:opacity-50"
            title="Download editable PowerPoint deck (.pptx)"
          >
            {isExportingPptx ? (
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="font-extrabold text-[10px] bg-white/20 px-1 rounded">PPTX</span>
            )}
            <span>Export Slides</span>
          </button>

          {/* DOCX Export Button */}
          <button
            onClick={handleExportDocx}
            disabled={isExportingDocx}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 shadow-sm transition-all disabled:opacity-50"
            title="Download formatted Word document with cover page (.docx)"
          >
            {isExportingDocx ? (
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="font-extrabold text-[10px] bg-white/20 px-1 rounded">DOCX</span>
            )}
            <span>Export Word</span>
          </button>

          {/* PDF / Print Button */}
          <button
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-300 dark:border-slate-700"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>PDF / Print</span>
          </button>

          {/* Reset / New Document */}
          <button
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            title="Create New Academic Document"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-900 text-emerald-100 px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
