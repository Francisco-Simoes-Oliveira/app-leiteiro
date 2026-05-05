import { useEffect, useState } from 'react';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const emptyForm = { vacaId: '', data: '', litros: '' };

export default function Producao() {
  const [registros, setRegistros] = useState([]);
  const [vacas, setVacas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterVaca, setFilterVaca] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([api.getProducao(filterVaca || undefined), api.getVacas()])
      .then(([p, v]) => { setRegistros(p); setVacas(v); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filterVaca]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await api.updateProducao(editId, form);
      } else {
        await api.createProducao(form);
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
    setForm({ vacaId: r.vacaId, data: r.data, litros: r.litros });
    setEditId(r.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Remover este registro?')) return;
    await api.deleteProducao(id).catch(e => setError(e.message));
    load();
  };

  const nomeVaca = (id) => vacas.find(v => v.id === id)?.nome || id;

  const totalLitros = registros.reduce((acc, r) => acc + (r.litros || 0), 0);
  const mediaLitros = registros.length ? (totalLitros / registros.length).toFixed(2) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-800">🥛 Produção de Leite</h1>
        <button
          onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          + Registrar
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">{error}</div>}

      {/* Filtro e resumo */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <label className="text-sm font-medium mr-2">Filtrar por vaca:</label>
          <select
            className="border rounded-lg px-3 py-1.5 text-sm"
            value={filterVaca}
            onChange={e => setFilterVaca(e.target.value)}
          >
            <option value="">Todas</option>
            {vacas.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
          </select>
        </div>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Total: <strong className="text-blue-700">{totalLitros.toFixed(1)}L</strong></span>
          <span>Média/registro: <strong className="text-blue-700">{mediaLitros}L</strong></span>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">{editId ? 'Editar Registro' : 'Novo Registro'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Vaca *</label>
              <select
                required
                className="w-full border rounded-lg px-3 py-2"
                value={form.vacaId}
                onChange={e => setForm(f => ({ ...f, vacaId: e.target.value }))}
              >
                <option value="">Selecione...</option>
                {vacas.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data *</label>
              <input
                required type="date"
                className="w-full border rounded-lg px-3 py-2"
                value={form.data}
                onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Litros *</label>
              <input
                required type="number" step="0.1" min="0"
                className="w-full border rounded-lg px-3 py-2"
                value={form.litros}
                onChange={e => setForm(f => ({ ...f, litros: e.target.value }))}
              />
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
          {registros.length === 0 && <p className="text-gray-500 text-center py-8">Nenhum registro encontrado.</p>}
          {registros.map(r => (
            <div key={r.id} className="bg-white rounded-xl shadow px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold">{nomeVaca(r.vacaId)}</p>
                <p className="text-sm text-gray-500">{new Date(r.data).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-blue-700">{r.litros}L</span>
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
