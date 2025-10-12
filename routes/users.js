// routes/users.js
import express from 'express';
import mongoose from 'mongoose';
import User from '../models/user.js';
import Tea from '../models/tea.js'; // voor profile count / favorites

const router = express.Router();

/**
 * GET /api/users?search=jas
 * Zoekt gebruikers op username (case-insensitive).
 */
router.get('/', async (req, res) => {
  try {
    const { search = '', limit = '20' } = req.query;
    const lim = Math.min(Number(limit), 50);

    const filter = search
      ? { $text: { $search: search } }
      : {}; // leeg -> alles (optioneel)

    const users = await User.find(filter)
      .select('username avatarColor')
      .limit(lim)
      .sort({ username: 1 });

    res.json(users);
  } catch (e) {
    res.status(500).json({ message: 'Error searching users', error: e });
  }
});

/**
 * GET /api/users/:id/friends
 * Geeft lijst van wie :id volgt.
 */
router.get('/:id/friends', async (req, res) => {
  try {
    const u = await User.findById(req.params.id)
      .populate('friends', 'username avatarColor')
      .select('friends');
    if (!u) return res.status(404).json({ message: 'User not found' });
    res.json(u.friends);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching friends', error: e });
  }
});

/**
 * POST /api/users/:id/follow/:targetId
 * Volg iemand (geen duplicates).
 */
router.post('/:id/follow/:targetId', async (req, res) => {
  try {
    const { id, targetId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ message: 'Invalid ids' });
    }
    if (id === targetId) return res.status(400).json({ message: 'Cannot follow yourself' });

    const updated = await User.findByIdAndUpdate(
      id,
      { $addToSet: { friends: targetId } },
      { new: true }
    ).populate('friends', 'username avatarColor');

    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ ok: true, friends: updated.friends });
  } catch (e) {
    res.status(500).json({ message: 'Error following user', error: e });
  }
});

/**
 * DELETE /api/users/:id/follow/:targetId
 * Ontvolgen.
 */
router.delete('/:id/follow/:targetId', async (req, res) => {
  try {
    const { id, targetId } = req.params;
    const updated = await User.findByIdAndUpdate(
      id,
      { $pull: { friends: targetId } },
      { new: true }
    ).populate('friends', 'username avatarColor');

    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ ok: true, friends: updated.friends });
  } catch (e) {
    res.status(500).json({ message: 'Error unfollowing user', error: e });
  }
});

/**
 * GET /api/users/:id/profile
 * Voor je profiel header (naam, kleur, posts, aantal vrienden).
 */
router.get('/:id/profile', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('username avatarColor friends bio');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const posts = await Tea.countDocuments({ user: user._id });
    res.json({
      username: user.username,
      avatarColor: user.avatarColor,
      bio: user.bio,
      posts,
      friends: user.friends.length,
    });
  } catch (e) {
    res.status(500).json({ message: 'Error fetching profile', error: e });
  }
});

export default router;
