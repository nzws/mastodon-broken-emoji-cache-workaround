import { commandFunction } from '@dotplants/cli';
import { promises } from 'fs';
import { useS3 } from '../utils/s3';

export const upgradeSchemaCopy = async ({
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

  let id = 0;
  let end = items.length;
  if (
    flags.continueId &&
    flags.continueId !== true &&
    !isNaN(parseInt(flags.continueId))
  ) {
    id = parseInt(flags.continueId);
  }
  if (flags.endId && flags.endId !== true && !isNaN(parseInt(flags.endId))) {
    end = parseInt(flags.endId);
  }

  for (let i = id; i < end; i++) {
    const item = items[i];
    try {
      const to = `cache/${item}`;
      if (!flags.dryRun) {
        await s3
          .copyObject({
            Bucket,
            Key: to,
            CopySource: `${Bucket}/${item}`,
            ACL: 'public-read'
          })
          .promise();
      }
      console.log(
        `(${i + 1}, ${Math.floor(
          ((i + 1) / end) * 100
        )}%) COPY: ${item} → ${to}`
      );
    } catch (e) {
      console.error(e);
      console.log(
        '[ERROR] Failed to copy. You can resume in the following ways:'
      );
      console.log(
        `Continue from the point of failure: yarn start upgrade-schema-copy -c=${i}`
      );
      console.log(
        `Continue from the next: yarn start upgrade-schema-copy -c=${i + 1}`
      );
      break;
    }
  }
};
