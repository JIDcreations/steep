// routes/authRoutes.js
import express from 'express';
import User from '../models/user.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Body: { username: "jasper", avatarColor: "#xxxxxx" }
 */
router.post('/register', async (req, res) => {
  try {
    const { username, avatarColor } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const cleanUsername = username.trim();

    const existing = await User.findOne({ username: cleanUsername });
    if (existing) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const user = await User.create({
      username: cleanUsername,
      avatarColor: avatarColor || '#C2A98B',
    });

    return res.status(201).json({
      ok: true,
      user: {
        id: user._id,
        username: user.username,
        avatarColor: user.avatarColor,
      },
    });

  } catch (e) {
    console.error('Error in /register:', e);
    return res.status(500).json({ message: 'Error registering user', error: e.message });
  }
});

/**
 * POST /api/auth/login
 * Body: { username: "jasper" }
 */
router.post('/login', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const cleanUsername = username.trim();

    const user = await User.findOne({ username: cleanUsername });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      ok: true,
      user: {
        id: user._id,
        username: user.username,
        avatarColor: user.avatarColor,
      },
    });

  } catch (e) {
    console.error('Error in /login:', e);
    return res.status(500).json({ message: 'Error logging in', error: e.message });
  }
});

export default router;
