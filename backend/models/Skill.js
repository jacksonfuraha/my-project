import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Please add a skill category'],
      enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Languages'],
    },
    name: {
      type: String,
      required: [true, 'Please add a skill name'],
      trim: true,
    },
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate',
    },
    icon: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Skill', skillSchema);
