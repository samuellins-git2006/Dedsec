import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-mono">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-widest text-white drop-shadow-[0_0_10px_#00bfff]">DEDSEC</h1>
        <p className="text-dedsec-green mt-2 tracking-widest">BY SAMUX</p>
      </div>
      
      <Link 
        href="/tarefas" 
        className="mt-16 border border-dedsec-blue text-dedsec-blue px-8 py-3 rounded-lg shadow-neon-blue hover:bg-dedsec-blue hover:text-black transition-all"
      >
        INICIAR SISTEMA
      </Link>
    </div>
  );
}