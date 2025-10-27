import * as mongoose from 'mongoose';

export interface IAbandonedCart extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId;
    items: any[];
    total: number;
    lastUpdated: Date;
}

const AbandonedCartSchema = new mongoose.Schema<IAbandonedCart>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [mongoose.Schema.Types.Mixed],
    total: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now },
});

// Apply the same robust pattern here
const AbandonedCartModel: mongoose.Model<IAbandonedCart> = mongoose.models.AbandonedCart || mongoose.model<IAbandonedCart>('AbandonedCart', AbandonedCartSchema);

export default AbandonedCartModel;