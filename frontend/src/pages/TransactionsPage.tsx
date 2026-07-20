import { useEffect, useState } from 'react';
import api from '../api';
import { CreditCard, PlusCircle, AlertCircle, ArrowUpCircle, ArrowDownCircle, Receipt } from 'lucide-react';

interface Person   { id: number; name: string; age: number; }
interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 0 | 1;
  personId: number;
  person?: Person;
}

const AVATAR_COLORS = [
  ['rgba(99,102,241,0.2)', '#818cf8'],
  ['rgba(34,211,238,0.2)', '#22d3ee'],
  ['rgba(16,185,129,0.2)', '#34d399'],
  ['rgba(251,146,60,0.2)', '#fb923c'],
  ['rgba(244,63,94,0.18)', '#fb7185'],
];
const avatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];
const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [persons, setPersons]           = useState<Person[]>([]);
  const [description, setDescription]  = useState('');
  const [amount, setAmount]             = useState('');
  const [type, setType]                 = useState<0 | 1>(0);
  const [personId, setPersonId]         = useState('');
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  const loadData = async () => {
    try {
      const [transRes, persRes] = await Promise.all([
        api.get<Transaction[]>('/transactions'),
        api.get<Person[]>('/persons'),
      ]);
      setTransactions(transRes.data);
      setPersons(persRes.data);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/transactions', {
        description,
        amount: parseFloat(amount),
        type,
        personId: parseInt(personId),
      });
      setDescription(''); setAmount(''); setType(0); setPersonId('');
      await loadData();
    } catch (err: any) {
      setError(err.response?.data || 'Erro ao criar transação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up">

      {/* ── Header ── */}
      <header className="mb-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#818cf8' }}>Financeiro</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            Registro de Transações
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Receitas e despesas por morador
          </p>
        </div>
        <div style={{
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '0.85rem',
          padding: '0.6rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#a5b4fc',
          fontSize: '0.875rem',
          fontWeight: 600,
        }}>
          <Receipt className="w-4 h-4" />
          {transactions.length} {transactions.length === 1 ? 'registro' : 'registros'}
        </div>
      </header>

      <div className="shimmer-divider mb-10" />

      {/* ── Alert de erro ── */}
      {error && (
        <div className="mb-8 flex items-start gap-3 px-4 py-3.5 rounded-xl animate-slide-up" style={{
          background: 'rgba(244,63,94,0.08)',
          border: '1px solid rgba(244,63,94,0.2)',
          color: '#fb7185',
        }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Formulário ── */}
        <aside className="lg:col-span-1 animate-left delay-100">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <div style={{
                padding: '0.5rem', borderRadius: '0.6rem',
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.25)',
              }}>
                <PlusCircle className="w-4 h-4" style={{ color: '#818cf8' }} />
              </div>
              <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Nova Transação</h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  Descrição
                </label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)}
                  className="input-field" placeholder="Ex: Conta de Luz" required />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  Valor (R$)
                </label>
                <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)}
                  className="input-field" placeholder="0,00" required min="0" />
              </div>

              {/* Tipo — toggle visual */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  Tipo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {([0, 1] as const).map(t => (
                    <button key={t} type="button" onClick={() => setType(t)}
                      style={{
                        padding: '0.625rem',
                        borderRadius: '0.65rem',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        border: '1px solid',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.375rem',
                        ...(type === t && t === 0
                          ? { background: 'rgba(244,63,94,0.15)', borderColor: 'rgba(244,63,94,0.35)', color: '#fb7185' }
                          : type === t && t === 1
                          ? { background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.35)', color: '#34d399' }
                          : { background: 'rgba(15,23,42,0.5)', borderColor: 'rgba(51,65,85,0.4)', color: 'var(--color-text-muted)' }),
                      }}
                    >
                      {t === 0 ? <ArrowDownCircle className="w-3.5 h-3.5" /> : <ArrowUpCircle className="w-3.5 h-3.5" />}
                      {t === 0 ? 'Despesa' : 'Receita'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  Morador
                </label>
                <select value={personId} onChange={e => setPersonId(e.target.value)}
                  className="input-field" required
                  style={{ cursor: 'pointer' }}>
                  <option value="" disabled>Selecionar morador...</option>
                  {persons.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.age} anos)
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 px-4 mt-2">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                    : <PlusCircle className="w-4 h-4" />
                  }
                  {loading ? 'Registrando...' : 'Registrar Transação'}
                </span>
              </button>
            </form>
          </div>
        </aside>

        {/* ── Lista ── */}
        <section className="lg:col-span-2 animate-slide-up delay-150">
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(51,65,85,0.3)', background: 'rgba(2,8,23,0.3)' }}>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Histórico de Transações</h2>
            </div>

            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
                <div style={{
                  padding: '1.25rem', borderRadius: '50%',
                  background: 'rgba(51,65,85,0.2)', border: '1px solid rgba(51,65,85,0.4)',
                }}>
                  <CreditCard className="w-8 h-8" style={{ color: 'var(--color-text-muted)' }} />
                </div>
                <p className="font-medium" style={{ color: 'var(--color-text-muted)' }}>Nenhuma transação registrada</p>
              </div>
            ) : (
              <ul className="divide-y" style={{ borderColor: 'rgba(51,65,85,0.2)' }}>
                {transactions.map((t, i) => {
                  const [bg, text] = t.person ? avatarColor(t.personId) : ['rgba(51,65,85,0.2)', '#64748b'];
                  return (
                    <li key={t.id}
                      className="flex items-center gap-4 px-6 py-4 transition-all duration-200"
                      style={{ animation: `slide-up 0.35s ease both`, animationDelay: `${i * 0.04}s` }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Ícone de tipo */}
                      <div style={{
                        padding: '0.6rem', borderRadius: '0.6rem', flexShrink: 0,
                        background: t.type === 1 ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
                        border: `1px solid ${t.type === 1 ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
                      }}>
                        {t.type === 1
                          ? <ArrowUpCircle className="w-4 h-4" style={{ color: '#34d399' }} />
                          : <ArrowDownCircle className="w-4 h-4" style={{ color: '#fb7185' }} />
                        }
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{t.description}</p>
                        {t.person && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div style={{
                              width: '1.1rem', height: '1.1rem', borderRadius: '50%',
                              background: bg, border: `1px solid ${text}44`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.55rem', fontWeight: 700, color: text,
                            }}>
                              {getInitials(t.person.name)}
                            </div>
                            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{t.person.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Valor + badge */}
                      <div className="text-right">
                        <p className="font-bold font-mono text-sm" style={{ color: t.type === 1 ? '#34d399' : '#fb7185' }}>
                          {t.type === 1 ? '+' : '-'} R$ {t.amount.toFixed(2)}
                        </p>
                        <span className={t.type === 1 ? 'badge-income' : 'badge-expense'} style={{ marginTop: '0.3rem' }}>
                          {t.type === 1 ? 'Receita' : 'Despesa'}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
