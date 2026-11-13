import { useState } from 'react';
import { PROJECTS } from '../../data/portfolio';
import { FolderGit2, CheckCircle, Layers } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

export function Projects() {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'architecture'>('overview');
  const project = PROJECTS[0]; // eAshaOP

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 cyber-glass rounded-xl border border-cyan-500/30 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-400">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-mono text-cyan-300">FEATURED MISSION // PROJECTS</h2>
            <p className="text-xs font-mono text-slate-400">PRODUCTION ENTERPRISE DEPLOYMENTS</p>
          </div>
        </div>
        <span className="font-mono text-xs px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
          FLAGSHIP SYSTEM
        </span>
      </div>

      {/* Main Project Card */}
      <div className="p-5 md:p-6 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl space-y-6">
        {/* Title & Metadata */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-2xl font-bold font-mono text-white tracking-wider">
                {project.title}
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {project.period}
              </span>
            </div>
            <p className="text-cyan-400 font-mono text-sm mt-1">{project.subtitle}</p>
            <p className="text-slate-400 font-mono text-xs mt-0.5">Role: {project.role}</p>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFX.playClick()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-slate-200 transition-colors"
              >
                <svg className="w-4 h-4 fill-cyan-400" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Repository</span>
              </a>
            )}
          </div>
        </div>

        {/* Project KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {project.metrics.map((m) => (
            <div key={m.label} className="p-3 rounded-lg bg-slate-950/80 border border-cyan-500/20 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">{m.label}</div>
              <div className="text-base font-bold font-mono text-cyan-300 mt-0.5">{m.value}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-800 pb-2 font-mono text-xs">
          <button
            onClick={() => { setActiveTab('overview'); soundFX.playClick(); }}
            className={`px-3 py-1.5 rounded-t transition-colors ${
              activeTab === 'overview'
                ? 'bg-cyan-500/20 border-b-2 border-cyan-400 text-cyan-300 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => { setActiveTab('features'); soundFX.playClick(); }}
            className={`px-3 py-1.5 rounded-t transition-colors ${
              activeTab === 'features'
                ? 'bg-cyan-500/20 border-b-2 border-cyan-400 text-cyan-300 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Key Capabilities
          </button>
          <button
            onClick={() => { setActiveTab('architecture'); soundFX.playClick(); }}
            className={`px-3 py-1.5 rounded-t transition-colors ${
              activeTab === 'architecture'
                ? 'bg-cyan-500/20 border-b-2 border-cyan-400 text-cyan-300 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Backend Architecture
          </button>
        </div>

        {/* Tab Content */}
        <div className="font-mono text-xs min-h-[140px]">
          {activeTab === 'overview' && (
            <div className="space-y-3 text-slate-300 leading-relaxed text-sm">
              <p>{project.overview}</p>
              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs">
                <span className="text-cyan-400 font-bold">Domain Challenge: </span>
                Preventing concurrent double-booking of doctor time slots during peak hours while providing instant schedule confirmation and hospital queue telemetry.
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-2.5">
              {project.keyFeatures.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-2.5">
              {project.backendArchitecture.map((arch, i) => (
                <div key={i} className="flex items-start gap-2.5 text-slate-300">
                  <Layers className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{arch}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tech Stack Chips */}
        <div className="pt-3 border-t border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 mb-2 uppercase">Tech Stack Deployed:</div>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded bg-slate-800 text-cyan-300 font-mono text-xs border border-slate-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
