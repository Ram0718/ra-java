import { DEVELOPER_PROFILE } from '../../data/portfolio';
import { User, Server, Database, Code, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function About() {
  const { profilePhoto } = useTheme();
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 cyber-glass rounded-xl border border-cyan-500/30 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-mono text-cyan-300">SYSTEM DOSSIER // ABOUT</h2>
            <p className="text-xs font-mono text-slate-400">PROFILE OVERVIEW &amp; CORE COMPETENCY</p>
          </div>
        </div>
        <div className="text-right hidden sm:block font-mono text-xs text-emerald-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
          AVAILABLE FOR HIRE
        </div>
      </div>

      {/* Main Bio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 space-y-4 font-mono text-sm leading-relaxed text-slate-300">
          <p className="border-l-2 border-cyan-400 pl-3">
            Hello! I'm <strong className="text-white">{DEVELOPER_PROFILE.name}</strong>, a dedicated{' '}
            <strong className="text-cyan-300">Java Developer</strong> with{' '}
            <strong className="text-emerald-400">{DEVELOPER_PROFILE.experienceYears} years</strong> of professional engineering experience.
          </p>
          <p>
            My passion lies in backend systems architecture — designing scalable RESTful microservices,
            tuning high-throughput MySQL databases, enforcing enterprise security via Spring Security &amp; JWT,
            and wiring performant client experiences with React.
          </p>
          <p>
            I am the developer behind <strong className="text-cyan-300">eAshaOP</strong>, a production-grade online healthcare and
            doctor appointment platform that automates OPD queues and patient medical management.
          </p>
        </div>

        {/* Quick Spec Card */}
        <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-700/80 font-mono text-xs space-y-3">
          {profilePhoto && (
            <div className="w-full aspect-[16/10] rounded-lg overflow-hidden border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.2)] mb-2">
              <img
                src={profilePhoto}
                alt="Rambabu"
                className="w-full h-full object-cover object-[46%_25%]"
              />
            </div>
          )}
          <div className="text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700 pb-1">
            Engine Specs
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Role:</span>
            <span className="text-cyan-300 font-semibold">{DEVELOPER_PROFILE.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Experience:</span>
            <span className="text-emerald-400 font-semibold">{DEVELOPER_PROFILE.experienceYears} Years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Primary:</span>
            <span className="text-purple-300 font-semibold">Java 17 / 21</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Framework:</span>
            <span className="text-emerald-300 font-semibold">Spring Boot 3</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Database:</span>
            <span className="text-blue-300 font-semibold">MySQL</span>
          </div>
        </div>
      </div>

      {/* Engineering Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 rounded-lg bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-400/50 transition-colors">
          <Server className="w-5 h-5 text-cyan-400 mb-2" />
          <h4 className="font-bold text-white text-sm">Robust APIs</h4>
          <p className="text-slate-400 mt-1">RESTful endpoints with standard HTTP contracts, pagination, and error handlers.</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/60 border border-emerald-500/20 hover:border-emerald-400/50 transition-colors">
          <Database className="w-5 h-5 text-emerald-400 mb-2" />
          <h4 className="font-bold text-white text-sm">Data Integrity</h4>
          <p className="text-slate-400 mt-1">ACID transactions, indexed schemas, and JPA/Hibernate mapping optimization.</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/60 border border-purple-500/20 hover:border-purple-400/50 transition-colors">
          <ShieldCheck className="w-5 h-5 text-purple-400 mb-2" />
          <h4 className="font-bold text-white text-sm">Security First</h4>
          <p className="text-slate-400 mt-1">Stateless JWT authentication and granular Role-Based Access Controls.</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/60 border border-amber-500/20 hover:border-amber-400/50 transition-colors">
          <Code className="w-5 h-5 text-amber-400 mb-2" />
          <h4 className="font-bold text-white text-sm">Clean Code</h4>
          <p className="text-slate-400 mt-1">SOLID principles, automated unit testing, and modular layered architectures.</p>
        </div>
      </div>
    </div>
  );
}
