import React from 'react';

const IndustrialHeroVisual = () => {
  return (
    <div className="relative w-full aspect-[4/3] max-w-xl mx-auto rounded-2xl overflow-hidden border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 shadow-2xl p-6 flex flex-col justify-between">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>

      {/* Top Status Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-mono font-medium text-slate-300">PROCESS: ELECTROPLATING JOB WORK</span>
        </div>
        <div className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-900/60 text-sky-400 border border-blue-700/50">
          MIDC AMBAD, NASHIK
        </div>
      </div>

      {/* Center Industrial Technical Vector */}
      <div className="relative z-10 my-auto py-4">
        <svg viewBox="0 0 400 220" className="w-full h-auto drop-shadow-lg">
          <defs>
            <linearGradient id="metalSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#94a3b8" />
              <stop offset="50%" stop-color="#f8fafc" />
              <stop offset="100%" stop-color="#64748b" />
            </linearGradient>
            <linearGradient id="bathGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0284c7" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#0369a1" stop-opacity="0.7" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Tank Wall */}
          <rect x="40" y="70" width="320" height="130" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2" />
          
          {/* Electrolyte Bath Fluid */}
          <rect x="44" y="85" width="312" height="110" rx="4" fill="url(#bathGlow)" />
          
          {/* Cathode Busbar (Top Rail) */}
          <rect x="20" y="45" width="360" height="8" rx="2" fill="url(#metalSheen)" stroke="#475569" />
          <text x="200" y="38" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="monospace">
            CATHODE FLIGHT BAR (DC -)
          </text>

          {/* Suspended Engineering Components (Racks) */}
          {/* Component 1: Gear / Pinion */}
          <line x1="100" y1="53" x2="100" y2="110" stroke="#cbd5e1" stroke-width="2" />
          <circle cx="100" cy="125" r="20" fill="url(#metalSheen)" stroke="#38bdf8" stroke-width="1.5" />
          <circle cx="100" cy="125" r="8" fill="#0f172a" stroke="#38bdf8" />

          {/* Component 2: Shaft Sleeve Bushing */}
          <line x1="200" y1="53" x2="200" y2="105" stroke="#cbd5e1" stroke-width="2" />
          <rect x="185" y="105" width="30" height="46" rx="4" fill="url(#metalSheen)" stroke="#38bdf8" stroke-width="1.5" />
          <line x1="185" y1="120" x2="215" y2="120" stroke="#64748b" stroke-width="1" />
          <line x1="185" y1="135" x2="215" y2="135" stroke="#64748b" stroke-width="1" />

          {/* Component 3: Precision Flange */}
          <line x1="300" y1="53" x2="300" y2="110" stroke="#cbd5e1" stroke-width="2" />
          <polygon points="300,105 322,120 322,145 300,160 278,145 278,120" fill="url(#metalSheen)" stroke="#38bdf8" stroke-width="1.5" />
          <circle cx="300" cy="132" r="7" fill="#0f172a" />

          {/* Chemical / Ion Deposition Indicators */}
          <g filter="url(#glow)">
            <circle cx="80" cy="100" r="2.5" fill="#38bdf8" opacity="0.8" />
            <circle cx="120" cy="140" r="2" fill="#38bdf8" opacity="0.6" />
            <circle cx="170" cy="120" r="3" fill="#38bdf8" opacity="0.7" />
            <circle cx="230" cy="145" r="2.5" fill="#38bdf8" opacity="0.9" />
            <circle cx="280" cy="115" r="2" fill="#38bdf8" opacity="0.7" />
            <circle cx="320" cy="135" r="3" fill="#38bdf8" opacity="0.8" />
          </g>

          {/* Bath Measurement Grids */}
          <line x1="45" y1="100" x2="55" y2="100" stroke="#38bdf8" stroke-width="1" />
          <line x1="45" y1="130" x2="55" y2="130" stroke="#38bdf8" stroke-width="1" />
          <line x1="45" y1="160" x2="55" y2="160" stroke="#38bdf8" stroke-width="1" />
          <text x="60" y="103" fill="#38bdf8" font-size="7" font-family="monospace">pH/TEMP OK</text>
        </svg>
      </div>

      {/* Bottom Technical Specifications Ribbon */}
      <div className="relative z-10 grid grid-cols-3 gap-2 border-t border-slate-800 pt-3 text-center">
        <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
          <span className="block text-[10px] text-slate-400 uppercase font-mono">Facility</span>
          <span className="text-xs font-semibold text-slate-200">G-8, MIDC Ambad</span>
        </div>
        <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
          <span className="block text-[10px] text-slate-400 uppercase font-mono">Service Focus</span>
          <span className="text-xs font-semibold text-sky-400">Job-Work Solutions</span>
        </div>
        <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
          <span className="block text-[10px] text-slate-400 uppercase font-mono">Evaluation</span>
          <span className="text-xs font-semibold text-emerald-400">Drawing Review</span>
        </div>
      </div>
    </div>
  );
};

export default IndustrialHeroVisual;
