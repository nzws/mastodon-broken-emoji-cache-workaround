import AWS from 'aws-sdk';

export const useS3 = (): AWS.S3 => {
  const { S3_REGION, S3_ENDPOINT, S3_BUCKET } = process.env;
  if (!(S3_REGION && S3_ENDPOINT && S3_BUCKET)) {
    throw new Error('required environment variable is not provided.');
  }

  AWS.config.region = S3_REGION;
  const ep = new AWS.Endpoint(S3_ENDPOINT);

  const s3 = new AWS.S3({ endpoint: ep });

  return s3;
};
