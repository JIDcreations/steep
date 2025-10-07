import express from 'express';
import Tea from '../models/tea.js';

const router = express.Router();

// ✅ GET all teas (met populate van user & type)
router.get('/', async (_req, res) => {
  try {
    const teas = await Tea.find()
      .populate('user', 'username avatarColor')   // toon enkel specifieke user velden
      .populate('type', 'name description')       // toon naam & beschrijving van TeaType
      .sort({ createdAt: -1 });

    res.json(teas);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching teas', error: e });
  }
});

// ✅ GET één specifieke tea (ook met populate)
router.get('/:id', async (req, res) => {
  try {
    const tea = await Tea.findById(req.params.id)
      .populate('user', 'username avatarColor')
      .populate('type', 'name description');

    if (!tea) return res.status(404).json({ message: 'Tea not found' });
    res.json(tea);
  } catch (e) {
    res.status(400).json({ message: 'Invalid tea id', error: e });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const saved = await new Tea(req.body).save();
    res.status(201).json(saved);
  } catch (e) {
    res.status(400).json({ message: 'Error creating tea', error: e });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const updated = await Tea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('user', 'username avatarColor')
      .populate('type', 'name description');

    if (!updated) return res.status(404).json({ message: 'Tea not found' });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: 'Error updating tea', error: e });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Tea.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Tea not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ message: 'Error deleting tea', error: e });
  }
});

export default router;
