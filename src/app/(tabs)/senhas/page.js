'use client';
import { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { supabase } from '../../../lib/supabaseClient';
import {
  Search, Plus, Eye, EyeOff, Copy, Check, Trash2, X, Pencil,
  Mail, Instagram, MessageSquare, Gamepad2, MonitorPlay, Globe
} from 'lucide-react';

const ICONS = { Mail, Instagram, MessageSquare, Gamepad2, MonitorPlay, Globe };
const EMPTY_FORM = { service: '', email: '', user_name: '', pass: '' };

export default function SenhasTab() {
  const [passwordsData, setPasswordsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loadError, setLoadError] = useState(null);

   const fetchPasswords = async () => {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase.from('passwords').select('*').order('id');
    if (error) {
      console.error('Erro ao buscar passwords:', error);
      setLoadError(error.message);
      setLoading(false);
      return;
    }
    setPasswordsData(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPasswords(); }, []);

  const filteredPasswords = passwordsData.filter(item =>
    item.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleVisibility = (id) => {
    const newVisible = new Set(visiblePasswords);
    newVisible.has(id) ? newVisible.delete(id) : newVisible.add(id);
    setVisiblePasswords(newVisible);
  };

  const handleCopy = (id, password) => {
    navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModalMode('add');
  };

  const openEdit = (item) => {
    setForm({ service: item.service, email: item.email, user_name: item.user_name, pass: item.pass });
    setEditingId(item.id);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const saveForm = async () => {
    if (!form.service.trim()) return;

    if (modalMode === 'add') {
      const { data, error } = await supabase
        .from('passwords')
        .insert({
          service: form.service.trim(),
          email: form.email.trim(),
          user_name: form.user_name.trim(),
          pass: form.pass,
          icon: 'Globe',
          icon_color: 'text-[#00f0ff]'
        })
        .select()
        .single();
      if (error) { console.error(error); return; }
      setPasswordsData(prev => [...prev, data]);
    } else if (modalMode === 'edit') {
      const updated = {
        service: form.service.trim(),
        email: form.email.trim(),
        user_name: form.user_name.trim(),
        pass: form.pass
      };
      setPasswordsData(prev => prev.map(p => p.id === editingId ? { ...p, ...updated } : p));
      const { error } = await supabase.from('passwords').update(updated).eq('id', editingId);
      if (error) { console.error(error); fetchPasswords(); }
    }
    closeModal();
  };

  const deleteEntry = async (id) => {
    setPasswordsData(prev => prev.filter(p => p.id !== id));
    const { error } = await supabase.from('passwords').delete().eq('id', id);
    if (error) { console.error(error); fetchPasswords(); }
  };

    if (loading) {
    return (
      <div className="cyber-bg min-h-screen text-white px-4 pb-12">
        <Header />
        <p className="text-[#00f0ff] font-mono text-xs mt-10 text-center">CARREGANDO DADOS...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="cyber-bg min-h-screen text-white px-4 pb-12">
        <Header />
        <div className="mt-10 border border-red-500 rounded-lg p-4 bg-red-950/30">
          <p className="text-red-400 text-xs font-mono font-bold mb-1">ERRO AO CARREGAR SENHAS:</p>
          <p className="text-red-300 text-[11px] font-mono break-words">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cyber-bg min-h-screen text-white px-4 pb-12">
      <Header />

      <h2 className="text-[#82ff00] font-bold text-sm tracking-widest my-3 font-orbitron">SENHAS</h2>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar senha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#040c16]/90 border-neon-cyan rounded-lg py-2 pl-3 pr-10 text-white text-xs focus:outline-none transition-all"
          />
          <Search className="absolute right-3 top-2.5 text-[#00f0ff]/70" size={16} />
        </div>
        <button
          onClick={openAdd}
          className="border border-[#82ff00] text-[#82ff00] px-3 rounded-lg flex items-center gap-1 text-[10px] font-bold tracking-wider hover:bg-[#82ff00] hover:text-black transition-colors shadow-[0_0_10px_rgba(130,255,0,0.3)]"
        >
          <Plus size={14} /> ADICIONAR
        </button>
      </div>

      <div className="space-y-3">
        {filteredPasswords.map((item) => {
          const Icon = ICONS[item.icon] || Globe;
          return (
            <div
              key={item.id}
              onClick={() => openEdit(item)}
              className="border-neon-cyan rounded-lg p-3 bg-[#040c16]/95 flex justify-between items-center transition-all hover:border-[#00f0ff] cursor-pointer"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`bg-[#061422] border border-[#00f0ff]/30 p-2 rounded-md flex-shrink-0 ${item.icon_color}`}>
                  <Icon size={20} />
                </div>

                <div className="flex flex-col">
                  <p className="text-white font-bold text-xs tracking-wide">{item.service}</p>
                  <p className="text-gray-400 text-[10px]">E-mail: {item.email || '—'}</p>
                  <p className="text-gray-400 text-[10px]">Usuário: {item.user_name || '—'}</p>

                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-300 text-[11px] tracking-widest font-mono">
                      {visiblePasswords.has(item.id) ? item.pass : '••••••••'}
                    </p>
                    <button onClick={(e) => { e.stopPropagation(); toggleVisibility(item.id); }} className="text-[#00f0ff]/70 hover:text-white transition-colors">
                      {visiblePasswords.has(item.id) ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); handleCopy(item.id, item.pass); }}
                  className="text-[#82ff00] p-2 border border-transparent hover:border-[#82ff00] rounded-md transition-all"
                  title="Copiar Senha"
                >
                  {copiedId === item.id ? <Check size={18} /> : <Copy size={18} />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteEntry(item.id); }}
                  className="text-gray-500 hover:text-red-400 p-2"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredPasswords.length === 0 && (
          <p className="text-center text-gray-500 text-sm mt-8 font-mono">Nenhuma senha encontrada.</p>
        )}
      </div>

      {modalMode && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="border-neon-cyan hud-frame rounded-xl p-5 bg-[#040c16] w-full max-w-sm relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-white">
              <X size={18} />
            </button>
            <h3 className="text-[#82ff00] font-orbitron text-sm tracking-widest mb-4 flex items-center gap-2">
              {modalMode === 'add' ? <><Plus size={14}/> NOVO APLICATIVO</> : <><Pencil size={14}/> EDITAR APLICATIVO</>}
            </h3>

            <input
              type="text"
              placeholder="Nome do serviço (ex: Spotify)"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="w-full bg-[#061422] border border-[#00f0ff]/40 rounded-md px-3 py-2 text-sm text-white mb-2 focus:outline-none focus:border-[#00f0ff]"
            />
            <input
              type="text"
              placeholder="E-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#061422] border border-[#00f0ff]/40 rounded-md px-3 py-2 text-sm text-white mb-2 focus:outline-none focus:border-[#00f0ff]"
            />
            <input
              type="text"
              placeholder="Usuário"
              value={form.user_name}
              onChange={(e) => setForm({ ...form, user_name: e.target.value })}
              className="w-full bg-[#061422] border border-[#00f0ff]/40 rounded-md px-3 py-2 text-sm text-white mb-2 focus:outline-none focus:border-[#00f0ff]"
            />
            <input
              type="text"
              placeholder="Senha"
              value={form.pass}
              onChange={(e) => setForm({ ...form, pass: e.target.value })}
              className="w-full bg-[#061422] border border-[#00f0ff]/40 rounded-md px-3 py-2 text-sm text-white mb-4 focus:outline-none focus:border-[#00f0ff]"
            />

            <button
              onClick={saveForm}
              className="w-full bg-[#82ff00] text-black font-bold py-2 rounded-md text-xs tracking-wider hover:shadow-[0_0_15px_#82ff00] transition-all"
            >
              {modalMode === 'add' ? 'ADICIONAR' : 'SALVAR ALTERAÇÕES'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}