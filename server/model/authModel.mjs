import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const authSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true,
  },
  password: String,
  authlist: Array,
}, { versionKey: false });

authSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

authSchema.methods.comparePassword = function (candidatePassword) {
  try {
    return bcrypt.compareSync(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
}

export default new mongoose.model('auth', authSchema, 'auth');