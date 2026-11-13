'use client';

import React, { useState } from 'react';
import { AcademicMode, CoverPageMetadata, ThemeId } from '@/types';
import { THEMES } from '@/types/themes';
import {
  Sparkles,
  Presentation,
  FlaskConical,
  FileCheck,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Key,
  Sliders,
  Code,
  Layers,
  Wand2,
} from 'lucide-react';

interface UnifiedInputFormProps {
  onGenerate: (data: {
    mode: AcademicMode;
    title: string;
    description: string;
    metadata: CoverPageMetadata;
    codeSnippet?: string;
    count: number;
    themeId: ThemeId;
    apiKey?: string;
  }) => void;
  isLoading: boolean;
  selectedThemeId: ThemeId;
  onThemeSelect: (themeId: ThemeId) => void;
}

const PRESET_TEMPLATES = [
  {
    mode: 'lab_report' as AcademicMode,
    label: 'Distributed Consensus Lab',
    title: 'Benchmarking Quorum State Replication Under Simulated Network Latency',
    courseCode: 'CS455',
    courseTitle: 'Distributed Systems & Cloud Infrastructure',
    description: 'Design and evaluate a fault-tolerant state machine using leader-election quorum consensus. Measure write throughput and commit latency during 33% node loss and packet loss injection.',
    codeSnippet: `// Leader Election & AppendEntries RPC Heartbeat
async function executeHeartbeat(term: number, matchIndex: number) {
  const payload = { term, leaderId: 'node-alpha', prevLogIndex: matchIndex };
  return Promise.all(peers.map(p => p.sendAppendEntries(payload)));
}`,
  },
  {
    mode: 'presentation' as AcademicMode,
    label: 'Quantum Cryptography Slides',
    title: 'Quantum Key Distribution & BB84 Protocol Foundations',
    courseCode: 'PHYS320',
    courseTitle: 'Quantum Information & Modern Cryptography',
    description: 'An executive presentation analyzing photon polarization states, Heisenberg uncertainty bounds, eavesdropper detection with quantum bit error rate (QBER), and one-time pad secrecy.',
    codeSnippet: `// Qubit Bell State Entanglement Simulation
const bellPhiPlus = (|00> + |11>) / Math.sqrt(2);
console.log('Entangled pair generated with zero local realism.');`,
  },
  {
    mode: 'assignment' as AcademicMode,
    label: 'Database Normalization Assignment',
    title: 'Relational Decomposition & Boyce-Codd Normal Form (BCNF) Analysis',
    courseCode: 'CS310',
    courseTitle: 'Relational Database Management Systems',
    description: 'Formal deconstruction of multi-valued dependencies, loss-less join proofs, dependency preservation trade-offs, and synthesis of 3NF into canonical BCNF schemas.',
    codeSnippet: `CREATE TABLE CourseCatalog (
  course_id VARCHAR(10) PRIMARY KEY,
  instructor_id VARCHAR(10) REFERENCES Instructors(id),
  dept_code VARCHAR(5) NOT NULL
);`,
  },
];

export const UnifiedInputForm: React.FC<UnifiedInputFormProps> = ({
  onGenerate,
  isLoading,
  selectedThemeId,
  onThemeSelect,
}) => {
  const [mode, setMode] = useState<AcademicMode>('lab_report');
  const [title, setTitle] = useState<string>('Benchmarking Quorum State Replication Under Simulated Network Latency');
  const [description, setDescription] = useState<string>(
    'Design and evaluate a fault-tolerant state machine using leader-election quorum consensus. Measure write throughput and commit latency during 33% node loss and packet loss injection.'
  );
  const [codeSnippet, setCodeSnippet] = useState<string>(
    `// Leader Election & AppendEntries RPC Heartbeat
async function executeHeartbeat(term: number, matchIndex: number) {
  const payload = { term, leaderId: 'node-alpha', prevLogIndex: matchIndex };
  return Promise.all(peers.map(p => p.sendAppendEntries(payload)));
}`
  );
  const [count, setCount] = useState<number>(6);
  const [showMetadata, setShowMetadata] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');

  const [metadata, setMetadata] = useState<CoverPageMetadata>({
    studentName: 'Alexander Vance',
    studentId: 'STU-2024-8842',
    department: 'Computer Science & Engineering',
    institution: 'Stanford University Faculty of Computing',
    courseCode: 'CS455',
    courseTitle: 'Distributed Systems & Cloud Infrastructure',
    instructorName: 'Prof. Margaret Hamilton',
    submissionDate: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  });

  const handleMetadataChange = (key: keyof CoverPageMetadata, val: string) => {
    setMetadata((prev) => ({ ...prev, [key]: val }));
  };

  const handleSelectPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
    setMode(preset.mode);
    setTitle(preset.title);
    setDescription(preset.description);
    setCodeSnippet(preset.codeSnippet);
    setMetadata((prev) => ({
      ...prev,
      courseCode: preset.courseCode,
      courseTitle: preset.courseTitle,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      mode,
      title,
      description,
      metadata,
      codeSnippet: codeSnippet.trim() ? codeSnippet : undefined,
      count,
      themeId: selectedThemeId,
      apiKey: apiKey.trim() ? apiKey.trim() : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Mode Selector Banner */}
      <div className="space-y-2">
        <label className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
          Academic Document Type
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setMode('presentation')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
              mode === 'presentation'
                ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Presentation className="w-5 h-5 mb-1" />
            <span className="text-xs font-bold">Slides (.pptx)</span>
            <span className="text-[10px] text-slate-400">Presentation Deck</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('lab_report')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
              mode === 'lab_report'
                ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <FlaskConical className="w-5 h-5 mb-1" />
            <span className="text-xs font-bold">Lab Report</span>
            <span className="text-[10px] text-slate-400">Formal Tech Paper</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('assignment')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
              mode === 'assignment'
                ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <FileCheck className="w-5 h-5 mb-1" />
            <span className="text-xs font-bold">Assignment</span>
            <span className="text-[10px] text-slate-400">Problem & Proofs</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Fill Buttons */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
          <Wand2 className="w-3 h-3 text-indigo-500" /> Quick-fill Sample Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_TEMPLATES.map((tpl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectPreset(tpl)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 text-slate-700 dark:text-slate-300 font-medium transition-colors border border-slate-200 dark:border-slate-700"
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Topic & Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Document Title / Experiment Topic <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Distributed Consensus in Cloud Computing"
          className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* 3. Description / Objectives / Instructions */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Objectives, Hypotheses or Assignment Prompts
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the investigation requirements, key algorithms, test parameters, or presentation scope..."
          className="w-full text-xs leading-relaxed px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm resize-y"
        />
      </div>

      {/* 4. University Cover Page Metadata Accordion */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/60 dark:bg-slate-900/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowMetadata(!showMetadata)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              University Cover Page Metadata
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
              {metadata.studentName} • {metadata.courseCode}
            </span>
            {showMetadata ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {showMetadata && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Student Full Name
              </label>
              <input
                type="text"
                value={metadata.studentName}
                onChange={(e) => handleMetadataChange('studentName', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Student ID / Roll No
              </label>
              <input
                type="text"
                value={metadata.studentId}
                onChange={(e) => handleMetadataChange('studentId', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Institution / University
              </label>
              <input
                type="text"
                value={metadata.institution}
                onChange={(e) => handleMetadataChange('institution', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Academic Department
              </label>
              <input
                type="text"
                value={metadata.department}
                onChange={(e) => handleMetadataChange('department', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Course Code & Title
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <input
                  type="text"
                  placeholder="CS455"
                  value={metadata.courseCode}
                  onChange={(e) => handleMetadataChange('courseCode', e.target.value)}
                  className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono"
                />
                <input
                  type="text"
                  placeholder="Course Title"
                  value={metadata.courseTitle}
                  onChange={(e) => handleMetadataChange('courseTitle', e.target.value)}
                  className="col-span-2 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Faculty / Instructor Name
              </label>
              <input
                type="text"
                value={metadata.instructorName}
                onChange={(e) => handleMetadataChange('instructorName', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Date of Submission
              </label>
              <input
                type="text"
                value={metadata.submissionDate}
                onChange={(e) => handleMetadataChange('submissionDate', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. Optional Code Snippet Drawer */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-indigo-500" /> Source Code Snippet (Optional)
          </span>
          <span className="text-[10px] text-slate-400">Embedded in exports</span>
        </label>
        <textarea
          rows={3}
          value={codeSnippet}
          onChange={(e) => setCodeSnippet(e.target.value)}
          placeholder="// Paste Python, TypeScript, C++, or SQL snippet..."
          className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-950 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* 6. Settings Row: Item Count & Theme Picker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Count Slider */}
        <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              {mode === 'presentation' ? 'Slide Deck Size' : 'Section Depth'}
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[11px]">
              {count} {mode === 'presentation' ? 'slides' : 'sections'}
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={10}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Visual Theme Selector */}
        <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" /> Visual Theme
            </span>
            <div
              className="w-3 h-3 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: THEMES[selectedThemeId].primary }}
            />
          </div>
          <select
            value={selectedThemeId}
            onChange={(e) => onThemeSelect(e.target.value as ThemeId)}
            className="w-full text-xs font-medium px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
          >
            {Object.values(THEMES).map((th) => (
              <option key={th.id} value={th.id}>
                {th.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 7. Gemini API Key Setting (Optional) */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowApiKey(!showApiKey)}
          className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1 transition-colors"
        >
          <Key className="w-3.5 h-3.5" />
          <span>{apiKey ? 'Custom Gemini Key Configured' : 'Configure Custom Gemini API Key (Optional)'}</span>
        </button>

        {showApiKey && (
          <div className="mt-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Google Gemini API Key
              </label>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full font-medium">
                Offline engine ready if omitted
              </span>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
            />
            <p className="text-[10px] text-slate-500">
              ScholarForge AI features a built-in offline academic template generator, so you can test all exports and diagram features without an API key!
            </p>
          </div>
        )}
      </div>

      {/* 8. Generate Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:via-indigo-600 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Generating Publication-Grade Academic Artifacts...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Generate {mode === 'presentation' ? 'Presentation' : mode === 'lab_report' ? 'Lab Report' : 'Assignment'} with Diagrams</span>
          </>
        )}
      </button>
    </form>
  );
};
