// models/TeaType.js
import mongoose from 'mongoose';

const teaTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ['green', 'black', 'oolong', 'white', 'herbal', 'pu-erh', 'rooibos'],
      trim: true,
    },
    description: { type: String, default: '' }, // optioneel
  },
  { timestamps: true, versionKey: false }
);

const TeaType = mongoose.models.TeaType || mongoose.model('TeaType', teaTypeSchema);
export default TeaType;
