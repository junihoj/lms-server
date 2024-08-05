import mongoose, { Document, Schema } from 'mongoose';

interface IInstructor extends Document {
    user: mongoose.Types.ObjectId;
    courses: mongoose.Types.Array<mongoose.Types.ObjectId>;
    createdAt: Date;
    updatedAt: Date;
}

const InstructorSchema: Schema<IInstructor> = new Schema(
    {
        user: {
            user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
            ref: "User",
            unique: true
        },
        courses: [{ type: mongoose.Types.ObjectId, ref: 'Course', required: true }]
    },
    { timestamps: true }
);

const Instructor = mongoose.model<IInstructor>('Instructor', InstructorSchema);
export default Instructor;
