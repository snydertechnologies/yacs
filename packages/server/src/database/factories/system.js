import systemDb from '@bigcapital/server/database/knex';
import KnexFactory from '@bigcapital/server/lib/KnexFactory';
import faker from 'faker';

export default () => {
  const factory = new KnexFactory(systemDb);

  factory.define('password_reset', 'password_resets', async () => {
    return {
      email: faker.lorem.email,
      token: faker.lorem.slug,
    };
  });

  return factory;
};
