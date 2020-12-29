import { Schema } from 'mongoose';
import ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  authId: { type: ObjectId, required: true },
}, { timestamps: true });

export default UserSchema;
