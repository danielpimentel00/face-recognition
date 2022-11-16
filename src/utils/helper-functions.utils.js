import AWS from "aws-sdk";
// require("dotenv").config();

new AWS.Config({
  accessKeyId: "AKIARFJQD3UBX33C5RMA", //process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: "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", //process.env.REACT_APP_AWS_SECRET_KEY,
  region: "us-east-1", //process.env.REACT_APP_AWS_REGION,
});
AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIARFJQD3UBX33C5RMA", //process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: "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", //process.env.REACT_APP_AWS_SECRET_KEY,
}); //process.env.REACT_APP_AWS_REGION });
const client = new AWS.Rekognition();

export const readFileData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target.result);
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsDataURL(file);
  });
};

export const compareFaces = async (imageAsBytes) => {
  const paramsForFaceComparison = {
    SourceImage: {
      Bytes: imageAsBytes,
    },
    TargetImage: {
      S3Object: {
        Bucket: "prog-web-facial-recognition",
        Name: "image1.jpeg",
      },
    },
    SimilarityThreshold: 70,
  };

  client.compareFaces(paramsForFaceComparison, function (err, response) {
    if (err) {
      console.log(err, err.stack);
    } else {
      response.FaceMatches.forEach((data) => {
        let position = data.Face.BoundingBox;
        let similarity = data.Similarity;
        console.log(
          `The face at: ${position.Left}, ${position.Top} matches with ${similarity} % confidence`
        );
      });
    }
  });
};
