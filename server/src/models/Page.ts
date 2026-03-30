import mongoose, { Schema, Document } from 'mongoose';

export interface IPage extends Document {
  title: string;
  slug: string;
  content: string;
  lastUpdated: Date;
}

const PageSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
}, {
  timestamps: true
});

export default mongoose.model<IPage>('Page', PageSchema);
