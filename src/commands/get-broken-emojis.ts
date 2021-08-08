import { S3 } from 'aws-sdk';
import { promises } from 'fs';
import { useS3 } from '../utils/s3';

const idRegex = /\d{3}\/\d{3}\/\d{3}/;

export const getBrokenEmojis = async (): Promise<void> => {
  const s3 = useS3();
  const Bucket = process.env.S3_BUCKET as string;

  let ContinuationToken: string | undefined;
  const targets: Record<string, S3.Object> = {};

  do {
    const list = await s3
      .listObjectsV2({
        Bucket,
        Prefix: 'custom_emojis/images',
        ContinuationToken
      })
      .promise();
    console.log(`Getting ${list.KeyCount || 0} items...`);

    list.Contents?.forEach(item => {
      const idMatch = item.Key?.match(idRegex);
      if (!idMatch?.length || !item.Key) {
        return;
      }
      const id = idMatch[0];
      if (targets[id]) {
        delete targets[id];
        return;
      }

      targets[id] = item;
    });

    ContinuationToken = list.NextContinuationToken;
  } while (ContinuationToken);

  const data = Object.values(targets).map(v => v.Key);
  const bytes = Object.values(targets).reduce(
    (acc, current) => acc + (current.Size || 0),
    0
  );
  console.log(`Succeed: ${data.length} items / ${bytes} bytes.`);

  await promises.writeFile('result.json', JSON.stringify(data));
};
