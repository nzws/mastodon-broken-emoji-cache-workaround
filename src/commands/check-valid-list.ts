import got from 'got';
import { promises } from 'fs';

type Emoji = {
  shortcode: string;
  url: string;
  static_url: string;
  visible_in_picker: boolean;
  category: string;
};

export const checkValidList = async (): Promise<void> => {
  const domain = process.env.MASTODON_ENDPOINT as string;
  const media = process.env.MASTODON_MEDIA_ENDPOINT as string;
  if (!domain || !media) {
    throw new Error(
      'MASTODON_ENDPOINT and MASTODON_MEDIA_ENDPOINT are required, but not provided.'
    );
  }

  const itemsText = await promises.readFile('result.json', {
    encoding: 'utf8'
  });
  const items = Object.values(
    JSON.parse(itemsText) as Record<string, string>
  ).map(item => media + item);

  const { body } = await got<Emoji[]>(`${domain}api/v1/custom_emojis`, {
    responseType: 'json'
  });

  const errors = body.filter(
    item =>
      items.indexOf(item.url) !== -1 || items.indexOf(item.static_url) !== -1
  );

  if (errors.length) {
    console.log('[ERROR] The following emojis are installed locally:');
    console.log(
      errors
        .map(item => `:${item.shortcode}: ${item.url} or ${item.static_url}`)
        .join('\n')
    );
  } else {
    console.log('✨ No data error detected in result.json.');
  }
};
