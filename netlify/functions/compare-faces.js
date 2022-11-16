const AWS = require("aws-sdk");
require("dotenv").config();

new AWS.Config({
  accessKeyId: process.env.MY_AWS_ACCESS_KEY,
  secretAccessKey: process.env.MY_AWS_SECRET_KEY,
  region: process.env.MY_AWS_REG,
});
AWS.config.update({
  region: process.env.MY_AWS_REG,
  accessKeyId: process.env.MY_AWS_ACCESS_KEY,
  secretAccessKey: process.env.MY_AWS_SECRET_KEY,
});
const client = new AWS.Rekognition();
const s3 = new AWS.S3();

exports.handler = async (event) => {
  const { decodedBytes } = JSON.parse(event.body);

  const image = Buffer.from(decodedBytes, "base64").toJSON().data;

  var imageBuffer = new Uint8Array(image.length);
  for (var i = 0; i < imageBuffer.length; i++) {
    imageBuffer[i] = image[i];
  }

  let match = false;
  try {
    const bucketParams = {
      Bucket: process.env.MY_AWS_BUCKET_NAME,
    };

    const listObjectsRequest = s3.listObjects(bucketParams).promise();

    const objectsResponse = await listObjectsRequest;

    const imageKeys = objectsResponse.Contents?.map((x) => x.Key);

    for (const imgKey of imageKeys) {
      const paramsForFaceComparison = {
        SourceImage: {
          Bytes: imageBuffer,
        },
        TargetImage: {
          S3Object: {
            Bucket: "prog-web-facial-recognition",
            Name: imgKey,
          },
        },
        SimilarityThreshold: 70,
      };

      const faceComparisonRequest = client
        .compareFaces(paramsForFaceComparison)
        .promise();

      const faceMatchResponse = await faceComparisonRequest;

      if (faceMatchResponse.FaceMatches.length) {
        match = true;
        break;
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ match }),
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      body: JSON.stringify({ error }),
    };
  }
};
