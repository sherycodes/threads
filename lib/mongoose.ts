import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGO_URI) {
    console.log('Missing MONGODB URI');
    return;
  }
  if (isConnected) {
    console.log('MongoDB is already connected!');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
