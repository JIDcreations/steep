// routes/teaTypes.js
import express from 'express';
import TeaType from '../models/TeaType.js';

const router = express.Router();

// lijst
router.get('/', async (_req, res) => {
  try { res.json(await TeaType.find().sort({ name: 1 })); }
  catch (e) { res.status(500).json({ message: 'Error fetching tea types', error: e }); }
});

// één type
router.get('/:id', async (req, res) => {
  try {
    const t = await TeaType.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'TeaType not found' });
    res.json(t);
  } catch (e) { res.status(400).json({ message: 'Invalid tea type id', error: e }); }
});

// aanmaken
router.post('/', async (req, res) => {
  try {
    const saved = await new TeaType(req.body).save();
    res.status(201).json(saved);
  } catch (e) { res.status(400).json({ message: 'Error creating tea type', error: e }); }
});

export default router;
