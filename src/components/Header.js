'use client';
import { Bell, Wifi } from 'lucide-react';

export default function Header() {
  return (
    <div className="w-full pt-2 pb-3 px-4 relative">
      {/* Ruído hacker no canto (visível, como no modelo) */}
      <div className="hacker-noise">
        {"WE ARE DEDSEC\n"}
        <span className="hi">01000100 01000101</span>{"\n"}
        {"SYS_OVERRIDE_OK\n"}
        <span className="hi">0x8F3A9C</span>
      </div>

      {/* Barra de Status do Celular */}
      <div className="flex justify-between items-center text-[11px] font-bold text-gray-300 mb-3 px-1 relative z-10">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <div className="flex items-end gap-[2px] h-2.5">
            <span className="w-[2px] h-[30%] bg-white rounded-xs"></span>
            <span className="w-[2px] h-[50%] bg-white rounded-xs"></span>
            <span className="w-[2px] h-[80%] bg-white rounded-xs"></span>
            <span className="w-[2px] h-[100%] bg-white rounded-xs"></span>
          </div>
          <Wifi size={12} />
          <div className="w-3.5 h-2 border border-white rounded-[2px] relative">
            <div className="absolute inset-[1px] bg-white rounded-[1px]"></div>
            <div className="absolute -right-[3px] top-[2px] w-[2px] h-[4px] bg-white rounded-r-[1px]"></div>
          </div>
        </div>
      </div>

      {/* Topo Dedsec */}
      <div className="flex items-center justify-between relative z-10">
        {/* Logo Máscara (redesenhada, orelhas pontudas) */}
        <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">
            <path
              fill="#ffffff"
              d="M50 8
                 L20 30
                 L28 30
                 L14 48
                 L26 46
                 L18 68
                 L38 55
                 L44 92
                 L50 66
                 L56 92
                 L62 55
                 L82 68
                 L74 46
                 L86 48
                 L72 30
                 L80 30
                 Z"
            />
            <circle cx="40" cy="48" r="3.2" fill="#01060b" />
            <circle cx="60" cy="48" r="3.2" fill="#01060b" />
          </svg>
        </div>

        {/* Título com Glitch de verdade */}
        <div className="text-center">
          <h1
            data-text="DEDSEC"
            className="glitch-text text-[26px] font-black tracking-widest font-orbitron leading-none"
          >
            DEDSEC
          </h1>
          <p className="text-[9px] text-[#82ff00] font-bold tracking-[0.4em] mt-1">BY SAMUX</p>
        </div>

        {/* Sininho de Notificação Neon */}
        <button className="text-[#82ff00] p-1 hover:scale-110 transition-transform flex-shrink-0">
          <Bell size={20} className="drop-shadow-[0_0_8px_#82ff00]" />
        </button>
      </div>
    </div>
  );
}