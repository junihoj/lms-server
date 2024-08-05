import mongoose, { Document, Schema } from 'mongoose';

interface IQuiz extends Document {
    title: string;
    questions: mongoose.Types.Array<mongoose.Types.ObjectId>;
    course: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const QuizSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        questions: [{ type: mongoose.Types.ObjectId, ref: 'Question' }],
        course: { type: mongoose.Types.ObjectId, ref: 'Course', required: true },
    },
    { timestamps: true }
);

const Quiz = mongoose.model<IQuiz>('Quiz', QuizSchema);
export default Quiz;
