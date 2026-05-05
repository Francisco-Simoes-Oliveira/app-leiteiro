import { Router } from 'express';
import db from '../firebase.js';

const router = Router();
const COLLECTION = 'despesas';

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection(COLLECTION).orderBy('data', 'desc').get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { tipo, valor, data } = req.body;
    if (!tipo || valor === undefined || !data) {
      return res.status(400).json({ error: 'tipo, valor e data são obrigatórios' });
    }
    const registro = { tipo, valor: Number(valor), data };
    const docRef = await db.collection(COLLECTION).add(registro);
    res.status(201).json({ id: docRef.id, ...registro });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { tipo, valor, data } = req.body;
    if (!tipo || valor === undefined || !data) {
      return res.status(400).json({ error: 'tipo, valor e data são obrigatórios' });
    }
    const registro = { tipo, valor: Number(valor), data };
    await db.collection(COLLECTION).doc(req.params.id).update(registro);
    res.json({ id: req.params.id, ...registro });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.collection(COLLECTION).doc(req.params.id).delete();
    res.json({ message: 'Despesa removida' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
