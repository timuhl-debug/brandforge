const mongoose = require('mongoose');
// - Keep passwords and verification tokens out of normal query results.
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  isVerified: { type: Boolean, default: false },
  verificationTokenHash: { type: String, select: false },
  verificationExpiresAt: { type: Date, select: false }
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
