import express from 'express';
import User from '../models/user.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * body: { username: string }
 * Returns: { user: { _id, username, avatarColor } }
 */

router.get('/ping', (_req, res) => {
  res.json({ ok: true, where: 'auth' });
});

router.post('/login', async (req, res) => {
  try {
    let { username } = req.body || {};
    if (!username) return res.status(400).json({ message: 'Username required' });

    username = username.trim();

    // Zoek gebruiker (case-insensitive)
    let user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });

    // Maak nieuwe aan als niet bestaat
    if (!user) {
      const colors = ['#8A8AFF', '#FFD93D', '#FF7A59', '#00C2A8'];
      const avatarColor = colors[Math.floor(Math.random() * colors.length)];
      user = await User.create({ username, avatarColor });
    }

    res.json({
      user: { _id: user._id, username: user.username, avatarColor: user.avatarColor },
    });
  } catch (e) {
    res.status(500).json({ message: 'Login failed', error: e.message });
  }
});

export default router;
