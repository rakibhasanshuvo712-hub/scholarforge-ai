'use client';

import React from 'react';
import { CoverPageMetadata, VisualTheme } from '@/types';
import { GraduationCap, User, Calendar, Award } from 'lucide-react';

interface UniversityCoverPageProps {
  metadata: CoverPageMetadata;
  title: string;
  subtitle?: string;
  mode: 'presentation' | 'lab_report' | 'assignment';
  theme: VisualTheme;
}

export const UniversityCoverPage: React.FC<UniversityCoverPageProps> = ({
  metadata,
  title,
  subtitle,
  mode,
  theme,
}) => {
  const modeLabel =
    mode === 'lab_report'
      ? 'LABORATORY INVESTIGATION REPORT'
      : mode === 'presentation'
      ? 'SYMPOSIUM PRESENTATION REPORT'
      : 'ACADEMIC COURSEWORK ASSIGNMENT';

  return (
    <div
      className="p-8 sm:p-12 border-4 rounded-xl shadow-md bg-white text-slate-900 transition-all font-serif relative overflow-hidden"
      style={{ borderColor: theme.primary }}
    >
      {/* Decorative corner accents */}
      <div
        className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2"
        style={{ borderColor: theme.accent }}
      />
      <div
        className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2"
        style={{ borderColor: theme.accent }}
      />
      <div
        className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2"
        style={{ borderColor: theme.accent }}
      />
      <div
        className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2"
        style={{ borderColor: theme.accent }}
      />

      {/* Institution Emblem / Header */}
      <div className="text-center space-y-2 pb-6 border-b border-slate-200">
        <div className="inline-flex p-3 rounded-full bg-slate-50 border border-slate-200 shadow-inner">
          <GraduationCap className="w-8 h-8" style={{ color: theme.primary }} />
        </div>
        <h1
          className="text-xl sm:text-2xl font-bold tracking-wider uppercase"
          style={{ color: theme.primary }}
        >
          {metadata.institution || 'ACADEMIC UNIVERSITY & FACULTY'}
        </h1>
        <p className="text-xs sm:text-sm uppercase tracking-widest text-slate-500 font-sans font-medium">
          DEPARTMENT OF {metadata.department || 'COMPUTER SCIENCE & ENGINEERING'}
        </p>
      </div>

      {/* Course Info */}
      <div className="text-center my-6">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-sans font-semibold tracking-wide"
          style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
        >
          {metadata.courseCode} — {metadata.courseTitle}
        </span>
      </div>

      {/* Title & Mode */}
      <div className="text-center my-8 space-y-3">
        <div
          className="text-xs font-sans font-bold tracking-widest uppercase"
          style={{ color: theme.accent }}
        >
          [ {modeLabel} ]
        </div>
        <h2
          className="text-2xl sm:text-3xl font-extrabold leading-snug"
          style={{ color: theme.primary }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base italic text-slate-600 font-normal max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Metadata Dual-Column Card */}
      <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm font-sans">
        {/* Left: Submitted By */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] text-slate-700 tracking-wider">
            <User className="w-3.5 h-3.5" style={{ color: theme.primary }} />
            <span>Submitted By</span>
          </div>
          <div className="space-y-1">
            <p className="text-slate-900 font-semibold text-sm">{metadata.studentName}</p>
            <p className="text-slate-600">
              <span className="font-medium text-slate-500">ID:</span> {metadata.studentId}
            </p>
            <p className="text-slate-600">
              <span className="font-medium text-slate-500">Dept:</span> {metadata.department}
            </p>
          </div>
        </div>

        {/* Right: Submitted To */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] text-slate-700 tracking-wider">
            <Award className="w-3.5 h-3.5" style={{ color: theme.primary }} />
            <span>Submitted To</span>
          </div>
          <div className="space-y-1">
            <p className="text-slate-900 font-semibold text-sm">{metadata.instructorName}</p>
            <p className="text-slate-600">
              <span className="font-medium text-slate-500">Course:</span> {metadata.courseCode}
            </p>
            <p className="text-slate-600 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{metadata.submissionDate}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Formal Signature Line */}
      <div className="mt-12 pt-8 flex justify-between items-end text-[11px] text-slate-400 font-sans border-t border-dashed border-slate-200">
        <div>
          <div className="w-32 border-b border-slate-400 mb-1" />
          <span>Student Signature</span>
        </div>
        <div className="text-right">
          <div className="w-32 border-b border-slate-400 mb-1 ml-auto" />
          <span>Faculty Endorsement</span>
        </div>
      </div>
    </div>
  );
};
