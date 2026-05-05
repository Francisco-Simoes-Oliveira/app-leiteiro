import { Router } from 'express';
import db from '../firebase.js';

const router = Router();
const COLLECTION = 'sanitario';

router.get('/', async (req, res) => {
  try {
    let query = db.collection(COLLECTION).orderBy('data', 'desc');
    if (req.query.vacaId) {
      query = db.collection(COLLECTION).where('vacaId', '==', req.query.vacaId).orderBy('data', 'desc');
    }
    const snapshot = await query.get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { vacaId, tipo, data, intervalo } = req.body;
    if (!vacaId || !tipo || !data || intervalo === undefined) {
      return res.status(400).json({ error: 'vacaId, tipo, data e intervalo são obrigatórios' });
    }
    const registro = { vacaId, tipo, data, intervalo: Number(intervalo) };
    const docRef = await db.collection(COLLECTION).add(registro);
    res.status(201).json({ id: docRef.id, ...registro });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { vacaId, tipo, data, intervalo } = req.body;
    if (!vacaId || !tipo || !data || intervalo === undefined) {
      return res.status(400).json({ error: 'vacaId, tipo, data e intervalo são obrigatórios' });
    }
    const registro = { vacaId, tipo, data, intervalo: Number(intervalo) };
    await db.collection(COLLECTION).doc(req.params.id).update(registro);
    res.json({ id: req.params.id, ...registro });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.collection(COLLECTION).doc(req.params.id).delete();
    res.json({ message: 'Registro sanitário removido' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
