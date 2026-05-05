import { Router } from 'express';
import db from '../firebase.js';

const router = Router();
const COLLECTION = 'vacas';

// Listar todas as vacas
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection(COLLECTION).orderBy('nome').get();
    const vacas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(vacas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar vaca por ID
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection(COLLECTION).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Vaca não encontrada' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar vaca
router.post('/', async (req, res) => {
  try {
    const { nome, raca, nascimento, status, ultimoCio } = req.body;
    if (!nome || !status) {
      return res.status(400).json({ error: 'Nome e status são obrigatórios' });
    }
    const data = { nome, raca: raca || '', nascimento: nascimento || '', status, ultimoCio: ultimoCio || null };
    const docRef = await db.collection(COLLECTION).add(data);
    res.status(201).json({ id: docRef.id, ...data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar vaca
router.put('/:id', async (req, res) => {
  try {
    const { nome, raca, nascimento, status, ultimoCio } = req.body;
    if (!nome || !status) {
      return res.status(400).json({ error: 'Nome e status são obrigatórios' });
    }
    const data = { nome, raca: raca || '', nascimento: nascimento || '', status, ultimoCio: ultimoCio || null };
    await db.collection(COLLECTION).doc(req.params.id).update(data);
    res.json({ id: req.params.id, ...data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar vaca
router.delete('/:id', async (req, res) => {
  try {
    await db.collection(COLLECTION).doc(req.params.id).delete();
    res.json({ message: 'Vaca removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
