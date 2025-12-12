// routes/teas.js
import express from 'express';
import mongoose from 'mongoose';
import Tea from '../models/tea.js';

const router = express.Router();

// GET /api/teas?q=&type=&limit=&skip=
router.get('/', async (req, res) => {
  try {
    const { q, type, limit = '20', skip = '0' } = req.query;

    const filter = { public: true };

    if (q) {
      filter.$text = { $search: q }; // uses text index on name+note
    }

    if (type && mongoose.Types.ObjectId.isValid(type)) {
      filter.type = type; // TeaType _id
    }

    const lim = Math.min(Number(limit), 50);
    const skp = Number(skip) || 0;

    const [items, total] = await Promise.all([
      Tea.find(filter)
        .populate('user', 'username avatarColor')
        .populate('type', 'name description')
        .sort({ createdAt: -1 })
        .skip(skp)
        .limit(lim)
        .select('name rating note moodTag color type user createdAt'),
      Tea.countDocuments(filter),
    ]);

    res.json({ items, total, hasMore: skp + items.length < total });
  } catch (e) {
    res.status(500).json({ message: 'Error fetching teas', error: e });
  }
});

// GET /api/teas/:id
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
    const {
      name,
      type,
      rating,
      steepTime,
      note,
      recipe, // ✅ added
      moodTag,
      color,
      userId,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const tea = await Tea.create({
      name,
      type,
      rating,
      steepTime,
      note,
      recipe, // ✅ added
      moodTag,
      color,
      user: userId,   // koppeling met ingelogde user
      public: true,   // blijft in de globale feed
    });

    res.status(201).json(tea);
  } catch (e) {
    res.status(400).json({ message: 'Error creating tea', error: e.message });
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
