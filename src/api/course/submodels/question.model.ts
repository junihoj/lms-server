import mongoose, { Document, Schema } from 'mongoose';

interface IQuestion extends Document {
    question: string;
    options: string[];
    answer: string;
    quiz: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema: Schema = new Schema(
    {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        answer: { type: String, required: true },
        quiz: { type: mongoose.Types.ObjectId, ref: 'Quiz', required: true },
    },
    { timestamps: true }
);

const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
export default Question;
