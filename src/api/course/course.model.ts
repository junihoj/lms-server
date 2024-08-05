import mongoose, { Model, Schema, Document } from "mongoose";
import { IUser } from "../user/user.model";

interface IComment extends Document {
    user: IUser;
    question: string;
    questionReplies: IComment[];
}
interface IReview extends Document {
    user: IUser;
    rating: number;
    comment: string;
    commentReplies: IComment[];

}


interface ILink extends Document {
    title: string;
    url: string;
}
interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: object;
    videoSection: string;
    videoDuration: number;
    videoPlayer: string;
    links: ILink[];
    suggestion: string;
    questions: IComment[]

}

export interface ICourse extends Document {
    name: string;
    description: string;
    price: number;
    estimatedPrice: number;
    thumbnail: object;
    tags: string;
    level: string;
    demoVideoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: IReview[];
    courseData: ICourseData[];
    ratings?: number;
    purchased?: number;

}

const reviewSchema = new Schema<IReview>({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
});

const linkSchema = new Schema<ILink>({
    title: String,
    url: String,
});

const questionSchema = new Schema<IComment>({
    user: Object,
    question: String,
    questionReplies: [Object]
});


const courseDataSchema = new Schema<ICourseData>({
    videoUrl: String,
    videoThumbnail: Object,
    title: String,
    description: String,
    videoDuration: Number,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    questions: [questionSchema]
});


const courseSchema = new Schema<ICourse>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    estimatedPrice: {
        type: Number,
        required: false
    },
    thumbnail: {
        public_id: {
            required: true,
            type: String
        },
        url: {
            required: true,
            type: String
        },
    },
    tags: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true
    },
    demoVideoUrl: {
        required: true,
        type: String
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    courseData: [courseDataSchema],
    ratings: {
        type: Number,
        default: 0,
    },
    purchased: {
        type: Number,
        default: 0
    },
});



const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel;