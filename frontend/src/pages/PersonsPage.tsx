import { useEffect, useState } from 'react';
import api from '../api';
import { Users, UserPlus, Trash2, ChevronRight } from 'lucide-react';

interface Person {
  id: number;
  name: string;
  age: number;
}

/* Retorna iniciais para o avatar */
const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

/* Cores de avatar estáveis por ID */
const AVATAR_COLORS = [
  ['rgba(99,102,241,0.2)', '#818cf8'],
  ['rgba(34,211,238,0.2)', '#22d3ee'],
  ['rgba(16,185,129,0.2)', '#34d399'],
  ['rgba(251,146,60,0.2)', '#fb923c'],
  ['rgba(244,63,94,0.18)', '#fb7185'],
];
const avatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];

export default function PersonsPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [name, setName]       = useState('');
  const [age, setAge]         = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const loadPersons = async () => {
    try {
      const { data } = await api.get<Person[]>('/persons');
      setPersons(data);
    } catch (err) {
      console.error('Erro ao buscar pessoas:', err);
    }
  };

  useEffect(() => { loadPersons(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/persons', { name, age: parseInt(age) });
      setName(''); setAge('');
      await loadPersons();
    } catch (err) {
      console.error('Erro ao criar pessoa:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      await api.delete(`/persons/${id}`);
      setPersons(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Erro ao deletar pessoa:', err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="animate-slide-up">

      {/* ── Header ── */}
      <header className="mb-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#818cf8' }}>Cadastro</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            Gestão de Pessoas
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Gerencie os moradores da residência
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
          <Users className="w-4 h-4" />
          {persons.length} {persons.length === 1 ? 'morador' : 'moradores'}
        </div>
      </header>

      <div className="shimmer-divider mb-10" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Formulário ── */}
        <aside className="lg:col-span-1 animate-left delay-100">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <div style={{
                padding: '0.5rem',
                borderRadius: '0.6rem',
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.25)',
              }}>
                <UserPlus className="w-4 h-4" style={{ color: '#818cf8' }} />
              </div>
              <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Novo Morador</h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input-field"
                  placeholder="Ex: João Silva"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  Idade
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="input-field"
                  placeholder="Ex: 25"
                  required min="0"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 px-4 mt-2 flex items-center justify-center gap-2">
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {loading ? 'Cadastrando...' : 'Cadastrar Morador'}
                </span>
              </button>
            </form>

            {/* Dica */}
            <div className="mt-5 p-3.5 rounded-xl text-xs" style={{
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.12)',
              color: 'var(--color-text-muted)',
            }}>
              💡 Ao excluir um morador, <span style={{ color: '#a5b4fc' }}>todas as transações</span> vinculadas a ele também serão removidas.
            </div>
          </div>
        </aside>

        {/* ── Lista ── */}
        <section className="lg:col-span-2 animate-slide-up delay-150">
          <div className="glass-card overflow-hidden">
            {/* Cabeçalho da tabela */}
            <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(51,65,85,0.3)', background: 'rgba(2,8,23,0.3)' }}>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                Lista de Moradores
              </h2>
            </div>

            {persons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
                <div style={{
                  padding: '1.25rem',
                  borderRadius: '50%',
                  background: 'rgba(51,65,85,0.2)',
                  border: '1px solid rgba(51,65,85,0.4)',
                }}>
                  <Users className="w-8 h-8" style={{ color: 'var(--color-text-muted)' }} />
                </div>
                <p className="font-medium" style={{ color: 'var(--color-text-muted)' }}>Nenhum morador cadastrado</p>
                <p className="text-sm" style={{ color: '#334155' }}>Use o formulário ao lado para adicionar.</p>
              </div>
            ) : (
              <ul className="divide-y" style={{ borderColor: 'rgba(51,65,85,0.2)' }}>
                {persons.map((person, i) => {
                  const [bg, text] = avatarColor(person.id);
                  return (
                    <li key={person.id}
                      className="flex items-center gap-4 px-6 py-4 group transition-all duration-200"
                      style={{
                        animation: `slide-up 0.35s ease both`,
                        animationDelay: `${i * 0.05}s`,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: '2.5rem', height: '2.5rem', borderRadius: '50%', flexShrink: 0,
                        background: bg, border: `1px solid ${text}33`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8125rem', fontWeight: 700, color: text,
                        boxShadow: `0 0 12px ${text}22`,
                      }}>
                        {getInitials(person.name)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{person.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>ID #{person.id}</span>
                          <span style={{ color: '#334155' }}>·</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: person.age < 18 ? 'rgba(251,146,60,0.12)' : 'rgba(51,65,85,0.3)',
                              color: person.age < 18 ? '#fb923c' : 'var(--color-text-secondary)',
                              border: `1px solid ${person.age < 18 ? 'rgba(251,146,60,0.2)' : 'rgba(51,65,85,0.4)'}`,
                            }}>
                            {person.age} anos {person.age < 18 ? '· Menor' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Botão excluir */}
                      <button
                        onClick={() => handleDelete(person.id)}
                        disabled={deleting === person.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all opacity-0 group-hover:opacity-100"
                        style={{
                          background: 'rgba(244,63,94,0.08)',
                          color: '#fb7185',
                          border: '1px solid rgba(244,63,94,0.18)',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.18)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.08)';
                        }}
                      >
                        {deleting === person.id
                          ? <span className="w-3 h-3 border-2 border-rose-400/30 border-t-rose-400 rounded-full" style={{ animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                          : <Trash2 className="w-3.5 h-3.5" />
                        }
                        Excluir
                      </button>
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
