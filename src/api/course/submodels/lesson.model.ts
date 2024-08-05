import mongoose, { Document, Schema } from 'mongoose';

interface ILesson extends Document {
    title: string;
    content: string;
    chapter: mongoose.Types.ObjectId;
    resources: mongoose.Types.Array<mongoose.Types.ObjectId>;
    type: String;
    createdAt: Date;
    updatedAt: Date;
}

const LessonSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        type: { type: String, required: true },
        chapter: { type: mongoose.Types.ObjectId, ref: 'Chapter', required: true, index: true },
        resources: [{ type: mongoose.Types.ObjectId, ref: 'Resource' }],
    },
    { timestamps: true }
);

const Lesson = mongoose.model<ILesson>('Lesson', LessonSchema);
export default Lesson;
