import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#F5F5F7] border-t border-[#E5E5EA] text-[#6E6E73] py-14 text-[13px] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#E5E5EA]">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#1D1D1F] text-white font-mono font-bold flex items-center justify-center rounded-[6px] text-[11px] shadow-sm">
                RA
              </div>
              <span className="font-semibold text-sm tracking-tight text-[#1D1D1F]">
                RA-Java (Random Access Java)
              </span>
            </div>
            <p className="text-[#86868B] leading-relaxed text-xs">
              A comprehensive 100% free technical learning platform with sandboxed compiler evaluation, automated test suites, and interview preparation for modern Java software engineers.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E5E5EA] text-[#34C759] text-xs font-medium shadow-apple-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse"></span>
                <span className="text-[#1D1D1F] font-normal">Platform:</span> 100% Free &amp; Operational
              </span>
            </div>
          </div>

          {/* Curriculum */}
          <div>
            <h4 className="text-[#1D1D1F] font-semibold mb-3 text-xs uppercase tracking-wider">Curriculum</h4>
            <ul className="space-y-2 text-xs text-[#6E6E73]">
              <li><Link to="/modules/java-fundamentals" className="hover:text-[#0071E3] transition-colors">01. Fundamentals &amp; JVM</Link></li>
              <li><Link to="/modules/loops-and-iterations" className="hover:text-[#0071E3] transition-colors">03. Loops &amp; Iteration</Link></li>
              <li><Link to="/modules/arrays" className="hover:text-[#0071E3] transition-colors">05. Arrays &amp; Two-Pointers</Link></li>
              <li><Link to="/modules/object-oriented-programming" className="hover:text-[#0071E3] transition-colors">07. Object-Oriented Java</Link></li>
              <li><Link to="/modules/collections-framework" className="hover:text-[#0071E3] transition-colors">09. Collections &amp; HashMaps</Link></li>
              <li><Link to="/modules/multithreading-concurrency" className="hover:text-[#0071E3] transition-colors">11. Multithreading &amp; Concurrency</Link></li>
            </ul>
          </div>

          {/* Tools & Resources */}
          <div>
            <h4 className="text-[#1D1D1F] font-semibold mb-3 text-xs uppercase tracking-wider">Developer Tools</h4>
            <ul className="space-y-2 text-xs text-[#6E6E73]">
              <li><Link to="/compiler" className="hover:text-[#0071E3] transition-colors">Online Monaco Sandbox</Link></li>
              <li><Link to="/practice" className="hover:text-[#0071E3] transition-colors">Coding Challenges (85+)</Link></li>
              <li><Link to="/assessments" className="hover:text-[#0071E3] transition-colors">Module Examination Arena</Link></li>
              <li><Link to="/materials" className="hover:text-[#0071E3] transition-colors">PDF Handbooks Vault</Link></li>
              <li><Link to="/interview" className="hover:text-[#0071E3] transition-colors">Technical Placement Mock Simulator</Link></li>
            </ul>
          </div>

          {/* Platform Standards */}
          <div>
            <h4 className="text-[#1D1D1F] font-semibold mb-3 text-xs uppercase tracking-wider">Engineering Specs</h4>
            <ul className="space-y-2 text-xs text-[#86868B]">
              <li className="flex justify-between"><span>Access:</span> <strong className="text-[#34C759]">100% Free Lifetime</strong></li>
              <li className="flex justify-between"><span>Concurrency:</span> <strong className="text-[#1D1D1F]">Single Device Lock</strong></li>
              <li className="flex justify-between"><span>Sandbox:</span> <strong className="text-[#1D1D1F]">Isolated Subprocess</strong></li>
              <li className="flex justify-between"><span>Security:</span> <strong className="text-[#1D1D1F]">RFC-7519 Session Token</strong></li>
              <li className="flex justify-between"><span>Runtime Engine:</span> <strong className="text-[#1D1D1F]">OpenJDK 21.0.2</strong></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#86868B] gap-3">
          <p>&copy; {new Date().getFullYear()} RA-Java (Random Access Java). All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-[#6E6E73]">
            <Terminal className="w-3.5 h-3.5 text-[#86868B]" />
            <span>Spring Boot 3.3.5 • Java 21 • React 19 • Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
