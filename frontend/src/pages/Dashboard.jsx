import { useEffect, useState } from 'react';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertBadge from '../components/AlertBadge';

function addDays(dateStr, days) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d;
}

function alertStatus(targetDate) {
  if (!targetDate) return 'ok';
  const now = new Date();
  const diff = (targetDate - now) / (1000 * 60 * 60 * 24);
  if (diff < 0) return 'danger';
  if (diff <= 3) return 'warning';
  return 'ok';
}

export default function Dashboard() {
  const [vacas, setVacas] = useState([]);
  const [producao, setProducao] = useState([]);
  const [sanitario, setSanitario] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getVacas(),
      api.getProducao(),
      api.getSanitario(),
      api.getDespesas(),
    ]).then(([v, p, s, d]) => {
      setVacas(v);
      setProducao(p);
      setSanitario(s);
      setDespesas(d);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);

  const producaoHoje = producao.filter(p => p.data === today);
  const litrosHoje = producaoHoje.reduce((acc, p) => acc + (p.litros || 0), 0);

  const despesasMes = despesas.filter(d => d.data?.startsWith(currentMonth));
  const totalMes = despesasMes.reduce((acc, d) => acc + (d.valor || 0), 0);

  const alertasSanitario = sanitario.map(s => ({
    ...s,
    proxima: addDays(s.data, s.intervalo),
  })).filter(s => alertStatus(s.proxima) !== 'ok');

  const alertasCio = vacas.filter(v => v.ultimoCio).map(v => ({
    ...v,
    proximoCio: addDays(v.ultimoCio, 21),
  })).filter(v => alertStatus(v.proximoCio) !== 'ok');

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-800">📊 Dashboard</h1>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{vacas.length}</p>
          <p className="text-sm text-gray-500 mt-1">Vacas cadastradas</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{litrosHoje.toFixed(1)}L</p>
          <p className="text-sm text-gray-500 mt-1">Produção hoje</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">{alertasCio.length + alertasSanitario.length}</p>
          <p className="text-sm text-gray-500 mt-1">Alertas ativos</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-3xl font-bold text-red-600">R$ {totalMes.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Despesas do mês</p>
        </div>
      </div>

      {/* Alertas de cio */}
      {alertasCio.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-lg mb-3 text-orange-700">🔔 Alertas de Cio</h2>
          <div className="space-y-2">
            {alertasCio.map(v => (
              <div key={v.id} className="flex items-center justify-between bg-orange-50 rounded-lg px-3 py-2">
                <span className="font-medium">{v.nome}</span>
                <div className="text-right text-sm">
                  <p className="text-gray-600">Próximo cio: {v.proximoCio?.toLocaleDateString('pt-BR')}</p>
                  <AlertBadge status={alertStatus(v.proximoCio)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alertas sanitários */}
      {alertasSanitario.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-lg mb-3 text-purple-700">💉 Alertas Sanitários</h2>
          <div className="space-y-2">
            {alertasSanitario.map(s => (
              <div key={s.id} className="flex items-center justify-between bg-purple-50 rounded-lg px-3 py-2">
                <div>
                  <p className="font-medium">{s.tipo}</p>
                  <p className="text-xs text-gray-500">Vaca: {s.vacaId}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-gray-600">Próxima: {s.proxima?.toLocaleDateString('pt-BR')}</p>
                  <AlertBadge status={alertStatus(s.proxima)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status das vacas */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-lg mb-3 text-green-700">🐄 Status do Rebanho</h2>
        <div className="flex gap-4 flex-wrap">
          {['lactando', 'seca', 'prenha'].map(s => {
            const count = vacas.filter(v => v.status === s).length;
            const colors = { lactando: 'bg-green-100 text-green-800', seca: 'bg-gray-100 text-gray-800', prenha: 'bg-pink-100 text-pink-800' };
            return (
              <div key={s} className={`px-4 py-2 rounded-lg text-sm font-semibold ${colors[s]}`}>
                {count} {s}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
