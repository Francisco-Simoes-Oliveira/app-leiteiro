import { Router } from 'express';
import db from '../firebase.js';

const router = Router();
const COLLECTION = 'producao';

// Listar toda produção (ou filtrar por vacaId)
router.get('/', async (req, res) => {
  try {
    let query = db.collection(COLLECTION).orderBy('data', 'desc');
    if (req.query.vacaId) {
      query = db.collection(COLLECTION).where('vacaId', '==', req.query.vacaId).orderBy('data', 'desc');
    }
    const snapshot = await query.get();
    const registros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(registros);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar registro de produção
router.post('/', async (req, res) => {
  try {
    const { vacaId, data, litros } = req.body;
    if (!vacaId || !data || litros === undefined) {
      return res.status(400).json({ error: 'vacaId, data e litros são obrigatórios' });
    }
    const registro = { vacaId, data, litros: Number(litros) };
    const docRef = await db.collection(COLLECTION).add(registro);
    res.status(201).json({ id: docRef.id, ...registro });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar registro
router.put('/:id', async (req, res) => {
  try {
    const { vacaId, data, litros } = req.body;
    if (!vacaId || !data || litros === undefined) {
      return res.status(400).json({ error: 'vacaId, data e litros são obrigatórios' });
    }
    const registro = { vacaId, data, litros: Number(litros) };
    await db.collection(COLLECTION).doc(req.params.id).update(registro);
    res.json({ id: req.params.id, ...registro });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar registro
router.delete('/:id', async (req, res) => {
  try {
    await db.collection(COLLECTION).doc(req.params.id).delete();
    res.json({ message: 'Registro removido' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
