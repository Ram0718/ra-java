import { useState, type FormEvent } from 'react';
import { DEVELOPER_PROFILE } from '../../data/portfolio';
import { Mail, Send, MapPin, Terminal, CheckCircle } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'transmitting' | 'sent'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    soundFX.playClick();
    setStatus('transmitting');

    setTimeout(() => {
      setStatus('sent');
      soundFX.playWarp();
      setFormData({ name: '', email: '', message: '' });
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 cyber-glass rounded-xl border border-cyan-500/30 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-mono text-cyan-300">COMM CHANNEL // CONTACT</h2>
            <p className="text-xs font-mono text-slate-400">ESTABLISH SECURE BACKEND UPLINK</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          CHANNEL OPEN
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info & Coordinates */}
        <div className="space-y-6 font-mono text-sm">
          <div>
            <h3 className="text-base font-bold text-white mb-2">Direct Communication Node</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Looking for a dedicated Java Developer to architect your Spring Boot microservices,
              optimize database transactions, or build your next scalable web application?
              Let's connect!
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <a
              href={`mailto:${DEVELOPER_PROFILE.email}`}
              onClick={() => soundFX.playClick()}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-400/60 transition-colors group"
            >
              <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Email Transmission</div>
                <div className="text-slate-200 group-hover:text-cyan-300 transition-colors font-bold">
                  {DEVELOPER_PROFILE.email}
                </div>
              </div>
            </a>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Coordinates / Location</div>
                <div className="text-slate-200 font-bold">{DEVELOPER_PROFILE.location}</div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-2">
            <div className="text-[11px] text-slate-500 uppercase mb-3">External Networks:</div>
            <div className="flex gap-3">
              <a
                href={DEVELOPER_PROFILE.github}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFX.playClick()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-400 text-xs text-slate-300 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-cyan-400" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </a>
              <a
                href={DEVELOPER_PROFILE.linkedin}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFX.playClick()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-400 text-xs text-slate-300 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-cyan-400" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Transmission Form */}
        <div className="p-5 rounded-lg bg-slate-900/90 border border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-400 uppercase tracking-wider text-[10px] mb-1.5">
                Identifier / Your Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. John Doe / Tech Lead"
                className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-slate-200 placeholder-slate-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase tracking-wider text-[10px] mb-1.5">
                Return Frequency / Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@company.com"
                className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-slate-200 placeholder-slate-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-400 uppercase tracking-wider text-[10px] mb-1.5">
                Payload / Message
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your project, role, or collaboration proposal..."
                className="w-full px-3.5 py-2.5 rounded bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-slate-200 placeholder-slate-600 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'transmitting'}
              className="w-full py-3 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/60 hover:border-cyan-400 text-cyan-300 hover:text-white font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] flex items-center justify-center gap-2"
            >
              {status === 'transmitting' ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                  <span>TRANSMITTING...</span>
                </>
              ) : status === 'sent' ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">PACKET DELIVERED</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>SEND TRANSMISSION</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
