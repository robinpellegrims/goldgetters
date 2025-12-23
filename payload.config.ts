import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { seed } from './scripts/seed';
import { Users } from './collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users],
  editor: lexicalEditor(),
  secret:
    process.env.PAYLOAD_SECRET || 'local-dev-secret-not-for-production-use!',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url:
        process.env.DATABASE_URI ||
        process.env.DATABASE_URL ||
        'file:./payload.db',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  onInit: async (payload) => {
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    });

    if (users.totalDocs === 0) {
      await seed(payload);
    }
  },
});
