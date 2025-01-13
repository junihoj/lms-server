import { Jobs } from "node-resque";
import dotenv from "dotenv";
import { S3 } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import ffmpeg from "fluent-ffmpeg"
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import VideoHlsTranscoder from "./transcoding-service";
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
dotenv.config();

const s3 = new S3({
    credentials: fromEnv(),
    region: process.env.AWS_REGION
});

interface IProcessVideo {
    url: string,
    courseId: string,
    chapterId: string
}
const jobs: Jobs = {
    processVideo: {
        perform: async ({ url, courseId, chapterId }: IProcessVideo) => {
            const transcoderService = new VideoHlsTranscoder(url);
            transcoderService.run()
        }
    },

}