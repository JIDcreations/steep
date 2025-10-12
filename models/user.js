// models/user.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    bio: { type: String, default: '' },
    avatarColor: { type: String, default: '#C2A98B' },

    // One-way follow: wie jij volgt
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Opgeslagen teas (library)
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tea' }],

    settings: { language: { type: String, default: 'en' } },
  },
  { timestamps: true, versionKey: false }
);

// ✅ zoeken op username
userSchema.index({ username: 'text' });
// ✅ unieke usernames
userSchema.index({ username: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
