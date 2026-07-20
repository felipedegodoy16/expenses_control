import { useEffect, useState } from 'react';
import api from '../api';

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
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard de Totais</h1>
      
      <div className="bg-white rounded shadow mb-8">
        <h2 className="text-lg font-semibold p-4 border-b bg-gray-50">Totais por Pessoa</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4">Nome</th>
              <th className="p-4">Receitas</th>
              <th className="p-4">Despesas</th>
              <th className="p-4">Saldo Líquido</th>
            </tr>
          </thead>
          <tbody>
            {totals.persons.map(p => (
              <tr key={p.personId} className="border-b">
                <td className="p-4">{p.personName}</td>
                <td className="p-4 text-green-600">R$ {p.totalIncomes.toFixed(2)}</td>
                <td className="p-4 text-red-600">R$ {p.totalExpenses.toFixed(2)}</td>
                <td className={`p-4 font-bold ${p.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {p.netBalance.toFixed(2)}
                </td>
              </tr>
            ))}
            {totals.persons.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Nenhuma pessoa cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Total Geral</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-4 rounded border border-green-100">
            <p className="text-green-800 text-sm font-semibold uppercase tracking-wider mb-1">Total de Receitas</p>
            <p className="text-3xl font-bold text-green-600">R$ {totals.global.totalIncomes.toFixed(2)}</p>
          </div>
          <div className="bg-red-50 p-4 rounded border border-red-100">
            <p className="text-red-800 text-sm font-semibold uppercase tracking-wider mb-1">Total de Despesas</p>
            <p className="text-3xl font-bold text-red-600">R$ {totals.global.totalExpenses.toFixed(2)}</p>
          </div>
          <div className={`p-4 rounded border ${totals.global.netBalance >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
            <p className={`text-sm font-semibold uppercase tracking-wider mb-1 ${totals.global.netBalance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>Saldo Líquido Geral</p>
            <p className={`text-3xl font-bold ${totals.global.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              R$ {totals.global.netBalance.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
