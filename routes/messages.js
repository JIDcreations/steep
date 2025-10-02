import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();


// ✅ GET: Retrieve all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().populate('sender');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages', error });
  }
});
// ✅ GET: Retrieve a specific message by ID
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (message) {
      res.json(message);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid message ID', error: error.message });
  }
});
// ✅ POST: Add a new message
router.post('/', async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ message: 'Error adding message', error });
  }
});

// ✅ PUT: Update an existing message
router.put('/:id', async (req, res) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedMessage) {
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating message', error });
  }
});

// ✅ DELETE: Remove a message by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    if (deletedMessage) {
      res.json({ message: 'Message deleted successfully!' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error });
  }
});

export default router;