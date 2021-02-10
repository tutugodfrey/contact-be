import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import mongooseStringQuery from 'mongoose-string-query';

export const ContactSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    group: {
      type: String,
    }
    },
    { collection: 'contacts' }
)

ContactSchema.plugin(timestamps);
ContactSchema.plugin(mongooseStringQuery);
ContactSchema.index({ owner: 1 });

export default mongoose.model('Contact', ContactSchema);
