import express from 'express';
import Tea from '../models/tea.js';

const router = express.Router();

// GET all (handig om te checken)
router.get('/', async (_req, res) => {
  try { res.json(await Tea.find().sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ message: 'Error fetching teas', error: e }); }
});

// GET one
router.get('/:id', async (req, res) => {
  try {
    const tea = await Tea.findById(req.params.id);
    if (!tea) return res.status(404).json({ message: 'Tea not found' });
    res.json(tea);
  } catch (e) { res.status(400).json({ message: 'Invalid tea id', error: e }); }
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
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Tea not found' });
    res.json(updated);
  } catch (e) { res.status(400).json({ message: 'Error updating tea', error: e }); }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Tea.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Tea not found' });
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ message: 'Error deleting tea', error: e }); }
});

export default router;
