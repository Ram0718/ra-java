import React, { useEffect, useState } from 'react';
import { materialApi } from '../api/client';
import type { LearningMaterial } from '../types';
import { FileText, Download, Eye, Clock, ShieldCheck, RefreshCw, X, Sparkles, Printer, Check } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import {
  TOPIC_NOTES,
  generateTopicMarkdown,
  generateTopicPrintableHtml,
  type TopicStudyNote,
} from '../data/topicNotesData';
import { downloadAsMarkdown, printNotesAsPdf } from '../utils/noteDownloader';

export const PdfMaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [previewPdf, setPreviewPdf] = useState<LearningMaterial | null>(null);

  useEffect(() => {
    materialApi.getAll()
      .then((data) => setMaterials(data))
      .catch((err) => {
        console.warn('Backend materialApi.getAll failed, using local catalog:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const findStudyNoteForMaterial = (m: LearningMaterial): TopicStudyNote => {
    const notes = Object.values(TOPIC_NOTES);
    const matched =
      (m.topicSlug ? notes.find(n => n.slug === m.topicSlug) : undefined) ||
      notes.find(n => m.title.toLowerCase().includes(n.slug) || (m.topicTitle && m.topicTitle.toLowerCase().includes(n.title.toLowerCase()))) ||
      notes.find(n => n.moduleTitle.toLowerCase() === m.moduleTitle?.toLowerCase()) ||
      notes[0];
    return matched;
  };

  const handleDownloadMarkdown = (m: LearningMaterial) => {
    materialApi.registerDownload(m.id).catch(() => {});
    const note = findStudyNoteForMaterial(m);
    downloadAsMarkdown(`${note.slug}-placement-handbook`, generateTopicMarkdown(note));
  };

  const handlePrintPdf = (m: LearningMaterial) => {
    materialApi.registerDownload(m.id).catch(() => {});
    const note = findStudyNoteForMaterial(m);
    printNotesAsPdf(m.title, generateTopicPrintableHtml(note));
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] py-12 sm:py-16 antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
            Curriculum Reference Vault
          </span>
          <h1 className="text-2xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
            Official Study Handbooks &amp; Notes
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6E73] max-w-xl">
            Placement-grade study guides covering core architecture, high-frequency interview questions, annotated code examples, and critical anti-patterns.
          </p>
        </div>

        {/* Structured Inset Grouped Table (Responsive: Cards on Mobile, Table on Tablet/Desktop) */}
        {loading && materials.length === 0 ? (
          <div className="py-24 text-center text-xs text-[#86868B] space-y-2">
            <RefreshCw className="w-5 h-5 text-[#0071E3] animate-spin mx-auto" />
            <span>Cataloging educational assets...</span>
          </div>
        ) : (
          <>
            {/* Mobile Card Layout (< sm) */}
            <div className="sm:hidden space-y-3">
              {(materials.length > 0 ? materials : Object.values(TOPIC_NOTES).map(n => ({
                id: n.id,
                title: `${n.title} Handbook`,
                topicTitle: n.title,
                topicSlug: n.slug,
                moduleTitle: n.moduleTitle,
                pdfUrl: `/materials/${n.slug}.pdf`,
                fileSizeBytes: 2400000,
                version: 1,
                downloadCount: 42,
                uploadedAt: new Date().toISOString()
              }))).map((m) => (
                <div key={m.id} className="apple-card p-4 bg-white shadow-apple-card space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="text-sm font-semibold text-[#1D1D1F] flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#FF3B30] flex-shrink-0" />
                        <span className="leading-snug">{m.title}</span>
                      </div>
                      <p className="text-xs text-[#86868B]">{m.topicTitle} • {m.moduleTitle}</p>
                    </div>
                    <span className="font-mono text-[10px] bg-[#F5F5F7] px-2 py-0.5 rounded border border-[#E5E5EA] text-[#6E6E73] flex-shrink-0">
                      MD / PDF
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5E5EA]">
                    <button
                      onClick={() => setPreviewPdf(m)}
                      className="inline-flex items-center justify-center gap-1 bg-[#F5F5F7] active:bg-[#E8E8ED] text-[#1D1D1F] text-xs font-medium py-2 px-2 rounded-xl border border-[#E5E5EA]"
                      title="Quick Preview"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#6E6E73]" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => handleDownloadMarkdown(m)}
                      className="inline-flex items-center justify-center gap-1 bg-[#F5F5F7] active:bg-[#E8E8ED] text-[#1D1D1F] text-xs font-medium py-2 px-2 rounded-xl border border-[#D2D2D7]"
                      title="Download Markdown (.md)"
                    >
                      <Download className="w-3.5 h-3.5 text-[#0071E3]" />
                      <span>.MD</span>
                    </button>
                    <button
                      onClick={() => handlePrintPdf(m)}
                      className="inline-flex items-center justify-center gap-1 bg-[#0071E3] active:bg-[#0062C4] text-white text-xs font-medium py-2 px-2 rounded-xl shadow-apple-sm"
                      title="Print / Save as PDF"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop & Tablet Inset Grouped Table (>= sm) */}
            <div className="hidden sm:block apple-inset-group shadow-apple-card bg-white">
              <div className="grid grid-cols-12 px-6 py-3 bg-[#F5F5F7] border-b border-[#E5E5EA] text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">
                <div className="col-span-6 md:col-span-5">Guide Specification</div>
                <div className="hidden md:block md:col-span-3">Module Context</div>
                <div className="col-span-2 text-center hidden sm:block">Format</div>
                <div className="col-span-6 md:col-span-2 text-right">Actions</div>
              </div>

              <div className="divide-y divide-[#E5E5EA]">
                {(materials.length > 0 ? materials : Object.values(TOPIC_NOTES).map(n => ({
                  id: n.id,
                  title: `${n.title} Handbook`,
                  topicTitle: n.title,
                  topicSlug: n.slug,
                  moduleTitle: n.moduleTitle,
                  pdfUrl: `/materials/${n.slug}.pdf`,
                  fileSizeBytes: 2400000,
                  version: 1,
                  downloadCount: 42,
                  uploadedAt: new Date().toISOString()
                }))).map((m) => (
                  <div
                    key={m.id}
                    className="grid grid-cols-12 px-6 py-4 items-center hover:bg-[#F5F5F7]/80 transition-colors"
                  >
                    <div className="col-span-6 md:col-span-5 pr-3">
                      <div className="text-sm font-semibold text-[#1D1D1F] truncate flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#FF3B30] flex-shrink-0" />
                        <span className="truncate">{m.title}</span>
                      </div>
                      <span className="text-xs text-[#86868B] block mt-0.5">
                        {m.topicTitle}
                      </span>
                    </div>

                    <div className="hidden md:block md:col-span-3 text-xs text-[#6E6E73] truncate pr-2">
                      {m.moduleTitle}
                    </div>

                    <div className="col-span-2 text-center text-xs text-[#86868B] hidden sm:block">
                      <span className="font-mono text-[11px] bg-[#F5F5F7] px-2 py-0.5 rounded border border-[#E5E5EA]">
                        MD / PDF
                      </span>
                    </div>

                    <div className="col-span-6 md:col-span-2 flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewPdf(m)}
                        className="p-1.5 text-[#6E6E73] hover:text-[#0071E3] hover:bg-[#E8F2FD] rounded-full transition-colors"
                        title="Quick Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDownloadMarkdown(m)}
                        className="inline-flex items-center gap-1 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] text-xs font-medium px-2.5 py-1.5 rounded-full transition-all"
                        title="Download Markdown (.md)"
                      >
                        <Download className="w-3 h-3 text-[#0071E3]" />
                        <span>MD</span>
                      </button>

                      <button
                        onClick={() => handlePrintPdf(m)}
                        className="inline-flex items-center gap-1 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-apple-sm transition-all"
                        title="Print / Save as PDF"
                      >
                        <Printer className="w-3 h-3" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Apple Style Document Preview Modal */}
        {previewPdf && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white/95 backdrop-blur-2xl border border-[#E5E5EA] max-w-lg w-full p-6 sm:p-8 rounded-2xl shadow-apple-modal animate-in zoom-in-95 duration-200 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EA]">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#FF3B30]" />
                  <span className="text-sm font-semibold text-[#1D1D1F]">{previewPdf.title}</span>
                </div>
                <button
                  onClick={() => setPreviewPdf(null)}
                  className="p-1 text-[#86868B] hover:text-[#1D1D1F] rounded-full hover:bg-[#F5F5F7] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl text-center space-y-3">
                <p className="text-base font-semibold text-[#1D1D1F]">{previewPdf.title}</p>
                <p className="text-xs text-[#6E6E73]">
                  Module: {previewPdf.moduleTitle} • Topic: {previewPdf.topicTitle}
                </p>
                <p className="text-xs text-[#86868B] leading-relaxed">
                  {findStudyNoteForMaterial(previewPdf)?.overview || 'Comprehensive reference guide containing interview Q&A and line-by-line commented Java code.'}
                </p>
                <div className="pt-3 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      handleDownloadMarkdown(previewPdf);
                      setPreviewPdf(null);
                    }}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] border border-[#D2D2D7] font-medium text-xs py-2 px-4 rounded-full shadow-apple-sm transition-all"
                  >
                    <Download className="w-4 h-4 text-[#0071E3]" />
                    <span>Download Markdown</span>
                  </button>
                  <button
                    onClick={() => {
                      handlePrintPdf(previewPdf);
                      setPreviewPdf(null);
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs py-2 px-5 rounded-full shadow-apple-sm transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Save as PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
