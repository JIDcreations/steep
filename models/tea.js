// models/tea.js
import mongoose from 'mongoose';

// allowed color swatches
const ALLOWED_COLORS = [
  '#b0a09bff',
  '#C2A98B',
  '#A88E85',
  '#8D7570',
  '#5E4F4D',
  '#243235',
  '#040403',
];

const recipeSchema = new mongoose.Schema(
  {
    ingredients: [{ type: String }],
    waterMl: { type: Number },
    tempC: { type: Number },
    amount: { type: String },
    steps: { type: String },
  },
  { _id: false }
);

const teaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeaType',
      required: true,
    },

    steepTime: { type: Number, required: true },
    rating: { type: Number, min: 1, max: 5 },
    note: { type: String },

    recipe: recipeSchema,

    color: { type: String, enum: ALLOWED_COLORS },

    moodTag: {
      type: String,
      enum: ['calming', 'energizing', 'cozy', 'focus'],
    },

    public: { type: Boolean, default: true },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true, versionKey: false }
);

// indexes
teaSchema.index({ createdAt: -1 });
teaSchema.index({ type: 1, createdAt: -1 });
teaSchema.index({ name: 'text', note: 'text' });

const Tea = mongoose.models.Tea || mongoose.model('Tea', teaSchema);
export default Tea;
