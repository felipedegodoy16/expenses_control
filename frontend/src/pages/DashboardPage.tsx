import { useEffect, useState } from 'react';
import api from '../api';
import { TrendingUp, TrendingDown, DollarSign, LayoutDashboard, Users } from 'lucide-react';

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

const AVATAR_COLORS = [
  ['rgba(99,102,241,0.2)', '#818cf8'],
  ['rgba(34,211,238,0.2)', '#22d3ee'],
  ['rgba(16,185,129,0.2)', '#34d399'],
  ['rgba(251,146,60,0.2)', '#fb923c'],
  ['rgba(244,63,94,0.18)', '#fb7185'],
];
const avatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];

/* Mini barra de progresso de saldo */
function BalanceBar({ income, expense }: { income: number; expense: number }) {
  const total = income + expense;
  if (total === 0) return null;
  const pct = Math.round((income / total) * 100);
  return (
    <div className="mt-3" style={{ height: '4px', borderRadius: '99px', background: 'rgba(51,65,85,0.4)', overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${pct}%`,
        background: 'linear-gradient(90deg, #6366f1, #22d3ee)',
        borderRadius: '99px',
        transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }} />
    </div>
  );
}

export default function DashboardPage() {
  const [totals, setTotals] = useState<TotalsResponse | null>(null);

  useEffect(() => {
    api.get<TotalsResponse>('/totals')
      .then(r => setTotals(r.data))
      .catch(err => console.error('Erro ao buscar totais:', err));
  }, []);

  if (!totals) {
    return (
      <div className="flex items-center justify-center h-72 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="spinner mx-auto" />
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Carregando dados...</p>
        </div>
      </div>
    );
  }

  const { global: g, persons } = totals;

  return (
    <div className="animate-slide-up">

      {/* ── Header ── */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#818cf8' }}>Visão Geral</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
          Dashboard Financeiro
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Resumo consolidado de receitas, despesas e saldos
        </p>
      </header>

      <div className="shimmer-divider mb-10" />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

        {/* Receitas */}
        <div className="glass-card stat-card stat-card-success p-6 animate-scale-in delay-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#34d399' }}>Receitas Gerais</p>
            </div>
            <div style={{
              padding: '0.5rem', borderRadius: '0.6rem',
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)',
            }}>
              <TrendingUp className="w-4 h-4" style={{ color: '#34d399' }} />
            </div>
          </div>
          <p className="text-4xl font-bold font-mono tracking-tight animate-number" style={{ color: '#f1f5f9' }}>
            R$ <span className="gradient-text-success">{g.totalIncomes.toFixed(2)}</span>
          </p>
          <p className="mt-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>Total de entradas registradas</p>
        </div>

        {/* Despesas */}
        <div className="glass-card stat-card stat-card-danger p-6 animate-scale-in delay-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#fb7185' }}>Despesas Gerais</p>
            </div>
            <div style={{
              padding: '0.5rem', borderRadius: '0.6rem',
              background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.2)',
            }}>
              <TrendingDown className="w-4 h-4" style={{ color: '#fb7185' }} />
            </div>
          </div>
          <p className="text-4xl font-bold font-mono tracking-tight animate-number delay-100" style={{ color: '#f1f5f9' }}>
            R$ <span className="gradient-text-danger">{g.totalExpenses.toFixed(2)}</span>
          </p>
          <p className="mt-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>Total de saídas registradas</p>
        </div>

        {/* Saldo */}
        <div className="glass-card stat-card p-6 animate-scale-in delay-300" style={{
          border: `1px solid ${g.netBalance >= 0 ? 'rgba(99,102,241,0.2)' : 'rgba(251,146,60,0.2)'}`,
        }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: g.netBalance >= 0 ? '#818cf8' : '#fb923c' }}>
                Saldo Líquido
              </p>
            </div>
            <div style={{
              padding: '0.5rem', borderRadius: '0.6rem',
              background: g.netBalance >= 0 ? 'rgba(99,102,241,0.12)' : 'rgba(251,146,60,0.12)',
              border: `1px solid ${g.netBalance >= 0 ? 'rgba(99,102,241,0.2)' : 'rgba(251,146,60,0.2)'}`,
            }}>
              <DollarSign className="w-4 h-4" style={{ color: g.netBalance >= 0 ? '#818cf8' : '#fb923c' }} />
            </div>
          </div>
          <p className="text-4xl font-bold font-mono tracking-tight animate-number delay-200" style={{
            color: g.netBalance >= 0 ? '#a5b4fc' : '#fb923c',
          }}>
            R$ {Math.abs(g.netBalance).toFixed(2)}
          </p>
          <p className="mt-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {g.netBalance >= 0 ? '✅ Saldo positivo da residência' : '⚠️ Saldo negativo da residência'}
          </p>
          <BalanceBar income={g.totalIncomes} expense={g.totalExpenses} />
        </div>
      </div>

      {/* ── Tabela por Pessoa ── */}
      <div className="glass-card overflow-hidden animate-slide-up delay-300">
        <div className="px-6 py-4 flex items-center justify-between" style={{
          borderBottom: '1px solid rgba(51,65,85,0.3)',
          background: 'rgba(2,8,23,0.4)',
        }}>
          <div className="flex items-center gap-2.5">
            <div style={{
              padding: '0.4rem', borderRadius: '0.55rem',
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
            }}>
              <Users className="w-3.5 h-3.5" style={{ color: '#818cf8' }} />
            </div>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
              Detalhamento por Morador
            </h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{
            background: 'rgba(51,65,85,0.3)',
            color: 'var(--color-text-muted)',
            border: '1px solid rgba(51,65,85,0.4)',
          }}>
            {persons.length} {persons.length === 1 ? 'morador' : 'moradores'}
          </span>
        </div>

        {persons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3 animate-fade-in">
            <LayoutDashboard className="w-8 h-8" style={{ color: 'var(--color-text-muted)' }} />
            <p style={{ color: 'var(--color-text-muted)' }}>Nenhum morador cadastrado ainda.</p>
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: 'rgba(51,65,85,0.2)' }}>
            {persons.map((p, i) => {
              const [bg, text] = avatarColor(p.personId);
              const initials = p.personName.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
              const total = p.totalIncomes + p.totalExpenses;
              const incomePct = total > 0 ? (p.totalIncomes / total) * 100 : 0;
              return (
                <li key={p.personId}
                  className="px-6 py-5 transition-all"
                  style={{ animation: `slide-up 0.35s ease both`, animationDelay: `${i * 0.07 + 0.3}s` }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div style={{
                      width: '2.75rem', height: '2.75rem', borderRadius: '50%', flexShrink: 0,
                      background: bg, border: `1.5px solid ${text}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.875rem', fontWeight: 700, color: text,
                      boxShadow: `0 0 14px ${text}22`,
                    }}>
                      {initials}
                    </div>

                    {/* Nome */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{p.personName}</p>
                      {/* Mini barra */}
                      <div className="mt-2" style={{ height: '3px', borderRadius: '99px', background: 'rgba(51,65,85,0.4)', overflow: 'hidden', maxWidth: '12rem' }}>
                        <div style={{
                          height: '100%', width: `${incomePct}%`,
                          background: 'linear-gradient(90deg, #6366f1, #22d3ee)',
                          borderRadius: '99px',
                          transition: 'width 1s ease',
                        }} />
                      </div>
                    </div>

                    {/* Valores */}
                    <div className="hidden sm:flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-text-muted)' }}>Receitas</p>
                        <p className="font-bold font-mono text-sm" style={{ color: '#34d399' }}>
                          R$ {p.totalIncomes.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-text-muted)' }}>Despesas</p>
                        <p className="font-bold font-mono text-sm" style={{ color: '#fb7185' }}>
                          R$ {p.totalExpenses.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Saldo líquido */}
                    <div className="text-right ml-4">
                      <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-text-muted)' }}>Saldo</p>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.75rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        fontFamily: 'JetBrains Mono, monospace',
                        background: p.netBalance >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                        color: p.netBalance >= 0 ? '#34d399' : '#fb7185',
                        border: `1px solid ${p.netBalance >= 0 ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
                      }}>
                        {p.netBalance >= 0 ? '+' : ''} R$ {p.netBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
