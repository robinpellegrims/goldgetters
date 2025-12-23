import type { Payload } from 'payload';

export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info('Seeding data...');

  const adminEmail = process.env.PAYLOAD_ADMIN_EMAIL;
  const adminPassword = process.env.PAYLOAD_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    payload.logger.warn(
      'PAYLOAD_ADMIN_EMAIL or PAYLOAD_ADMIN_PASSWORD not set. Skipping admin user creation.',
    );
    return;
  }

  await payload.create({
    collection: 'users',
    data: {
      email: adminEmail,
      password: adminPassword,
    },
  });

  payload.logger.info('Seeding complete!');
};
