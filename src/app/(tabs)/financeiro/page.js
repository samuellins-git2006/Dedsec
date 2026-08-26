'use client';
import { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { supabase } from '../../../lib/supabaseClient';
import {
  ShoppingCart, Utensils, Bus, Gamepad2, Trash2, X,
  Package, ShoppingBag, Globe, Store
} from 'lucide-react';

const EXPENSE_ICONS = { cart: ShoppingCart, food: Utensils, transport: Bus, fun: Gamepad2 };
const STORE_ICONS = { Amazon: Package, Shopee: ShoppingBag, AliExpress: Globe, 'Mercado Livre': Store };
const STORE_COLORS = { Amazon: 'text-orange-400', Shopee: 'text-orange-500', AliExpress: 'text-red-500', 'Mercado Livre': 'text-yellow-400' };
const STORES = ['Amazon', 'Shopee', 'AliExpress', 'Mercado Livre'];

function formatBRL(n) {
  return Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function buildChartPoints(history) {
  if (!history || history.length < 2) return '0,25 100,25';
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const step = 100 / (history.length - 1);
  return history.map((v, i) => {
    const x = i * step;
    const y = 28 - ((v - min) / range) * 26;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

export default function FinanceiroTab() {
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ balance: 0, history: [], last_update: '' });
  const [expenses, setExpenses] = useState([]);
  const [purchases, setPurchases] = useState({});
  const [editingBalance, setEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState('');
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [expenseInput, setExpenseInput] = useState('');
  const [openStore, setOpenStore] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  const fetchAll = async () => {
    const [metaRes, expensesRes, purchasesRes] = await Promise.all([
      supabase.from('finance_meta').select('*').eq('id', 1).single(),
      supabase.from('expenses').select('*').order('id'),
      supabase.from('purchases').select('*').order('created_at'),
    ]);

    if (metaRes.data) setMeta(metaRes.data);
    if (expensesRes.data) setExpenses(expensesRes.data);

    const grouped = {};
    STORES.forEach(s => grouped[s] = []);
    (purchasesRes.data || []).forEach(p => {
      if (!grouped[p.store]) grouped[p.store] = [];
      grouped[p.store].push(p);
    });
    setPurchases(grouped);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.value), 0);

  const saveBalance = async () => {
    const value = parseFloat(balanceInput.replace(',', '.'));
    if (isNaN(value)) { setEditingBalance(false); return; }
    const newHistory = [...(meta.history || []).slice(-5), value];
    const newLastUpdate = `hoje, ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    setMeta(prev => ({ ...prev, balance: value, history: newHistory, last_update: newLastUpdate }));
    setEditingBalance(false);

    const { error } = await supabase
      .from('finance_meta')
      .update({ balance: value, history: newHistory, last_update: newLastUpdate })
      .eq('id', 1);
    if (error) { console.error(error); fetchAll(); }
  };

  const saveExpense = async (id) => {
    const value = parseFloat(expenseInput.replace(',', '.'));
    setEditingExpenseId(null);
    if (isNaN(value)) return;

    setExpenses(prev => prev.map(e => e.id === id ? { ...e, value } : e));
    const { error } = await supabase.from('expenses').update({ value }).eq('id', id);
    if (error) { console.error(error); fetchAll(); }
  };

  const addItem = async (store) => {
    if (!newItemName.trim() || !newItemPrice) return;
    const price = parseFloat(newItemPrice.replace(',', '.'));
    if (isNaN(price)) return;

    const { data, error } = await supabase
      .from('purchases')
      .insert({ store, name: newItemName.trim(), price })
      .select()
      .single();
    if (error) { console.error(error); return; }

    setPurchases(prev => ({ ...prev, [store]: [...prev[store], data] }));
    setNewItemName('');
    setNewItemPrice('');
  };

  const deleteItem = async (store, id) => {
    setPurchases(prev => ({ ...prev, [store]: prev[store].filter(i => i.id !== id) }));
    const { error } = await supabase.from('purchases').delete().eq('id', id);
    if (error) { console.error(error); fetchAll(); }
  };

  if (loading) {
    return (
      <div className="cyber-bg min-h-screen text-white px-4 pb-12">
        <Header />
        <p className="text-[#00f0ff] font-mono text-xs mt-20 text-center">CARREGANDO DADOS...</p>
      </div>
    );
  }

  return (
    <div className="cyber-bg min-h-screen text-white px-4 pb-12">
      <Header />

      <h2 className="text-[#82ff00] font-bold text-sm tracking-widest my-3 font-orbitron">FINANCEIRO</h2>

      <div className="border-neon-cyan hud-frame rounded-xl p-4 bg-[#040c16]/90 backdrop-blur-md mb-6 relative overflow-hidden">
        <p className="text-[#00f0ff] text-[10px] tracking-widest font-bold mb-1">DINHEIRO ATUAL</p>

        {editingBalance ? (
          <input
            autoFocus
            type="text"
            value={balanceInput}
            onChange={(e) => setBalanceInput(e.target.value)}
            onBlur={saveBalance}
            onKeyDown={(e) => e.key === 'Enter' && saveBalance()}
            className="bg-[#061422] border border-[#82ff00] rounded-md px-2 py-1 text-2xl font-bold text-[#82ff00] font-orbitron w-48 mb-4 focus:outline-none"
          />
        ) : (
          <h3
            onClick={() => { setBalanceInput(String(meta.balance)); setEditingBalance(true); }}
            className="text-[#82ff00] text-3xl font-bold mb-4 font-orbitron drop-shadow-[0_0_10px_rgba(130,255,0,0.5)] cursor-pointer inline-block"
            title="Clique para editar"
          >
            {formatBRL(meta.balance)}
          </h3>
        )}

        <p className="text-gray-500 text-[10px] font-mono">Última atualização: {meta.last_update}</p>

        <div className="absolute right-0 bottom-4 w-32 h-12 opacity-90">
          <svg viewBox="0 0 100 30" className="w-full h-full stroke-[#82ff00] fill-none" strokeWidth="2">
            <polyline points={buildChartPoints(meta.history)} />
          </svg>
        </div>
      </div>

      <h3 className="text-[#82ff00] text-xs font-bold tracking-wider mb-3 font-orbitron">GASTOS FREQUENTES</h3>
      <div className="grid grid-cols-4 gap-2 mb-6">
        {expenses.map((item) => {
          const Icon = EXPENSE_ICONS[item.icon];
          const pct = totalExpenses > 0 ? Math.round((Number(item.value) / totalExpenses) * 100) : 0;
          return (
            <div key={item.id} className="border-neon-cyan rounded-lg p-2 bg-[#040c16]/90 flex flex-col items-center justify-center text-center">
              <Icon size={18} className="text-white mb-2" />
              <p className="text-white text-[9px] mb-1 leading-tight">{item.name}</p>

              {editingExpenseId === item.id ? (
                <input
                  autoFocus
                  type="text"
                  value={expenseInput}
                  onChange={(e) => setExpenseInput(e.target.value)}
                  onBlur={() => saveExpense(item.id)}
                  onKeyDown={(e) => e.key === 'Enter' && saveExpense(item.id)}
                  className="w-14 bg-[#061422] border border-[#00f0ff] rounded text-white text-[9px] text-center mb-2"
                />
              ) : (
                <p
                  onClick={() => { setExpenseInput(String(item.value)); setEditingExpenseId(item.id); }}
                  className="text-[#82ff00] text-[10px] font-bold mb-2 cursor-pointer"
                >
                  R$ {Number(item.value).toFixed(2)}
                </p>
              )}

              <div className="w-8 h-8 rounded-full border border-[#00f0ff]/60 flex items-center justify-center">
                <span className="text-white text-[9px]">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <h3 className="text-[#82ff00] text-xs font-bold tracking-wider mb-3 font-orbitron">COMPRAS DA INTERNET</h3>
      <div className="border-neon-cyan hud-frame rounded-xl p-4 bg-[#040c16]/95 space-y-4">
        {STORES.map((store) => {
          const Icon = STORE_ICONS[store];
          const items = purchases[store] || [];
          const total = items.reduce((sum, i) => sum + Number(i.price), 0);
          return (
            <button
              key={store}
              onClick={() => setOpenStore(store)}
              className="w-full flex justify-between items-center border-b border-white/10 pb-3 last:border-0 last:pb-0 text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md bg-[#061422] border border-[#00f0ff]/30 ${STORE_COLORS[store]}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-white text-xs font-bold tracking-wide">{store}</p>
                  <p className="text-gray-400 text-[10px]">{items.length} {items.length === 1 ? 'item' : 'itens'}</p>
                </div>
              </div>
              <p className="text-[#82ff00] text-xs font-bold">{formatBRL(total)}</p>
            </button>
          );
        })}
      </div>

      {openStore && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="border-neon-cyan hud-frame rounded-xl p-5 bg-[#040c16] w-full max-w-sm relative max-h-[80vh] overflow-y-auto">
            <button onClick={() => setOpenStore(null)} className="absolute top-3 right-3 text-gray-400 hover:text-white">
              <X size={18} />
            </button>
            <h3 className="text-[#82ff00] font-orbitron text-sm tracking-widest mb-4">{openStore.toUpperCase()}</h3>

            <div className="space-y-2 mb-4">
              {(purchases[openStore] || []).map(item => (
                <div key={item.id} className="flex justify-between items-center bg-[#061422] rounded-md px-3 py-2">
                  <div>
                    <p className="text-white text-xs">{item.name}</p>
                    <p className="text-[#82ff00] text-[11px] font-bold">{formatBRL(item.price)}</p>
                  </div>
                  <button onClick={() => deleteItem(openStore, item.id)} className="text-gray-500 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {(purchases[openStore] || []).length === 0 && (
                <p className="text-gray-500 text-xs text-center py-2 font-mono">Nenhum item ainda.</p>
              )}
            </div>

            <input
              type="text"
              placeholder="Nome do item"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full bg-[#061422] border border-[#00f0ff]/40 rounded-md px-3 py-2 text-sm text-white mb-2 focus:outline-none focus:border-[#00f0ff]"
            />
            <input
              type="text"
              placeholder="Preço (ex: 99.90)"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              className="w-full bg-[#061422] border border-[#00f0ff]/40 rounded-md px-3 py-2 text-sm text-white mb-4 focus:outline-none focus:border-[#00f0ff]"
            />
            <button
              onClick={() => addItem(openStore)}
              className="w-full bg-[#82ff00] text-black font-bold py-2 rounded-md text-xs tracking-wider hover:shadow-[0_0_15px_#82ff00] transition-all"
            >
              ADICIONAR ITEM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}