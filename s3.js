const AWS = require("aws-sdk");
require("dotenv").config();
const fs = require("fs");

const s3 = new AWS.S3({
  signatureVersion: "v4",
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
});

const bucketName = process.env.S3_BUCKET;

async function uploadFile(file) {
  console.log("file.path", file.path);
  const fileContent = fs.readFileSync(file.path);
  console.log("fileContent", fileContent);
  const key = `${file.filename}.${file.originalname.split(".")[1]}`;
  const uploadParams = {
    Bucket: bucketName,
    Body: fileContent,
    Key: key,
  };

  try {
    const data = await s3.putObject(uploadParams).promise();
    return { data, key };
  } catch (err) {
    return err;
  }
}

function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };
  return s3.getObject(downloadParams).createReadStream();
}

function deleteObject(fileKey) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: fileKey,
    };
    s3.deleteObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log("Delete successfully", data);
        resolve(data);
      }
    });
  });
}
module.exports = {
  uploadFile,
  getFileStream,
  deleteObject,
};
