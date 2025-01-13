// import AWS from 'aws-sdk';
import { S3 } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import { Response, Request } from 'express';
const s3 = new S3({
    credentials: fromEnv(),
    region: process.env.AWS_REGION
});

const newFileName = crypto.randomUUID()
export const initializeUpload = async (req: Request, res: Response) => {
    try {
        console.log('Initialising Upload');
        const { filename } = req.body;
        console.log(filename);

        // const s3 = new AWS.S3({
        //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        //     region: process.env.AWS_REGION
        // });

        const bucketName = process.env.AWS_S3_BUCKET_NAME;

        const createParams = {
            Bucket: bucketName as string,
            Key: `hls_test/${newFileName}`,
            ContentType: 'video/mp4'
        };

        const multipartParams = await s3.createMultipartUpload(createParams);
        console.log("multipartparams---- ", multipartParams);
        const uploadId = multipartParams.UploadId;
        // return uploadId;
        res.status(200).json({ uploadId });
    } catch (err) {
        console.error('Error initializing upload:', err);
        res.status(500).send('Upload initialization failed');
        // throw err;
    }
};


export const uploadChunk = async (req: Request, res: Response) => {
    // AWS.config.update({ logger: console })
    try {
        console.log('Uploading Chunk');
        const { filename, chunkIndex, uploadId } = req.body;
        // const s3 = new AWS.S3({
        //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        //     region: process.env.AWS_REGION,
        // });
        const bucketName = process.env.AWS_S3_BUCKET_NAME;

        const partParams = {
            Bucket: bucketName as string,
            Key: `hls_test/${newFileName}`,
            UploadId: uploadId,
            PartNumber: parseInt(chunkIndex) + 1,
            Body: req.file?.buffer,
        };

        const data = await s3.uploadPart(partParams);
        console.log("data------- ", data);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error uploading chunk:', err);
        res.status(500).send('Chunk could not be uploaded');
    }
};

export const completeUpload = async (req: Request, res: Response) => {
    try {
        console.log('Completing Upload');
        const { filename, totalChunks, uploadId, title, description, author } = req.body;

        const uploadedParts = [];

        // Build uploadedParts array from request body
        for (let i = 0; i < totalChunks; i++) {
            uploadedParts.push({ PartNumber: i + 1, ETag: req.body[`part${i + 1}`] });
        }

        // const s3 = new AWS.S3({
        //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        //     region: process.env.AWS_REGION
        // });
        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        if (!bucketName) {
            throw new Error("AWS_BUCKET environment variable is not set.");
        }
        const completeParams: any = {
            Bucket: bucketName,
            Key: `hls_test/${newFileName}`,
            UploadId: uploadId,
        };

        // Listing parts using promise
        const data = await s3.listParts(completeParams);

        const parts = data?.Parts?.map(part => ({
            ETag: part.ETag,
            PartNumber: part.PartNumber
        }));

        completeParams.MultipartUpload = {
            Parts: parts
        };

        // Completing multipart upload using promise
        const uploadResult = await s3.completeMultipartUpload(completeParams);

        console.log("data----- ", uploadResult);

        // await addVideoDetailsToDB(title, description, author, uploadResult.Location);
        // pushVideoForEncodingToKafka(title, uploadResult.Location);
        return res.status(200).json({ message: "Uploaded successfully!!!" });

    } catch (error) {
        console.log('Error completing upload :', error);
        return res.status(500).send('Upload completion failed');
    }
};