import { EXPERIENCES } from '../../data/portfolio';
import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react';

export function Experience() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 cyber-glass rounded-xl border border-cyan-500/30 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-mono text-cyan-300">SERVICE RECORD // EXPERIENCE</h2>
            <p className="text-xs font-mono text-slate-400">CHRONOLOGICAL ENGINEERING TIMELINE</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          ACTIVE DEPLOYMENT
        </div>
      </div>

      {/* Experience Timeline */}
      <div className="space-y-6">
        {EXPERIENCES.map((exp) => (
          <div
            key={exp.id}
            className="relative pl-6 md:pl-8 border-l-2 border-cyan-500/40 pb-4"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#040711] border-2 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.8)]" />

            <div className="p-5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                    {exp.role}
                  </h3>
                  <p className="text-sm font-mono text-cyan-400">{exp.organization}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  {exp.duration}
                </div>
              </div>

              <p className="font-mono text-sm text-slate-300 mb-4 leading-relaxed">
                {exp.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2 mb-4">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Key Technical Achievements:
                </div>
                {exp.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 font-mono text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800">
                {exp.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-mono px-2.5 py-1 rounded bg-cyan-950/50 border border-cyan-500/30 text-cyan-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
