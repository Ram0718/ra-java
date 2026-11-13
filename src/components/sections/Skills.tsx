import { useState } from 'react';
import { SKILL_CATEGORIES } from '../../data/portfolio';
import { soundFX } from '../../utils/soundEffects';
import { Cpu, ChevronRight } from 'lucide-react';

export function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 cyber-glass rounded-xl border border-cyan-500/30 text-slate-200">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-mono text-cyan-300">SYSTEM CAPABILITIES // SKILLS</h2>
            <p className="text-xs font-mono text-slate-400">TECHNICAL ARSENAL &amp; FRAMEWORK MASTERY</p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 font-mono text-xs">
        {SKILL_CATEGORIES.map((cat, idx) => (
          <button
            key={cat.title}
            onClick={() => {
              setSelectedCategory(idx);
              soundFX.playClick();
            }}
            className={`px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
              selectedCategory === idx
                ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${selectedCategory === idx ? 'bg-cyan-400' : 'bg-slate-600'}`} />
            {cat.title}
          </button>
        ))}
      </div>

      {/* Active Category Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-cyan-400" />
          {SKILL_CATEGORIES[selectedCategory].title}
        </h3>
        <p className="text-xs font-mono text-slate-400 ml-6">
          {SKILL_CATEGORIES[selectedCategory].subtitle}
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SKILL_CATEGORIES[selectedCategory].skills.map((skill) => (
          <div
            key={skill.name}
            className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-bold text-sm text-slate-200 group-hover:text-cyan-300 transition-colors">
                {skill.name}
              </span>
              <span className="font-mono text-xs font-bold text-cyan-400">
                {skill.level}%
              </span>
            </div>

            {/* Futuristic Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden p-[1px]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-300 transition-all duration-700 shadow-[0_0_8px_rgba(0,240,255,0.6)]"
                style={{ width: `${skill.level}%` }}
              />
            </div>

            <p className="font-mono text-xs text-slate-400 leading-relaxed">
              {skill.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
