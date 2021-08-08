import { commandFunction } from '@dotplants/cli';
import { promises } from 'fs';
import { useS3 } from '../utils/s3';

const timer = (ms = 15 * 1000) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const upgradeSchemaDelete = async ({
  flags
}: commandFunction): Promise<void> => {
  const s3 = useS3();
  const Bucket = process.env.S3_BUCKET as string;
  if (!Bucket) {
    throw new Error('S3_BUCKET are required, but not provided.');
  }
  const itemsText = await promises.readFile('result.json', {
    encoding: 'utf8'
  });
  const items = JSON.parse(itemsText) as string[];

  if (flags.dryRun) {
    console.log('[WARNING] Running in debug mode.');
  }

  console.log('[WARNING] The original file will be deleted after 15 seconds.');
  await timer();

  let id = 0;
  if (
    flags.continueId &&
    flags.continueId !== true &&
    !isNaN(parseInt(flags.continueId))
  ) {
    id = parseInt(flags.continueId);
  }

  for (let i = id; i < items.length; i++) {
    const item = items[i];
    try {
      if (!flags.dryRun) {
        await s3
          .deleteObject({
            Bucket,
            Key: item
          })
          .promise();
      }
      console.log(
        `(${i + 1}, ${Math.floor(
          ((i + 1) / items.length) * 100
        )}%) DELETE: ${item}`
      );
    } catch (e) {
      console.error(e);
      console.log(
        '[ERROR] Failed to delete. You can resume in the following ways:'
      );
      console.log(
        `Continue from the point of failure: yarn start upgrade-schema-delete -c=${i}`
      );
      console.log(
        `Continue from the next: yarn start upgrade-schema-delete -c=${i + 1}`
      );
      break;
    }
  }
};
