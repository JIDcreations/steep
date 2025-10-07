import express from 'express';
import User from '../models/user.js';

const router = express.Router();

// CREATE user
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);       // <-- accept any fields from schema
    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// LIST all users
router.get('/', async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// ✅ GET one user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('friends', 'username avatarColor')
      .populate('favorites'); // will work once Tea model exists
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Invalid user id', error });
  }
});

// (Optional) UPDATE user
router.put('/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error });
  }
});

// (Optional) DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ ok: true });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting user', error });
  }
});

export default router;
