import AWS from "aws-sdk";
require("dotenv").config();

new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
const client = new AWS.Rekognition();
const s3 = new AWS.S3();

exports.handler = async (imageAsBytes) => {
  let match = false;
  try {
    const bucketParams = {
      Bucket: "prog-web-facial-recognition",
    };

    const listObjectsRequest = s3.listObjects(bucketParams).promise();

    const objectsResponse = await listObjectsRequest;

    const imageKeys = objectsResponse.Contents?.map((x) => x.Key);

    for (const imgKey of imageKeys) {
      const paramsForFaceComparison = {
        SourceImage: {
          Bytes: imageAsBytes,
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
