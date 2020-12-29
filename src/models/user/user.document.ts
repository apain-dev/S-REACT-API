import { Document } from 'mongoose';
import User from './user.model';

export type UserDocument = User & Document;
