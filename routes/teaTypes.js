// routes/teaTypes.js
import express from 'express';
import TeaType from '../models/TeaType.js';

const router = express.Router();

// List all types
router.get('/', async (_req, res) => {
  try {
    const types = await TeaType.find({})
      .sort({ name: 1 })
      .select('_id name description');
    res.json(types);
  } catch (e) {
    console.error('GET /api/teaTypes error:', e);
    res.status(500).json({ message: 'Error fetching tea types', error: String(e?.message || e) });
  }
});

// Seed defaults (idempotent)
router.post('/seed', async (_req, res) => {
  try {
    const defaults = [
      { name: 'green', description: '' },
      { name: 'black', description: '' },
      { name: 'oolong', description: '' },
      { name: 'white', description: '' },
      { name: 'herbal', description: '' },
      { name: 'pu-erh', description: '' },
      { name: 'rooibos', description: '' },
    ];

    await Promise.all(
      defaults.map(d =>
        TeaType.findOneAndUpdate(
          { name: d.name },
          { $setOnInsert: d },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      )
    );

    const types = await TeaType.find({}).sort({ name: 1 }).select('_id name');
    res.json({ ok: true, types });
  } catch (e) {
    console.error('POST /api/teaTypes/seed error:', e);
    res.status(500).json({ message: 'Error seeding tea types', error: String(e?.message || e) });
  }
});

export default router;
