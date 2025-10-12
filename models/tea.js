// models/tea.js
import mongoose from 'mongoose';

const teaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },                 // e.g. Sencha

    type: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'TeaType',
  required: true
},

    steepTime: { type: Number, required: true },            // in minutes
    rating: { type: Number, min: 1, max: 5 },               // 1–5 stars
    note: { type: String },                                 // short note
    color: { type: String },                                // e.g. #C97C32
    moodTag: {                                              // optional mood tag
      type: String,
      enum: ['calming', 'energizing', 'cozy', 'focus'],
    },
    public: { type: Boolean, default: true },               // visible on feed
    user: {                                                 // linked user
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // who liked
  },
  { timestamps: true, versionKey: false }
);

// ✅ NEW: indexes for feed performance & search
teaSchema.index({ createdAt: -1 });
teaSchema.index({ type: 1, createdAt: -1 });
teaSchema.index({ name: 'text', note: 'text' }); // enables ?q= search

const Tea = mongoose.models.Tea || mongoose.model('Tea', teaSchema);
export default Tea;
