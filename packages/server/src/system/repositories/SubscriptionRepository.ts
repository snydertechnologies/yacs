import { PlanSubscription } from '@bigcapital/server/system/models';
import SystemRepository from '@bigcapital/server/system/repositories/SystemRepository';

export default class SubscriptionRepository extends SystemRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return PlanSubscription.bindKnex(this.knex);
  }

  /**
   * Retrieve subscription from a given slug in specific tenant.
   * @param {string} slug
   * @param {number} tenantId
   */
  getBySlugInTenant(slug: string, tenantId: number) {
    const cacheKey = this.getCacheKey('getBySlugInTenant', slug, tenantId);

    return this.cache.get(cacheKey, () => {
      return PlanSubscription.query().findOne('slug', slug).where('tenant_id', tenantId);
    });
  }
}
