const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  signatureVersion: "v4",
  region: "us-west-2",
  accessKeyId: "AKIAR43UW57FHWEFPLEI",
  secretAccessKey: "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",
});

const params = {
  Body: "hello world",
  Bucket: "tutorail-access-libraly",
  Key: "my-file.txt",
};

(async () => {
  try {
    const data = await s3.putObject(params).promise();
    console.log("Data", data);
  } catch (err) {
    console.error("Error", err);
  }
})();
