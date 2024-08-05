import { Schema, model, Document } from 'mongoose';

interface ICoupon extends Document {
    code: string;
    discount: number;
    expirationDate: Date;
    course: Schema.Types.ObjectId;
    usedBy: Schema.Types.ObjectId[];
    isActive: boolean;
}

const couponSchema = new Schema<ICoupon>({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    usedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true }
});

const Coupon = model<ICoupon>('Coupon', couponSchema);

export default Coupon;
