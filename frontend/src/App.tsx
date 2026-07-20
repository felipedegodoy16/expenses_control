import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PersonsPage from './pages/PersonsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-xl font-extrabold text-blue-700 tracking-tight">Finances</h2>
          </div>
          <nav className="flex-1 p-4 flex flex-col gap-2">
            <Link to="/" className="px-4 py-2 rounded hover:bg-gray-100 font-medium transition-colors">Dashboard Totais</Link>
            <Link to="/persons" className="px-4 py-2 rounded hover:bg-gray-100 font-medium transition-colors">Pessoas</Link>
            <Link to="/transactions" className="px-4 py-2 rounded hover:bg-gray-100 font-medium transition-colors">Transações</Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<div className="p-8"><h2>Dashboard em breve...</h2></div>} />
            <Route path="/persons" element={<PersonsPage />} />
            <Route path="/transactions" element={<div className="p-8"><h2>Transações em breve...</h2></div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
