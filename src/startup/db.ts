import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URL as string;

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  console.log(`Connected to ${uri}...`);
};

export default connectDB;
