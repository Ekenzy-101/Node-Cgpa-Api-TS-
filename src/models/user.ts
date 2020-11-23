import mongoose, { Document, Schema } from "mongoose";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  isAdmin: boolean;
  generateAuthToken: () => string;
}

const userSchema: Schema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    maxlength: 250,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 1000,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
});

userSchema.methods.generateAuthToken = async function () {
  const secret = process.env.SECRET_KEY as jwt.Secret;
  const token = await jwt.sign(
    {
      _id: this._id,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    secret
  );
  return token;
};

// Export the model and return your IUser Interface
export default mongoose.model<IUser>("User", userSchema);
