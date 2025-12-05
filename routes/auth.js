// routes/auth.js (of auth.js)
import express from 'express';
import User from '../models/user.js';

const router = express.Router();

/**
 * GET /api/auth/ping
 */
router.get('/ping', (_req, res) => {
  res.json({ ok: true, where: 'auth' });
});

/**
 * POST /api/auth/login
 * body: { username: string, password: string }
 * Returns: { user: { _id, username, avatarColor } }
 */
router.post('/login', async (req, res) => {
  try {
    let { username, password } = req.body || {};

    if (!username || !username.trim()) {
      return res.status(400).json({ message: 'Username required' });
    }
    if (!password || !password.trim()) {
      return res.status(400).json({ message: 'Password required' });
    }

    username = username.trim();
    password = password.trim();

    // Zoek gebruiker (case-insensitive op username)
    const user = await User.findOne({
      username: new RegExp(`^${username}$`, 'i'),
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        avatarColor: user.avatarColor,
      },
    });
  } catch (e) {
    res.status(500).json({ message: 'Login failed', error: e.message });
  }
});

export default router;
