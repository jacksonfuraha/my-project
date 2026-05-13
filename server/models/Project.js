import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a project title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a project description'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    tech: {
      type: [String],
      required: true,
    },
    icon: {
      type: String,
      default: '💻',
    },
    github: {
      type: String,
      default: '#',
    },
    demo: {
      type: String,
      default: '#',
    },
    image: {
      type: String,
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
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

export default mongoose.model('Project', projectSchema);
