// routes/users.js
import express from 'express';
import mongoose from 'mongoose';
import User from '../models/user.js';
import Tea from '../models/tea.js'; // for profile count / favorites

const router = express.Router();

const ALLOWED_AVATAR_COLORS = [
  '#b0a09bff',
  '#C2A98B',
  '#A88E85',
  '#8D7570',
  '#5E4F4D',
  '#243235',
  '#040403',
];

/**
 * GET /api/users/__ping
 */
router.get('/__ping', (req, res) =>
  res.json({ ok: true, where: 'users router' })
);

/**
 * GET /api/users?search=jas
 */
router.get('/', async (req, res) => {
  try {
    const { search = '', limit = '20' } = req.query;
    const lim = Math.min(Number(limit), 50);

    const filter = search ? { $text: { $search: search } } : {};

    const users = await User.find(filter)
      .select('username avatarColor')
      .limit(lim)
      .sort({ username: 1 });

    res.json(users);
  } catch (e) {
    res.status(500).json({ message: 'Error searching users', error: e.message });
  }
});

/**
 * GET /api/users/:id/friends
 */
router.get('/:id/friends', async (req, res) => {
  try {
    const u = await User.findById(req.params.id)
      .populate('friends', 'username avatarColor')
      .select('friends');

    if (!u) return res.status(404).json({ message: 'User not found' });

    res.json(u.friends);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching friends', error: e.message });
  }
});

/**
 * POST /api/users/:id/follow/:targetId
 */
router.post('/:id/follow/:targetId', async (req, res) => {
  try {
    const { id, targetId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(targetId)
    ) {
      return res.status(400).json({ message: 'Invalid ids' });
    }

    if (id === targetId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $addToSet: { friends: targetId } },
      { new: true }
    ).populate('friends', 'username avatarColor');

    if (!updated) return res.status(404).json({ message: 'User not found' });

    res.json({ ok: true, friends: updated.friends });
  } catch (e) {
    res.status(500).json({ message: 'Error following user', error: e.message });
  }
});

/**
 * DELETE /api/users/:id/follow/:targetId
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
    res.status(500).json({ message: 'Error unfollowing user', error: e.message });
  }
});

/**
 * GET /api/users/:id/profile
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
    res.status(500).json({ message: 'Error fetching profile', error: e.message });
  }
});

/**
 * PATCH /api/users/:id
 * Body: { "bio": "...", "avatarColor": "#..." }
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { bio, avatarColor } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const update = {};

    if (typeof bio === 'string') {
      update.bio = bio;
    }

    if (
      typeof avatarColor === 'string' &&
      ALLOWED_AVATAR_COLORS.includes(avatarColor)
    ) {
      update.avatarColor = avatarColor;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    ).select('username avatarColor bio friends favorites settings');

    if (!updated) return res.status(404).json({ message: 'User not found' });

    res.json({ ok: true, user: updated });
  } catch (e) {
    res.status(500).json({ message: 'Error updating user', error: e.message });
  }
});

/**
 * POST /api/users/:id/favorites
 */
router.post('/:id/favorites', async (req, res) => {
  try {
    const { id } = req.params;
    const { teaId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(teaId)
    ) {
      return res.status(400).json({ message: 'Invalid ids' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hasIt = (user.favorites || []).some(
      f => f.toString() === teaId
    );

    user.favorites = hasIt
      ? user.favorites.filter(f => f.toString() !== teaId)
      : [ ...(user.favorites || []), teaId ];

    await user.save();

    const populated = await user.populate('favorites');

    res.json({
      ok: true,
      action: hasIt ? 'removed' : 'added',
      favorites: populated.favorites,
    });
  } catch (e) {
    res.status(500).json({ message: 'Error updating favorites', error: e.message });
  }
});

/**
 * GET /api/users/:id/favorites
 */
router.get('/:id/favorites', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await User.findById(id).populate('favorites');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.favorites || []);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching favorites', error: e.message });
  }
});

export default router;
