const path = require('path');
const awsSDK = require('aws-sdk');

const { fileSystem } = require('../general');

const instance = new awsSDK.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET
});

const { aws } = require(path.join(process.cwd(), 'constants'));

module.exports = s3 = {
    /**
     * @param {Array} localFiles
     *     @param {json} localFiles.item
     *         @param {string} localFiles.item.name
     *         @param {string} localFiles.item.path
     *         @param {string} localFiles.item.contentType
     */
    upload: async ( localFiles ) => {
        let uploadedFiles = [];

        if(!localFiles) return uploadedFiles;
        if(!Array.isArray(localFiles))
            throw new TypeError(`'localFiles' was supposed to be an 'array'. Found '${ typeof localFiles }'`);
        
        for(let localFile of localFiles) {
            let uploadedFile =  await (instance.upload({
                ACL: aws.S3_ACCESS,
                Bucket: aws.S3_BUCKET,
                Key: localFile.name,
                Body: fileSystem.read.file(localFile.path),
                ContentType: localFile.contentType
            }).promise());

            uploadedFiles.push(uploadedFile.Location);
        }
        fileSystem.clean.dir(path.join(process.cwd(), 'files'));

        return uploadedFiles;
    }
}