import mongoose, { Schema } from 'mongoose';
interface SessionInterface { user_id: mongoose.Types.ObjectId; device_id: string; access_token: string; refresh_token: string; }

const sessionSchema = new Schema<SessionInterface>(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true, },
    device_id: { type: String, required: true, },
    access_token: { type: String, required: true, },
    refresh_token: { type: String, required: true, },
  },
  { timestamps: true }
);

const SessionModel = mongoose.models.Session as mongoose.Model<SessionInterface> || mongoose.model<SessionInterface>('Session', sessionSchema);

export default SessionModel;
