import { useEffect, useState } from 'react';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertBadge from '../components/AlertBadge';

const TIPOS = ['vermífugo', 'carrapato', 'vacina', 'outros'];
const emptyForm = { vacaId: '', tipo: '', data: '', intervalo: '' };

function alertStatus(dateStr, intervalo) {
  if (!dateStr || !intervalo) return 'ok';
  const proxima = new Date(dateStr);
  proxima.setDate(proxima.getDate() + Number(intervalo));
  const now = new Date();
  const diff = (proxima - now) / (1000 * 60 * 60 * 24);
  if (diff < 0) return 'danger';
  if (diff <= 7) return 'warning';
  return 'ok';
}

function proximaData(dateStr, intervalo) {
  if (!dateStr || !intervalo) return '-';
  const d = new Date(dateStr);
  d.setDate(d.getDate() + Number(intervalo));
  return d.toLocaleDateString('pt-BR');
}

export default function Sanitario() {
  const [registros, setRegistros] = useState([]);
  const [vacas, setVacas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([api.getSanitario(), api.getVacas()])
      .then(([s, v]) => { setRegistros(s); setVacas(v); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await api.updateSanitario(editId, form);
      } else {
        await api.createSanitario(form);
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
    setForm({ vacaId: r.vacaId, tipo: r.tipo, data: r.data, intervalo: r.intervalo });
    setEditId(r.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Remover este registro?')) return;
    await api.deleteSanitario(id).catch(e => setError(e.message));
    load();
  };

  const nomeVaca = (id) => vacas.find(v => v.id === id)?.nome || id;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-800">💉 Controle Sanitário</h1>
        <button
          onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          + Registrar
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">{error}</div>}

      {showForm && (
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">{editId ? 'Editar Registro' : 'Novo Registro'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Vaca *</label>
              <select required className="w-full border rounded-lg px-3 py-2" value={form.vacaId} onChange={e => setForm(f => ({ ...f, vacaId: e.target.value }))}>
                <option value="">Selecione...</option>
                {vacas.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo *</label>
              <select required className="w-full border rounded-lg px-3 py-2" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                <option value="">Selecione...</option>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data *</label>
              <input required type="date" className="w-full border rounded-lg px-3 py-2" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Intervalo (dias) *</label>
              <input required type="number" min="1" className="w-full border rounded-lg px-3 py-2" value={form.intervalo} onChange={e => setForm(f => ({ ...f, intervalo: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
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
            <div key={r.id} className="bg-white rounded-xl shadow px-4 py-3 flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold capitalize">{r.tipo}</p>
                <p className="text-sm text-gray-500">{nomeVaca(r.vacaId)} • {new Date(r.data).toLocaleDateString('pt-BR')}</p>
                <p className="text-xs text-gray-400">Próxima: {proximaData(r.data, r.intervalo)} • Intervalo: {r.intervalo} dias</p>
              </div>
              <div className="flex items-center gap-2">
                <AlertBadge status={alertStatus(r.data, r.intervalo)} />
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
