import type { ITenant } from '@bigcapital/libs-backend';
import { Tenant } from '@bigcapital/server/system/models';
import moment from 'moment';
import uniqid from 'uniqid';
import SystemRepository from './SystemRepository';

export default class TenantRepository extends SystemRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return Tenant.bindKnex(this.knex);
  }

  /**
   * Creates a new tenant with random organization id.
   * @return {ITenant}
   */
  createWithUniqueOrgId(uniqId?: string): Promise<ITenant> {
    const organizationId = uniqid() || uniqId;
    return super.create({ organizationId });
  }

  /**
   * Mark as seeded.
   * @param {number} tenantId
   */
  markAsSeeded(tenantId: number) {
    return super.update(
      {
        seededAt: moment().toMySqlDateTime(),
      },
      { id: tenantId },
    );
  }

  /**
   * Mark the the given organization as initialized.
   * @param {string} organizationId
   */
  markAsInitialized(tenantId: number) {
    return super.update(
      {
        initializedAt: moment().toMySqlDateTime(),
      },
      { id: tenantId },
    );
  }
}
