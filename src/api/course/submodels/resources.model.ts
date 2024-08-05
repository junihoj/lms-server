import mongoose, { Document, Schema } from 'mongoose';

enum ResourceType {
    COURSE = 'Course',
    CHAPTER = 'Chapter',
    LESSON = 'Lesson'
}

interface IResource extends Document {
    title: string;
    url: string;
    type: ResourceType;
    referenceId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ResourceSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, required: true, enum: Object.values(ResourceType) },
        referenceId: { type: mongoose.Types.ObjectId, required: true, index: true },
    },
    { timestamps: true }
);

const Resource = mongoose.model<IResource>('Resource', ResourceSchema);
export default Resource;
