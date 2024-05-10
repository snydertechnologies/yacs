import { SubscriptionRepository, SystemUserRepository, TenantRepository } from '@/system/repositories';
import Container from 'typedi';

export default () => {
  const knex = Container.get('knex');
  const cache = Container.get('cache');

  return {
    systemUserRepository: new SystemUserRepository(knex, cache),
    subscriptionRepository: new SubscriptionRepository(knex, cache),
    tenantRepository: new TenantRepository(knex, cache),
  };
};
