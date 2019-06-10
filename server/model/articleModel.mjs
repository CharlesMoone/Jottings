import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: String,
    author: {
      type: String,
      ref: 'auth',
    },
    description: String,
    image: String,
    content: String,
  },
  { versionKey: false }
);

export default new mongoose.model('article', articleSchema, 'article');
