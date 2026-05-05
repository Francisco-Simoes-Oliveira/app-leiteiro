import { useEffect, useState } from 'react';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const TIPOS = ['ração', 'medicamento', 'veterinário', 'equipamento', 'outros'];
const emptyForm = { tipo: '', valor: '', data: '' };

export default function Despesas() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterMes, setFilterMes] = useState(new Date().toISOString().slice(0, 7));
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.getDespesas().then(setRegistros).catch(e => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await api.updateDespesa(editId, form);
      } else {
        await api.createDespesa(form);
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEdit = (r) => {
    setForm({ tipo: r.tipo, valor: r.valor, data: r.data });
    setEditId(r.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Remover esta despesa?')) return;
    await api.deleteDespesa(id).catch(e => setError(e.message));
    load();
  };

  const filtered = filterMes ? registros.filter(r => r.data?.startsWith(filterMes)) : registros;
  const totalFiltrado = filtered.reduce((acc, r) => acc + (r.valor || 0), 0);
  const totalGeral = registros.reduce((acc, r) => acc + (r.valor || 0), 0);

  const porTipo = TIPOS.map(tipo => ({
    tipo,
    total: filtered.filter(r => r.tipo === tipo).reduce((acc, r) => acc + (r.valor || 0), 0),
  })).filter(t => t.total > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-800">💰 Despesas</h1>
        <button
          onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          + Registrar
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">{error}</div>}

      {/* Filtro e resumo */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-4 items-start justify-between">
        <div>
          <label className="text-sm font-medium mr-2">Filtrar mês:</label>
          <input
            type="month"
            className="border rounded-lg px-3 py-1.5 text-sm"
            value={filterMes}
            onChange={e => setFilterMes(e.target.value)}
          />
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total do período: <strong className="text-red-600 text-lg">R$ {totalFiltrado.toFixed(2)}</strong></p>
          <p className="text-xs text-gray-400">Total geral: R$ {totalGeral.toFixed(2)}</p>
        </div>
      </div>

      {/* Resumo por tipo */}
      {porTipo.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-sm text-gray-600 mb-2">Resumo por tipo</h3>
          <div className="flex flex-wrap gap-2">
            {porTipo.map(({ tipo, total }) => (
              <div key={tipo} className="bg-orange-50 px-3 py-1.5 rounded-lg text-sm">
                <span className="font-medium capitalize">{tipo}:</span> <span className="text-red-700 font-semibold">R$ {total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">{editId ? 'Editar Despesa' : 'Nova Despesa'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo *</label>
              <select required className="w-full border rounded-lg px-3 py-2" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                <option value="">Selecione...</option>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valor (R$) *</label>
              <input required type="number" min="0" step="0.01" className="w-full border rounded-lg px-3 py-2" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data *</label>
              <input required type="date" className="w-full border rounded-lg px-3 py-2" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
            </div>
            <div className="sm:col-span-3 flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
              <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700">Salvar</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-2">
          {filtered.length === 0 && <p className="text-gray-500 text-center py-8">Nenhuma despesa encontrada.</p>}
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-xl shadow px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold capitalize">{r.tipo}</p>
                <p className="text-sm text-gray-500">{new Date(r.data).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-red-700">R$ {Number(r.valor).toFixed(2)}</span>
                <button onClick={() => handleEdit(r)} className="text-blue-600 hover:underline text-sm">Editar</button>
                <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline text-sm">Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
