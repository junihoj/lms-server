import mongoose, { Document, Schema } from 'mongoose';

interface IChapter extends Document {
    title: string;
    lessons: mongoose.Types.Array<mongoose.Types.ObjectId>;
    course: mongoose.Types.ObjectId;
    resources: mongoose.Types.Array<mongoose.Types.ObjectId>;
    createdAt: Date;
    updatedAt: Date;
}

const ChapterSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        lessons: [{ type: mongoose.Types.ObjectId, ref: 'Lesson' }],
        course: { type: mongoose.Types.ObjectId, ref: 'Course', required: true, index: true },
        resources: [{ type: mongoose.Types.ObjectId, ref: 'Resource' }],
    },
    { timestamps: true }
);

const Chapter = mongoose.model<IChapter>('Chapter', ChapterSchema);
export default Chapter;
