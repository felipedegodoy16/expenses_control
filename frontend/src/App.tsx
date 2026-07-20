import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Wallet } from 'lucide-react';
import PersonsPage from './pages/PersonsPage';
import TransactionsPage from './pages/TransactionsPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-200 flex font-sans selection:bg-indigo-500/30">
        {/* Sidebar */}
        <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col transition-all">
          <div className="p-8 border-b border-slate-800/50 flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Wallet className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
              FinTrack
            </h2>
          </div>
          <nav className="flex-1 p-6 flex flex-col gap-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Menu Principal</p>
            
            <NavLink 
              to="/" 
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-indigo-500/10 text-indigo-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] ring-1 ring-indigo-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard Totais
            </NavLink>
            
            <NavLink 
              to="/persons" 
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-indigo-500/10 text-indigo-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] ring-1 ring-indigo-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <Users className="w-5 h-5" />
              Pessoas
            </NavLink>
            
            <NavLink 
              to="/transactions" 
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-indigo-500/10 text-indigo-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] ring-1 ring-indigo-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <CreditCard className="w-5 h-5" />
              Transações
            </NavLink>
          </nav>
          
          <div className="p-6 border-t border-slate-800/50">
            <div className="bg-slate-800/30 rounded-xl p-4 ring-1 ring-slate-700/50">
              <p className="text-sm text-slate-400">Desenvolvido para avaliação técnica.</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
          <div className="relative z-10 p-10 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/persons" element={<PersonsPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
