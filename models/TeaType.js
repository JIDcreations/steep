// models/TeaType.js
import mongoose from 'mongoose';

const teaTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      enum: ['green', 'black', 'oolong', 'white', 'herbal', 'pu-erh', 'rooibos'],
    },
    description: { type: String, default: '' },
  },
  { timestamps: true, versionKey: false }
);

// IMPORTANT: export a MODEL (not the schema)
const TeaType =
  mongoose.models.TeaType || mongoose.model('TeaType', teaTypeSchema);

export default TeaType;
