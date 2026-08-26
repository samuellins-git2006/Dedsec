'use client';
import { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { supabase } from '../../../lib/supabaseClient';
import { ChevronLeft, ChevronRight, Check, Plus, Trash2, X } from 'lucide-react';

const MESES = [
  'JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO',
  'JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO'
];
const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

function pad(n) { return String(n).padStart(2, '0'); }
function dateKey(year, month, day) { return `${year}-${pad(month + 1)}-${pad(day)}`; }

function loadView() {
  const today = new Date();
  const fallback = { viewYear: today.getFullYear(), viewMonth: today.getMonth(), selectedDay: today.getDate() };
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem('dedsec_calendar_view');
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export default function TarefasPage() {
  const initialView = loadView();
  const [viewYear, setViewYear] = useState(initialView.viewYear);
  const [viewMonth, setViewMonth] = useState(initialView.viewMonth);
  const [selectedDay, setSelectedDay] = useState(initialView.selectedDay);
  const [tasksByDate, setTasksByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [loadError, setLoadError] = useState(null);

   const fetchTasks = async () => {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase.from('tasks').select('*').order('created_at');
    if (error) {
      console.error('Erro ao buscar tasks:', error);
      setLoadError(error.message);
      setLoading(false);
      return;
    }
    const grouped = {};
    (data || []).forEach(t => {
      if (!grouped[t.task_date]) grouped[t.task_date] = [];
      grouped[t.task_date].push(t);
    });
    setTasksByDate(grouped);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dedsec_calendar_view', JSON.stringify({ viewYear, viewMonth, selectedDay }));
    }
  }, [viewYear, viewMonth, selectedDay]);

  const selectedKey = dateKey(viewYear, viewMonth, selectedDay);
  const dayTasks = tasksByDate[selectedKey] || [];

  const changeMonth = (delta) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
    setSelectedDay(1);
  };

  const toggleTask = async (id, current) => {
    setTasksByDate(prev => ({
      ...prev,
      [selectedKey]: prev[selectedKey].map(t => t.id === id ? { ...t, completed: !current } : t)
    }));
    const { error } = await supabase.from('tasks').update({ completed: !current }).eq('id', id);
    if (error) { console.error(error); fetchTasks(); }
  };

  const deleteTask = async (id) => {
    setTasksByDate(prev => ({
      ...prev,
      [selectedKey]: prev[selectedKey].filter(t => t.id !== id)
    }));
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) { console.error(error); fetchTasks(); }
  };

  const addTask = async () => {
    if (!newTitle.trim()) return;
    const { data, error } = await supabase
      .from('tasks')
      .insert({ task_date: selectedKey, title: newTitle.trim(), time: newTime || '--:--', completed: false })
      .select()
      .single();
    if (error) { console.error(error); return; }
    setTasksByDate(prev => ({
      ...prev,
      [selectedKey]: [...(prev[selectedKey] || []), data]
    }));
    setNewTitle('');
    setNewTime('');
    setShowAddModal(false);
  };

  const allTasks = Object.values(tasksByDate).flat();
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.completed).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInThisMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays = [];
  for (let i = firstWeekday - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, currentMonth: false });
  }
  for (let d = 1; d <= daysInThisMonth; d++) {
    calendarDays.push({ day: d, currentMonth: true });
  }
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push({ day: calendarDays.length, currentMonth: false });
  }

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
          <p className="text-red-400 text-xs font-mono font-bold mb-1">ERRO AO CARREGAR TAREFAS:</p>
          <p className="text-red-300 text-[11px] font-mono break-words">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cyber-bg min-h-screen text-white px-4 pb-12">
      <Header />

      <h2 className="text-[#82ff00] font-bold text-sm tracking-widest my-3 font-orbitron">TAREFAS</h2>

      <div className="border-neon-cyan hud-frame rounded-xl p-3.5 bg-[#040c16]/90 backdrop-blur-md mb-5 relative overflow-hidden">
        <div className="inline-block border border-[#00f0ff] px-2.5 py-0.5 rounded text-[10px] text-[#00f0ff] font-bold tracking-wider mb-3 bg-[#00f0ff]/10">
          CALENDÁRIO
        </div>

        <div className="flex justify-between items-center text-[#00f0ff] mb-4 px-2">
          <button onClick={() => changeMonth(-1)} className="hover:text-white"><ChevronLeft size={18} /></button>
          <span className="font-bold text-sm tracking-widest text-white font-orbitron">
            {MESES[viewMonth]} {viewYear}
          </span>
          <button onClick={() => changeMonth(1)} className="hover:text-white"><ChevronRight size={18} /></button>
        </div>

        <div className="grid grid-cols-7 text-center text-[10px] font-bold text-[#00f0ff] mb-3 tracking-wider">
          {DIAS_SEMANA.map(d => <span key={d}>{d}</span>)}
        </div>

        <div className="grid grid-cols-7 gap-y-2 text-center">
          {calendarDays.map((item, idx) => {
            const key = item.currentMonth ? dateKey(viewYear, viewMonth, item.day) : null;
            const hasTasks = key && (tasksByDate[key]?.length > 0);
            const isSelected = item.currentMonth && item.day === selectedDay;

            return (
              <div key={idx} className="flex items-center justify-center h-8 relative">
                {item.currentMonth ? (
                  <button
                    onClick={() => setSelectedDay(item.day)}
                    className="relative w-8 h-8 flex items-center justify-center"
                  >
                    {isSelected ? (
                      <>
                        <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full animate-spin-slow">
                          <circle cx="20" cy="20" r="18" fill="none" stroke="#a3ff00" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.9" />
                        </svg>
                        <div className="w-6 h-6 rounded-full glow-green-orb flex items-center justify-center text-black font-extrabold text-xs z-10">
                          {item.day}
                        </div>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-white">{item.day}</span>
                    )}
                    {hasTasks && !isSelected && (
                      <span className="absolute bottom-0 w-1 h-1 rounded-full bg-[#00f0ff] shadow-[0_0_4px_#00f0ff]" />
                    )}
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-gray-600">{item.day}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center text-[11px] font-bold mb-1.5 font-orbitron">
          <span className="text-[#82ff00] tracking-wider">PROGRESSO GERAL</span>
          <span className="text-[#00f0ff]">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-[#061422] rounded-full overflow-hidden border border-[#00f0ff]/40 p-[1px]">
          <div className="h-full bg-[#82ff00] rounded-full glow-green-bar transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <h3 className="text-[#82ff00] text-xs font-bold tracking-wider mb-3 font-orbitron">
        SUAS TAREFAS - {selectedDay} DE {MESES[viewMonth]}
      </h3>

      <div className="space-y-3">
        {dayTasks.length === 0 && (
          <p className="text-gray-500 text-xs font-mono text-center py-4">Nenhuma tarefa para este dia.</p>
        )}
        {dayTasks.map(task => (
          <div
            key={task.id}
            className="border-neon-cyan rounded-lg p-3 bg-[#040c16]/95 flex justify-between items-center transition-all hover:border-[#00f0ff]"
          >
            <div>
              <p className="text-xs font-bold text-white tracking-wide">{task.title}</p>
              <p className="text-[10px] text-gray-400 mt-1 font-mono">{task.time}</p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => deleteTask(task.id)} className="text-gray-500 hover:text-red-400 transition-colors p-1">
                <Trash2 size={15} />
              </button>
              <button
                onClick={() => toggleTask(task.id, task.completed)}
                className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all ${
                  task.completed
                    ? 'bg-[#82ff00] border-[#82ff00] text-black shadow-[0_0_10px_#82ff00]'
                    : 'border-[#00f0ff]/60 bg-transparent hover:border-[#00f0ff]'
                }`}
              >
                {task.completed && <Check size={16} strokeWidth={3.5} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-5">
        <button
          onClick={() => setShowAddModal(true)}
          className="border border-[#00f0ff] text-[#00f0ff] hover:text-[#82ff00] hover:border-[#82ff00] px-3.5 py-1.5 rounded-md text-xs font-bold tracking-wider flex items-center gap-1.5 bg-[#040c16] shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all"
        >
          <Plus size={14} strokeWidth={2.5} /> NOVA TAREFA
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="border-neon-cyan hud-frame rounded-xl p-5 bg-[#040c16] w-full max-w-sm relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white">
              <X size={18} />
            </button>
            <h3 className="text-[#82ff00] font-orbitron text-sm tracking-widest mb-4">NOVA TAREFA</h3>
            <p className="text-[10px] text-gray-400 mb-3 font-mono">
              {selectedDay} de {MESES[viewMonth]} de {viewYear}
            </p>
            <input
              type="text"
              placeholder="Título da tarefa"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-[#061422] border border-[#00f0ff]/40 rounded-md px-3 py-2 text-sm text-white mb-3 focus:outline-none focus:border-[#00f0ff]"
            />
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full bg-[#061422] border border-[#00f0ff]/40 rounded-md px-3 py-2 text-sm text-white mb-4 focus:outline-none focus:border-[#00f0ff]"
            />
            <button
              onClick={addTask}
              className="w-full bg-[#82ff00] text-black font-bold py-2 rounded-md text-xs tracking-wider hover:shadow-[0_0_15px_#82ff00] transition-all"
            >
              ADICIONAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}