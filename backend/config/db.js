import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URL || process.env.MONGODB_URI;

    await mongoose.connect(mongoURI); // no extra options needed in Mongoose v6+

    console.log('✅ MongoDB Atlas connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
