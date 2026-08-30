'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Eye, EyeOff, ArrowRight, Fingerprint, ShieldCheck } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/tarefas');
  };

  return (
    <div className="cyber-bg min-h-screen flex flex-col items-center justify-center font-mono p-4 text-white">
      {/* Moldura Central / HUD Frame */}
      <div className="w-full max-w-md border border-[#00f0ff] rounded-2xl p-8 bg-[#040c16]/90 backdrop-blur-md shadow-[0_0_25px_rgba(0,240,255,0.25)] relative">
        
        {/* Detalhes nos cantos estilo HUD */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-[#00f0ff]" />
        <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-[#00f0ff]" />
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-[#00f0ff]" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-[#00f0ff]" />

        {/* Logo & Título */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold tracking-widest text-white drop-shadow-[0_0_12px_#00f0ff] font-orbitron">
            DEDSEC
          </h1>
          <p className="text-[#82ff00] text-xs font-bold tracking-[0.2em] mt-1 font-orbitron">
            BY SAMUX
          </p>

          {/* Divisor com Ícone Central */}
          <div className="flex items-center justify-center gap-3 my-4">
            <div className="h-[1px] bg-[#00f0ff]/30 flex-1" />
            <div className="text-[#00f0ff]">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="h-[1px] bg-[#00f0ff]/30 flex-1" />
          </div>

          <p className="text-[11px] text-gray-400 tracking-wide">
            Bem-vindo de volta.<br />
            Acesso restrito. Autorização necessária.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Usuário */}
          <div className="relative flex items-center">
            <User className="absolute left-3.5 w-4 h-4 text-[#00f0ff]" />
            <input
              type="text"
              placeholder="USUÁRIO"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full bg-[#061422] border border-[#00f0ff]/40 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all font-mono"
            />
          </div>

          {/* Campo Senha */}
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-4 h-4 text-[#00f0ff]" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="SENHA"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-[#061422] border border-[#00f0ff]/40 rounded-lg pl-10 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff] focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-gray-400 hover:text-[#00f0ff] transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Opções Auxiliares */}
          <div className="flex items-center justify-between text-[10px] font-mono pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white">
              <input
                type="checkbox"
                checked={lembrar}
                onChange={(e) => setLembrar(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-[#061422] border-[#00f0ff]/40 accent-[#00f0ff]"
              />
              <span>LEMBRAR-ME</span>
            </label>
            <button type="button" className="text-[#00f0ff] hover:underline">
              ESQUECEU SUA SENHA?
            </button>
          </div>

          {/* Botão Entrar */}
          <button
            type="submit"
            className="w-full mt-2 border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black py-3 rounded-lg text-xs font-bold tracking-widest flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_#00f0ff] transition-all font-orbitron"
          >
            INICIAR SISTEMA <ArrowRight size={16} />
          </button>
        </form>

        {/* Divisor */}
        <div className="flex items-center my-5">
          <div className="h-[1px] bg-[#00f0ff]/20 flex-1" />
          <span className="text-[10px] text-gray-500 px-3 font-mono">OU</span>
          <div className="h-[1px] bg-[#00f0ff]/20 flex-1" />
        </div>

        {/* Acesso Biométrico */}
        <button
          type="button"
          onClick={() => router.push('/tarefas')}
          className="w-full border border-[#00f0ff]/30 bg-[#061422]/60 hover:border-[#00f0ff] text-gray-300 hover:text-white py-2.5 rounded-lg text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all font-mono"
        >
          <Fingerprint size={16} className="text-[#00f0ff]" /> ACESSO COM BIOMETRIA
        </button>
      </div>

      {/* Rodapé */}
      <div className="mt-8 text-center text-[10px] text-gray-500 space-y-1 font-mono">
        <p className="flex items-center justify-center gap-1.5 text-gray-400">
          <ShieldCheck size={13} className="text-[#00f0ff]" /> CRIPTOGRAFADO • SEGURO • ANÔNIMO
        </p>
        <p className="text-gray-600">DEDSEC - CONTROLAMOS A INFORMAÇÃO</p>
      </div>
    </div>
  );
}