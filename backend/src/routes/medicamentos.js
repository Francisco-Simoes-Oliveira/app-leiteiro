import { Router } from 'express';
import db from '../firebase.js';

const router = Router();
const COLLECTION = 'medicamentos';

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
    const { vacaId, nome, data, carencia } = req.body;
    if (!vacaId || !nome || !data || carencia === undefined) {
      return res.status(400).json({ error: 'vacaId, nome, data e carencia são obrigatórios' });
    }
    const registro = { vacaId, nome, data, carencia: Number(carencia) };
    const docRef = await db.collection(COLLECTION).add(registro);
    res.status(201).json({ id: docRef.id, ...registro });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { vacaId, nome, data, carencia } = req.body;
    if (!vacaId || !nome || !data || carencia === undefined) {
      return res.status(400).json({ error: 'vacaId, nome, data e carencia são obrigatórios' });
    }
    const registro = { vacaId, nome, data, carencia: Number(carencia) };
    await db.collection(COLLECTION).doc(req.params.id).update(registro);
    res.json({ id: req.params.id, ...registro });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.collection(COLLECTION).doc(req.params.id).delete();
    res.json({ message: 'Medicamento removido' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
