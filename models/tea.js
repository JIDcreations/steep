// models/tea.js
import mongoose from 'mongoose';

// ✅ Define allowed color swatches (7 fixed options)
const ALLOWED_COLORS = [
  '#b0a09bff',
  '#C2A98B',
  '#A88E85',
  '#8D7570',
  '#5E4F4D',
  '#243235',
  '#040403',
];

const teaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. Sencha

    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeaType',
      required: true,
    },

    steepTime: { type: Number, required: true }, // in minutes
    rating: { type: Number, min: 1, max: 5 }, // 1–5 stars
    note: { type: String }, // How was it?

    // 🍵 Recipe (optional, structured but flexible)
    recipe: {
      ingredients: [{ type: String, trim: true }], // e.g. ["green tea", "mint"]
      waterMl: { type: Number },                    // e.g. 250
      tempC: { type: Number },                      // e.g. 80
      amount: { type: String, trim: true },         // e.g. "2g / 1 tsp / 1 bag"
      steps: { type: String, trim: true },          // optional instructions
    },

    // 🎨 limited to preset colors
    color: { type: String, enum: ALLOWED_COLORS },

    moodTag: {
      type: String,
      enum: ['calming', 'energizing', 'cozy', 'focus'],
    },

    public: { type: Boolean, default: true }, // visible on feed

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // who liked
  },
  { timestamps: true, versionKey: false }
);

// ✅ Indexes for feed performance & search
teaSchema.index({ createdAt: -1 });
teaSchema.index({ type: 1, createdAt: -1 });
teaSchema.index({ name: 'text', note: 'text' });

const Tea = mongoose.models.Tea || mongoose.model('Tea', teaSchema);
export default Tea;
