'use client';

import React, { useState } from 'react';
import { SlideItem, VisualTheme } from '@/types';
import { MermaidRenderer } from './MermaidRenderer';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
  Edit3,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';

interface PresentationViewerProps {
  slides: SlideItem[];
  theme: VisualTheme;
  title: string;
  courseCode?: string;
  onUpdateSlide?: (slideIndex: number, updatedSlide: SlideItem) => void;
  onAddSlide?: () => void;
  onDeleteSlide?: (slideIndex: number) => void;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({
  slides,
  theme,
  title,
  courseCode,
  onUpdateSlide,
  onAddSlide,
  onDeleteSlide,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!slides || slides.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p>No slides found in the current presentation deck.</p>
      </div>
    );
  }

  const activeSlide = slides[currentSlideIndex] || slides[0];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  const handleBulletChange = (idx: number, newVal: string) => {
    if (!onUpdateSlide) return;
    const newBullets = [...activeSlide.bullets];
    newBullets[idx] = newVal;
    onUpdateSlide(currentSlideIndex, { ...activeSlide, bullets: newBullets });
  };

  const handleAddBullet = () => {
    if (!onUpdateSlide) return;
    const newBullets = [...activeSlide.bullets, 'New academic key point'];
    onUpdateSlide(currentSlideIndex, { ...activeSlide, bullets: newBullets });
  };

  const handleDeleteBullet = (idx: number) => {
    if (!onUpdateSlide) return;
    const newBullets = activeSlide.bullets.filter((_, i) => i !== idx);
    onUpdateSlide(currentSlideIndex, { ...activeSlide, bullets: newBullets });
  };

  return (
    <div
      className={`flex flex-col bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'
      }`}
    >
      {/* Top Deck Navigation Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            Slide {currentSlideIndex + 1} of {slides.length}
          </span>
          <span className="text-xs font-medium text-slate-400 truncate max-w-[200px] sm:max-w-xs">
            {courseCode ? `${courseCode}: ` : ''}{title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onUpdateSlide && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                isEditing
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              {isEditing ? 'Done Editing' : 'Edit Slide'}
            </button>
          )}

          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showNotes ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle Speaker Notes"
          >
            <FileText className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Deck'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main 16:9 Slide Canvas */}
      <div className="relative p-6 sm:p-10 flex-1 flex flex-col justify-center items-center min-h-[420px] bg-slate-950">
        <div
          className="w-full max-w-4xl aspect-[16/9] rounded-xl shadow-2xl p-8 sm:p-12 flex flex-col justify-between border relative overflow-hidden transition-all"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.borderColor,
            color: theme.textColor,
          }}
        >
          {/* Decorative Corner Theme Accent */}
          <div
            className="absolute top-0 right-0 w-32 h-32 opacity-15 rounded-bl-full pointer-events-none"
            style={{ backgroundColor: theme.primary }}
          />

          {/* Slide Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className="w-1.5 h-7 rounded-full"
                style={{ backgroundColor: theme.accent }}
              />
              {isEditing ? (
                <input
                  type="text"
                  value={activeSlide.title}
                  onChange={(e) =>
                    onUpdateSlide?.(currentSlideIndex, { ...activeSlide, title: e.target.value })
                  }
                  className="w-full text-xl sm:text-2xl font-bold bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded border border-indigo-400 text-slate-900 dark:text-slate-100"
                />
              ) : (
                <h3
                  className="text-xl sm:text-2xl font-bold tracking-tight"
                  style={{ color: theme.primary }}
                >
                  {activeSlide.title}
                </h3>
              )}
            </div>

            {activeSlide.subtitle && (
              <p
                className="text-xs sm:text-sm font-medium italic pl-4 mb-4"
                style={{ color: theme.secondary }}
              >
                {activeSlide.subtitle}
              </p>
            )}
          </div>

          {/* Slide Body (Split: Bullets on left, diagram or code on right) */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-4 overflow-y-auto">
            {/* Left: Bullets */}
            <div
              className={`${
                activeSlide.diagramCode || activeSlide.codeSnippet ? 'md:col-span-6' : 'md:col-span-12'
              } space-y-3`}
            >
              <ul className="space-y-2.5">
                {activeSlide.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed">
                    <span
                      className="inline-block w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: theme.accent }}
                    />
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => handleBulletChange(idx, e.target.value)}
                          className="flex-1 bg-white/90 dark:bg-slate-800 px-2 py-1 rounded border border-slate-300 text-xs"
                        />
                        <button
                          onClick={() => handleDeleteBullet(idx)}
                          className="p-1 text-rose-500 hover:bg-rose-100 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-800 dark:text-slate-200">{bullet}</span>
                    )}
                  </li>
                ))}
              </ul>

              {isEditing && (
                <button
                  onClick={handleAddBullet}
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline pt-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Add bullet point
                </button>
              )}

              {/* Callout box if present */}
              {activeSlide.callout && (
                <div
                  className="mt-4 p-3 rounded-lg border text-xs font-medium"
                  style={{
                    backgroundColor: `${theme.primary}10`,
                    borderColor: `${theme.primary}30`,
                    color: theme.primary,
                  }}
                >
                  <span className="font-bold">Key Insight: </span>
                  {activeSlide.callout}
                </div>
              )}
            </div>

            {/* Right: Diagram or Code Snippet */}
            {activeSlide.diagramCode && (
              <div className="md:col-span-6 h-full flex flex-col justify-center">
                <MermaidRenderer
                  code={activeSlide.diagramCode}
                  title={activeSlide.diagramCaption || 'Slide Diagram'}
                  editable={isEditing}
                  onCodeChange={(newCode) =>
                    onUpdateSlide?.(currentSlideIndex, { ...activeSlide, diagramCode: newCode })
                  }
                />
              </div>
            )}

            {!activeSlide.diagramCode && activeSlide.codeSnippet && (
              <div className="md:col-span-6">
                <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 font-mono text-[11px] text-cyan-400 overflow-x-auto shadow-inner">
                  <pre className="whitespace-pre-wrap">{activeSlide.codeSnippet}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Slide Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
            <span>{courseCode || 'ScholarForge AI'}</span>
            <span>Slide {currentSlideIndex + 1}</span>
          </div>
        </div>

        {/* Floating Left/Right Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-800/80 hover:bg-indigo-600 text-white shadow-lg backdrop-blur-sm transition-all"
          title="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-800/80 hover:bg-indigo-600 text-white shadow-lg backdrop-blur-sm transition-all"
          title="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Thumbnails strip */}
      <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2 overflow-x-auto scrollbar-thin">
        {slides.map((s, idx) => (
          <button
            key={s.id || idx}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentSlideIndex === idx
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            {idx + 1}. {s.title.length > 18 ? `${s.title.substring(0, 18)}...` : s.title}
          </button>
        ))}

        {onAddSlide && (
          <button
            onClick={onAddSlide}
            className="flex-shrink-0 p-1.5 rounded-lg border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
            title="Add Slide"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Speaker Notes Drawer */}
      {showNotes && (
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-semibold uppercase text-[10px] tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Speaker Notes (Slide {currentSlideIndex + 1})</span>
          </div>
          {isEditing ? (
            <textarea
              value={activeSlide.speakerNotes || ''}
              onChange={(e) =>
                onUpdateSlide?.(currentSlideIndex, { ...activeSlide, speakerNotes: e.target.value })
              }
              rows={2}
              className="w-full bg-slate-950 text-slate-300 p-2 rounded border border-slate-700 text-xs focus:ring-1 focus:ring-indigo-500"
              placeholder="Add speaker notes for this slide..."
            />
          ) : (
            <p className="text-slate-300 italic">
              {activeSlide.speakerNotes || 'No notes for this slide.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
