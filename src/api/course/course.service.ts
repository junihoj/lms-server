import Container, { Service } from 'typedi';
import mongoose, { Model, Document } from 'mongoose';
import { Inject } from 'typedi';
import CourseModel, { ICourse } from './course.model';
import { IActivationMailReplacement } from './course.dto';
import jwt, { JwtPayload } from 'jsonwebtoken'
import CourseMailer from './course.mailer';
import ErrorHandler from '@/common/utils/error-handler';
import { sendToken } from '@/common/utils/jwt';
import { Response, Request } from 'express';
import { redis } from '@/config/redis';

import Cloudinay from 'cloudinary';

// interface ICourse {
//   name: string;
//   email: string;
//   password: string;
// }

// interface ICourseDocument extends ICourse, Document { }
Container.set("courseModel", CourseModel)
@Service()
class CourseService {

    private courseModel: Model<ICourse>;

    constructor(@Inject('courseModel') courseModel: Model<ICourse>, public courseMailer: CourseMailer) {
        this.courseModel = courseModel;

    }

    async uploadCourse(data: any) {
        try {
            const thumbnail = data.thumbnail;
            if (thumbnail) {
                const uploadThumbnail = await Cloudinay.v2.uploader.upload(thumbnail, {
                    folder: "courses"
                })

                data.thumbnail = {
                    public_id: uploadThumbnail.public_id,
                    url: uploadThumbnail.secure_url
                }
            }

            const course = await this.courseModel.create(data);
            return course;

        } catch (err) {
            throw new ErrorHandler("An Error Occur while uploading course. please try again", 500);
        }
    }


    async editCourse(courseId: string, data: any) {
        try {
            const thumbnail = data.thumbnail;
            if (thumbnail) {
                const uploadThumbnail = await Cloudinay.v2.uploader.upload(thumbnail, {
                    folder: "courses"
                })

                data.thumbnail = {
                    public_id: uploadThumbnail.public_id,
                    url: uploadThumbnail.secure_url
                }
            }

            const course = await this.courseModel.findByIdAndUpdate(courseId, { $set: data }, {
                new: true
            });

            return course;

        } catch (err) {
            throw new ErrorHandler("An Error Occur while uploading course. please try again", 500);
        }
    }


    async getSingleCourse(courseId: string) {
        try {
            if (!courseId) throw new ErrorHandler("Invalid Request Course not Specified", 400);
            const cachedCourse = await redis.get(courseId);
            if (cachedCourse) {
                return JSON.parse(cachedCourse);
            }
            const course = await this.courseModel.findById(courseId).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            await redis.set(courseId, JSON.stringify(course))
            return course;
        } catch (err) {
            throw new ErrorHandler("Internal Server Error: An Error Occur while getting Course", 500)
        }
    }
    async getAllCourses() {
        try {
            const allCoursesCache = await redis.get("allCourses");
            if (allCoursesCache) {
                return JSON.parse(allCoursesCache);
            }
            const allCourses = await this.courseModel.findById({}).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            await redis.set("allCourses", JSON.stringify(allCourses))
            return allCourses;
        } catch (err) {
            throw new ErrorHandler("Internal Server Error: An Error Occur while getting All Courses", 500)
        }
    }
    //TODO: LOOKUP THROUGH THE COURSES
    async getCourseContent(userCourses: any, courseId: string) {
        try {
            const courseExist = userCourses.find((course: any) => course._id.toString() == courseId);
            if (!courseExist) {
                throw new ErrorHandler("User are not eligible to access this course", 400)
            }
            const course = await this.courseModel.findById(courseId);
            const content = course?.courseData;
            return content;
        } catch (err) {
            throw new ErrorHandler("Internal Server Error: An Error Occur while getting All Courses", 500)
        }
    }

    async addQuestion(data: any, user: any) {
        const { courseId, question, contentId } = data;

        const course = await this.courseModel.findById(courseId);

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            throw new ErrorHandler("invalid content", 400);
        }
        if (!course) {
            throw new ErrorHandler("invalid content", 400);
        }
        const courseContent = course.courseData.find((item: any) => item._id.equals(contentId));
        if (!courseContent) {
            throw new ErrorHandler("No Course Content", 400);
        }

        const newQuestion: any = {
            user,
            question,
            questionReplies: []
        }

        courseContent.questions.push(newQuestion);
        await course.save();
        return course;
    }

    async answerQuestion(data: any, user: any) {
        const { answer, courseId, contentId, questionId, } = data
        try {
            const course = await this.courseModel.findById(courseId);

            if (!mongoose.Types.ObjectId.isValid(contentId)) {
                throw new ErrorHandler("invalid content", 400);
            }
            if (!course) {
                throw new ErrorHandler("invalid content", 400);
            }
            const courseContent = course.courseData.find((item: any) => item._id.equals(contentId));
            if (!courseContent) {
                throw new ErrorHandler("No Course Content", 400);
            }

            const question = courseContent.questions.find((item: any) => item._id.equals(questionId));
            if (!question) {
                throw new ErrorHandler("invalid Question", 400);
            }

            const newAns: any = {
                user: user,
                answer
            }
            question.questionReplies.push(newAns);
            await course?.save();
            if (user._id == question.user._id) {
                // TODO: create notification
            } else {
                //TODO: SEND MAIL
            }
        } catch (err) {
            throw new ErrorHandler("Internal Server Error", 500)
        }
    }

    async addReview(data: any, userCourses: any, courseId: string, user: any) {
        const { review, rating } = data;
        const courseExits = userCourses?.some((course: any) => course._id.toString() == courseId);
        if (!courseExits) {
            throw new ErrorHandler("You can not give a review on this course", 403);
        }

        const reviewData: any = {
            user,
            comment: review,
            rating
        }
        const course = await this.courseModel.findById(courseId);
        if (course) {
            course?.reviews.push(reviewData);
            let totalRating = 0
            course.reviews.forEach((item) => {
                totalRating += item.rating
            })
            course.ratings = totalRating / course.reviews.length;
            await course?.save();
            //TODO: NOTIFICATION
            return course;
        }


    }
    async addReviewReply(data: any, user: any) {
        try {
            const { courseId, comment, reviewId } = data
            const course = await this.courseModel.findById(courseId);
            if (!course) throw new ErrorHandler("invalid course", 400);
            const review = course.reviews.find((rev: any) => rev._id.toString() === reviewId);
            if (!review) {
                throw new ErrorHandler("Review not found", 400)
            }

            const replyData: any = {
                user,
                comment
            }

            review.commentReplies.push(replyData);
            await course.save();
            return course;

        } catch (err) {
            throw new ErrorHandler("Internal Server Error", 500)
        }
    }

}

export default CourseService;