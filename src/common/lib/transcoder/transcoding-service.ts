import dotenv from "dotenv";
import AWS from 'aws-sdk';
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg"
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
// import ffmpegStatic from "ffmpeg-static"
// ffmpeg.setFfmpegPath(ffmpegStatic)
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const mp4FileName = 'trial2.mp4';
const bucketName = process.env.AWS_BUCKET as string;
const hlsFolder = 'hls';
const processingDir = ""
const hlsDownloadDir = `downloadsfolder/courseid/chapterid/lessonid`
/* 

    TODO:
    hlsFolder should be the root dir for processing files
    then for a specific file i create another folder with the course id
    hlsDownloadDir // name the download file courseid-chapterid-lessonid

*/
export default class VideoHlsTranscoder {
    url: string;
    constructor(url: string) {
        this.url = url;
    }

    run() {
        this.downloadFileLocally(this.url)
    }

    async downloadFileLocally(url: string) {
        // const mp4FilePath = `${mp4FileName}`;
        const mp4FilePath = `${'courseid/chapterid/lessonid'}`
        const writeStream = fs.createWriteStream('local.mp4');
        const readStream = s3
            .getObject({ Bucket: bucketName, Key: mp4FilePath })
            .createReadStream();
        readStream.pipe(writeStream);
        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        return
    }

    async processHlsVideo() {
        const resolutions = [
            {
                resolution: '320x180',
                videoBitrate: '500k',
                audioBitrate: '64k'
            },
            {
                resolution: '854x480',
                videoBitrate: '1000k',
                audioBitrate: '128k'
            },
            {
                resolution: '1280x720',
                videoBitrate: '2500k',
                audioBitrate: '192k'
            }
        ];


        const variantPlaylists = [];
        for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
            console.log(`HLS conversion starting for ${resolution}`);
            const outputFileName = `${mp4FileName.replace(
                '.',
                '_'
            )}_${resolution}.m3u8`;
            const segmentFileName = `${mp4FileName.replace(
                '.',
                '_'
            )}_${resolution}_%03d.ts`;
            await new Promise((resolve, reject) => {
                ffmpeg('./local.mp4')
                    .outputOptions([
                        `-c:v h264`,
                        `-b:v ${videoBitrate}`,
                        `-c:a aac`,
                        `-b:a ${audioBitrate}`,
                        `-vf scale=${resolution}`,
                        `-f hls`,
                        `-hls_time 10`,
                        `-hls_list_size 0`,
                        `-hls_segment_filename hls/${segmentFileName}`
                    ])
                    .output(`hls/${outputFileName}`)
                    .on('end', () => resolve(""))
                    .on('error', (err) => reject(err))
                    .run();
            });
            const variantPlaylist = {
                resolution,
                outputFileName
            };
            variantPlaylists.push(variantPlaylist);
            console.log(`HLS conversion done for ${resolution}`);
        }
        console.log(`HLS master m3u8 playlist generating`);
        let masterPlaylist = variantPlaylists
            .map((variantPlaylist) => {
                const { resolution, outputFileName } = variantPlaylist;
                const bandwidth =
                    resolution === '320x180'
                        ? 676800
                        : resolution === '854x480'
                            ? 1353600
                            : 3230400;
                return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n${outputFileName}`;
            })
            .join('\n');
        masterPlaylist = `#EXTM3U\n` + masterPlaylist;


        const masterPlaylistFileName = `${mp4FileName.replace(
            '.',
            '_'
        )}_master.m3u8`;
        const masterPlaylistPath = `hls/${masterPlaylistFileName}`;
        fs.writeFileSync(masterPlaylistPath, masterPlaylist);
        console.log(`HLS master m3u8 playlist generated`);


        console.log(`Deleting locally downloaded s3 mp4 file`);


        fs.unlinkSync('local.mp4');
    }


    async cleanup() {

    }
}