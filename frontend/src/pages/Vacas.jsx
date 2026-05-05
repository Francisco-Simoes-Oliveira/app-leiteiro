import { useEffect, useState } from 'react';
import { api } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_OPTIONS = ['lactando', 'seca', 'prenha'];

const emptyForm = { nome: '', raca: '', nascimento: '', status: 'lactando', ultimoCio: '' };

export default function Vacas() {
  const [vacas, setVacas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.getVacas().then(setVacas).catch(e => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await api.updateVaca(editId, form);
      } else {
        await api.createVaca(form);
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEdit = (vaca) => {
    setForm({ nome: vaca.nome, raca: vaca.raca || '', nascimento: vaca.nascimento || '', status: vaca.status, ultimoCio: vaca.ultimoCio || '' });
    setEditId(vaca.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Remover esta vaca?')) return;
    await api.deleteVaca(id).catch(e => setError(e.message));
    load();
  };

  function proximoCio(ultimoCio) {
    if (!ultimoCio) return '-';
    const d = new Date(ultimoCio);
    d.setDate(d.getDate() + 21);
    return d.toLocaleDateString('pt-BR');
  }

  const statusColors = { lactando: 'bg-green-100 text-green-800', seca: 'bg-gray-100 text-gray-800', prenha: 'bg-pink-100 text-pink-800' };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-800">🐄 Vacas</h1>
        <button
          onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          + Cadastrar
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">{error}</div>}

      {showForm && (
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">{editId ? 'Editar Vaca' : 'Nova Vaca'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome *</label>
              <input
                required
                className="w-full border rounded-lg px-3 py-2"
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Raça</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.raca}
                onChange={e => setForm(f => ({ ...f, raca: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nascimento</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                value={form.nascimento}
                onChange={e => setForm(f => ({ ...f, nascimento: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status *</label>
              <select
                required
                className="w-full border rounded-lg px-3 py-2"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              >
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Último Cio</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                value={form.ultimoCio}
                onChange={e => setForm(f => ({ ...f, ultimoCio: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
              <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700">Salvar</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {vacas.length === 0 && <p className="text-gray-500 text-center py-8">Nenhuma vaca cadastrada ainda.</p>}
          {vacas.map(v => (
            <div key={v.id} className="bg-white rounded-xl shadow px-4 py-3 flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-800">{v.nome}</p>
                <p className="text-sm text-gray-500">{v.raca || 'Raça não informada'} {v.nascimento && `• Nasc: ${new Date(v.nascimento).toLocaleDateString('pt-BR')}`}</p>
                {v.ultimoCio && <p className="text-xs text-orange-600 mt-0.5">Próximo cio: {proximoCio(v.ultimoCio)}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[v.status] || 'bg-gray-100'}`}>{v.status}</span>
                <button onClick={() => handleEdit(v)} className="text-blue-600 hover:underline text-sm">Editar</button>
                <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:underline text-sm">Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
