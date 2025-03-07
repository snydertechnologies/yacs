import BaseModel from '@bigcapital/server/models/Model';

export default class TenantMetadata extends BaseModel {
  baseCurrency: string;
  name: string;

  /**
   * Table name.
   */
  static get tableName() {
    return 'tenants_metadata';
  }
}
