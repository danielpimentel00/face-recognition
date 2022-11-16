// import AWS from "aws-sdk";
// // require("dotenv").config();

// new AWS.Config({
//   accessKeyId: "AKIARFJQD3UBX33C5RMA", //process.env.REACT_APP_AWS_ACCESS_KEY,
//   secretAccessKey: "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", //process.env.REACT_APP_AWS_SECRET_KEY,
//   region: "us-east-1", //process.env.REACT_APP_AWS_REGION,
// });
// AWS.config.update({
//   region: "us-east-1",
//   accessKeyId: "AKIARFJQD3UBX33C5RMA", //process.env.REACT_APP_AWS_ACCESS_KEY,
//   secretAccessKey: "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", //process.env.REACT_APP_AWS_SECRET_KEY,
// }); //process.env.REACT_APP_AWS_REGION });
// const client = new AWS.Rekognition();
// const s3 = new AWS.S3();

export const readFileData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target.result);
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsArrayBuffer(file);
  });
};

// export const compareFaces = async (imageAsBytes) => {
//   let response = 0;
//   try {
//     const bucketParams = {
//       Bucket: "prog-web-facial-recognition",
//     };

//     const listObjectsRequest = s3.listObjects(bucketParams).promise();

//     const objectsResponse = await listObjectsRequest;

//     const imageKeys = objectsResponse.Contents?.map((x) => x.Key);

//     for (const imgKey of imageKeys) {
//       const paramsForFaceComparison = {
//         SourceImage: {
//           Bytes: imageAsBytes,
//         },
//         TargetImage: {
//           S3Object: {
//             Bucket: "prog-web-facial-recognition",
//             Name: imgKey,
//           },
//         },
//         SimilarityThreshold: 70,
//       };

//       const faceComparisonRequest = client
//         .compareFaces(paramsForFaceComparison)
//         .promise();

//       const faceMatchResponse = await faceComparisonRequest;

//       if (faceMatchResponse.FaceMatches.length) {
//         response = 1;
//         break;
//       }
//     }
//     console.log(response);
//     return response;
//   } catch (error) {
//     response = 2;
//     console.log("Error", response);
//     return response;
//   }
// };
