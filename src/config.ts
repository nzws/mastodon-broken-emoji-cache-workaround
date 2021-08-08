import { ConfigTypes } from '@dotplants/cli';
import { checkValidList } from './commands/check-valid-list';
import { getBrokenEmojis } from './commands/get-broken-emojis';
import { patchPublicRead } from './commands/patch-public-read';
import { upgradeSchemaCopy } from './commands/upgrade-schema-copy';
import { upgradeSchemaDelete } from './commands/upgrade-schema-delete';

const config: ConfigTypes = {
  name: 'Broken Emoji Migration CLI v1.0.0',
  binName: 'yarn start',
  commands: {
    'get-broken-emojis': {
      description: '破損している絵文字一覧を取得してjsonで吐き出す',
      function: getBrokenEmojis
    },
    'check-valid-list': {
      description: 'カスタム絵文字APIからリストに問題がないかチェックする',
      function: checkValidList
    },
    'upgrade-schema-copy': {
      description: 'jsonを元にコピーを実行',
      function: upgradeSchemaCopy,
      flags: {
        dryRun: {
          name: ['dry-run', 'd'],
          description: 'テスト用',
          hasValue: 0
        },
        continueId: {
          name: ['continueId', 'c'],
          description: '失敗した場合に、再開するid',
          hasValue: 1
        },
        endId: {
          name: ['endId', 'e'],
          description: '',
          hasValue: 1
        }
      }
    },
    'patch-public-read': {
      description: 'public-readに変更',
      function: patchPublicRead,
      flags: {
        dryRun: {
          name: ['dry-run', 'd'],
          description: 'テスト用',
          hasValue: 0
        },
        continueId: {
          name: ['continueId', 'c'],
          description: '失敗した場合に、再開するid',
          hasValue: 1
        }
      }
    },
    'upgrade-schema-delete': {
      description: 'jsonを元に元ファイルの削除を実行',
      function: upgradeSchemaDelete,
      flags: {
        dryRun: {
          name: ['dry-run', 'd'],
          description: 'テスト用',
          hasValue: 0
        },
        continueId: {
          name: ['continueId', 'c'],
          description: '失敗した場合に、再開するid',
          hasValue: 1
        }
      }
    }
  }
};

export default config;
