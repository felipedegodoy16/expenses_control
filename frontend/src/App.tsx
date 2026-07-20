import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Wallet, Github } from 'lucide-react';
import PersonsPage from './pages/PersonsPage';
import TransactionsPage from './pages/TransactionsPage';
import DashboardPage from './pages/DashboardPage';

const NAV_ITEMS = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard',   sub: 'Visão geral' },
  { to: '/persons',     icon: Users,           label: 'Pessoas',     sub: 'Moradores' },
  { to: '/transactions',icon: CreditCard,      label: 'Transações',  sub: 'Receitas & Despesas' },
];

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex" style={{ background: 'var(--color-bg-primary)', fontFamily: 'Inter, sans-serif' }}>

        {/* ── Sidebar ── */}
        <aside className="sidebar-glow w-72 flex-shrink-0 flex flex-col" style={{
          background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(9,14,30,0.98) 100%)',
          borderRight: '1px solid rgba(51,65,85,0.4)',
          minHeight: '100vh',
        }}>
          {/* Logo */}
          <div className="p-7 animate-fade-in" style={{ borderBottom: '1px solid rgba(51,65,85,0.3)' }}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(34,211,238,0.15))',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: '0.75rem',
                  padding: '0.6rem',
                  boxShadow: '0 0 20px rgba(99,102,241,0.2)',
                }}>
                  <Wallet className="w-6 h-6" style={{ color: '#818cf8' }} />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text tracking-tight">FinTrack</h1>
                <p className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Controle Residencial</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-5 space-y-1 animate-slide-up delay-100">
            <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Navegação
            </p>
            {NAV_ITEMS.map(({ to, icon: Icon, label, sub }, i) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `nav-item flex items-center gap-3.5 px-3.5 py-3 rounded-xl ${isActive ? 'nav-active' : ''}`
                }
                style={({ isActive }) => ({
                  color: isActive ? '#a5b4fc' : 'var(--color-text-secondary)',
                  animationDelay: `${i * 0.07 + 0.1}s`,
                })}
              >
                {({ isActive }) => (
                  <>
                    <div style={{
                      padding: '0.45rem',
                      borderRadius: '0.6rem',
                      background: isActive ? 'rgba(99,102,241,0.18)' : 'rgba(51,65,85,0.25)',
                      border: `1px solid ${isActive ? 'rgba(99,102,241,0.25)' : 'rgba(51,65,85,0.4)'}`,
                      transition: 'all 0.2s',
                    }}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-tight">{label}</p>
                      <p className="text-xs leading-tight" style={{ color: 'var(--color-text-muted)' }}>{sub}</p>
                    </div>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#818cf8', boxShadow: '0 0 6px #818cf8' }} />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer da sidebar */}
          <div className="p-5 animate-fade-in delay-400" style={{ borderTop: '1px solid rgba(51,65,85,0.3)' }}>
            <a
              href="https://github.com/felipedegodoy16/expenses_control"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all hover:bg-slate-800/50"
              style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}
            >
              <Github className="w-4 h-4 flex-shrink-0" />
              <span>Ver repositório</span>
            </a>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 overflow-y-auto relative">
          {/* Fundo decorativo */}
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, height: '100vh',
            background: 'radial-gradient(ellipse 80% 50% at 60% -10%, rgba(99,102,241,0.07) 0%, transparent 60%)',
            pointerEvents: 'none', zIndex: 0,
          }} />
          <div className="relative z-10 p-10 max-w-6xl mx-auto">
            <Routes>
              <Route path="/"             element={<DashboardPage />} />
              <Route path="/persons"      element={<PersonsPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
