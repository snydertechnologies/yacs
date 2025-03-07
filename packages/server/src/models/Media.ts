import TenantModel from '@bigcapital/server/models/TenantModel';
import { Model } from 'objection';

export default class Media extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'media';
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const MediaLink = require('@bigcapital/server/models/MediaLink');

    return {
      links: {
        relation: Model.HasManyRelation,
        modelClass: MediaLink.default,
        join: {
          from: 'media.id',
          to: 'media_links.media_id',
        },
      },
    };
  }
}
