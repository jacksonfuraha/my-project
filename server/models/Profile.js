import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Full Stack Backend Developer',
    },
    title: {
      type: String,
      default: 'Backend Developer',
    },
    bio: {
      type: String,
      default: 'I\'m a passionate full-stack backend developer...',
    },
    yearsExperience: {
      type: Number,
      default: 5,
    },
    projectsCompleted: {
      type: Number,
      default: 50,
    },
    clientsServed: {
      type: Number,
      default: 30,
    },
    profileImage: {
      type: String,
      default: null,
    },
    resume: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Profile', profileSchema);
