import mongoose, { Document, Schema } from 'mongoose';

interface ICourse extends Document {
    title: string;
    description: string;
    price: number;
    category: mongoose.Types.ObjectId;
    instructor: mongoose.Types.ObjectId;
    chapters: mongoose.Types.Array<mongoose.Types.ObjectId>;
    resources: mongoose.Types.Array<mongoose.Types.ObjectId>;
    quizzes: mongoose.Types.Array<mongoose.Types.ObjectId>;
    ratings: {
        average: number;
        count: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const CourseSchema: Schema = new Schema(
    {
        title: { type: String, required: true, index: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: mongoose.Types.ObjectId, ref: 'Category', required: true, index: true },
        instructor: { type: mongoose.Types.ObjectId, ref: 'Instructor', required: true, index: true },
        chapters: [{ type: mongoose.Types.ObjectId, ref: 'Chapter' }],
        resources: [{ type: mongoose.Types.ObjectId, ref: 'Resource' }],
        quizzes: [{ type: mongoose.Types.ObjectId, ref: 'Quiz' }],
        coupons: [{ type: Schema.Types.ObjectId, ref: 'Coupon' }],
        students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        ratings: {
            average: { type: Number, default: 0 },
            count: { type: Number, default: 0 }
        }
    },
    { timestamps: true }
);

const Course = mongoose.model<ICourse>('Course', CourseSchema);
export default Course;
