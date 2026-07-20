import { useEffect, useState } from 'react';
import api from '../api';
import { LayoutDashboard, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface PersonTotal {
  personId: number;
  personName: string;
  totalIncomes: number;
  totalExpenses: number;
  netBalance: number;
}

interface GlobalTotal {
  totalIncomes: number;
  totalExpenses: number;
  netBalance: number;
}

interface TotalsResponse {
  persons: PersonTotal[];
  global: GlobalTotal;
}

export default function DashboardPage() {
  const [totals, setTotals] = useState<TotalsResponse | null>(null);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const response = await api.get('/totals');
        setTotals(response.data);
      } catch (error) {
        console.error("Erro ao buscar totais:", error);
      }
    };
    fetchTotals();
  }, []);

  if (!totals) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Dashboard Consolidado</h1>
        </div>
        <p className="text-slate-400">Visão geral financeira da residência e saldos individuais.</p>
      </header>

      {/* Cards Globais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl ring-1 ring-emerald-500/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-24 h-24 text-emerald-400 -mr-6 -mt-6" />
          </div>
          <div className="relative z-10">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Receitas Gerais
            </p>
            <p className="text-4xl font-bold text-slate-100 font-mono tracking-tight">
              R$ {totals.global.totalIncomes.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl ring-1 ring-rose-500/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingDown className="w-24 h-24 text-rose-400 -mr-6 -mt-6" />
          </div>
          <div className="relative z-10">
            <p className="text-rose-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Despesas Gerais
            </p>
            <p className="text-4xl font-bold text-slate-100 font-mono tracking-tight">
              R$ {totals.global.totalExpenses.toFixed(2)}
            </p>
          </div>
        </div>

        <div className={`bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl ring-1 relative overflow-hidden group ${totals.global.netBalance >= 0 ? 'ring-indigo-500/20' : 'ring-orange-500/20'}`}>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <DollarSign className={`w-24 h-24 -mr-6 -mt-6 ${totals.global.netBalance >= 0 ? 'text-indigo-400' : 'text-orange-400'}`} />
          </div>
          <div className="relative z-10">
            <p className={`text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2 ${totals.global.netBalance >= 0 ? 'text-indigo-400' : 'text-orange-400'}`}>
              <DollarSign className="w-4 h-4" />
              Saldo Líquido Geral
            </p>
            <p className={`text-4xl font-bold font-mono tracking-tight ${totals.global.netBalance >= 0 ? 'text-indigo-300' : 'text-orange-400'}`}>
              R$ {totals.global.netBalance.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabela por Pessoa */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl ring-1 ring-white/5 overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-200">Detalhamento por Morador</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="p-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Morador</th>
                <th className="p-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Receitas</th>
                <th className="p-5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Despesas</th>
                <th className="p-5 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Saldo Líquido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {totals.persons.map(p => (
                <tr key={p.personId} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-300 ring-1 ring-indigo-500/30">
                        {p.personName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-slate-200 font-medium">{p.personName}</span>
                    </div>
                  </td>
                  <td className="p-5 text-emerald-400 font-mono">
                    R$ {p.totalIncomes.toFixed(2)}
                  </td>
                  <td className="p-5 text-rose-400 font-mono">
                    R$ {p.totalExpenses.toFixed(2)}
                  </td>
                  <td className="p-5 text-right">
                    <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-bold font-mono shadow-inner ${
                      p.netBalance >= 0 
                        ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20'
                    }`}>
                      R$ {p.netBalance.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
              {totals.persons.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-500">
                    Nenhuma pessoa cadastrada para exibir totais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
