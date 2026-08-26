'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, CircleDollarSign, Lock } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'TAREFAS', path: '/tarefas', icon: ClipboardList, color: '#a3ff00' },
    { name: 'FINANCEIRO', path: '/financeiro', icon: CircleDollarSign, color: '#00d8ff' },
    { name: 'SENHAS', path: '/senhas', icon: Lock, color: '#00d8ff' },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md z-50">
      {/* linha de acento superior */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00d8ff]/70 to-transparent" />

      <div className="relative bg-[#01060b] border-t border-[#00d8ff]/25 px-3 py-3 flex justify-around items-stretch shadow-[0_-8px_25px_rgba(0,216,255,0.12)]">
        {/* marcas de canto do painel */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00d8ff]/70" />
        <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00d8ff]/70" />

        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.path}
              className="relative flex-1 flex flex-col items-center justify-center py-1.5 mx-0.5"
            >
              {isActive && (
                <div
                  className="absolute inset-x-0 inset-y-0 rounded-sm border border-dashed animate-pulse-slow"
                  style={{
                    borderColor: item.color,
                    background: `${item.color}12`,
                    boxShadow: `0 0 14px ${item.color}55, inset 0 0 10px ${item.color}22`,
                    clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)',
                  }}
                >
                  <span
                    className="absolute top-0 left-0 w-2 h-2 border-t border-l"
                    style={{ borderColor: item.color }}
                  />
                  <span
                    className="absolute bottom-0 right-0 w-2 h-2 border-b border-r"
                    style={{ borderColor: item.color }}
                  />
                </div>
              )}

              <Icon
                size={20}
                strokeWidth={isActive ? 2.4 : 1.6}
                className="relative z-10 mb-1"
                style={{ color: isActive ? item.color : 'rgba(0,216,255,0.55)' }}
              />
              <span
                className="relative z-10 text-[9px] tracking-widest font-mono font-bold"
                style={{ color: isActive ? item.color : 'rgba(0,216,255,0.55)' }}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}