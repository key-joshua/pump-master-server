import mongoose, { Schema } from 'mongoose';
interface UserInterface { profile_picture: string, username?: string; email: string; password?: string; is_verified: boolean; is_google: boolean; }

const userSchema = new Schema<UserInterface>(
  {
    profile_picture: { type: String },
    username: { type: String },
    email: { type: String, required: true, unique: true, trim: true, index: true },
    password: { type: String, required: false, select: true },
    is_verified: { type: Boolean, default: false },
    is_google: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User as mongoose.Model<UserInterface> || mongoose.model<UserInterface>('User', userSchema);

export default UserModel;
