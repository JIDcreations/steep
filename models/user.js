// models/user.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    bio: { type: String, default: '' },
    avatarColor: { type: String, default: '#C2A98B' }, // color instead of avatar
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // following
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tea' }], // quick access
    settings: {
      language: { type: String, default: 'en' },
    },
  },
  { timestamps: true, versionKey: false }
);

// ensure unique usernames
userSchema.index({ username: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
