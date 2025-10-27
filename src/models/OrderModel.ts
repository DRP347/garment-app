import mongoose, { Model, Document, Schema } from 'mongoose';

export interface IOrder extends Document {
    userId: Schema.Types.ObjectId;
    items: any[];
    total: number;
    status: string;
    createdAt: string; // <-- ADD THIS
    updatedAt: string; // <-- ADD THIS
}

const OrderSchema = new mongoose.Schema<IOrder>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [Schema.Types.Mixed],
    total: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
}, { timestamps: true });

const OrderModel: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default OrderModel;