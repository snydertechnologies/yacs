import fs from 'fs';
import { IMediaLinkDTO } from '@bigcapital/libs-backend';
import asyncMiddleware from '@bigcapital/server/api/middleware/asyncMiddleware';
import { ServiceError } from '@bigcapital/server/exceptions';
import MediaService from '@bigcapital/server/services/Media/MediaService';
import { NextFunction, Request, Response, Router } from 'express';
import { check, param, query } from 'express-validator';
import { camelCase, upperFirst } from 'lodash';
import { Inject, Service } from 'typedi';
import BaseController from './BaseController';

const fsPromises = fs.promises;

@Service()
export default class MediaController extends BaseController {
  @Inject()
  mediaService: MediaService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/upload',
      [...this.uploadValidationSchema],
      this.validationResult,
      asyncMiddleware(this.uploadMedia.bind(this)),
      this.handlerServiceErrors,
    );
    router.post(
      '/:id/link',
      [...this.mediaIdParamSchema, ...this.linkValidationSchema],
      this.validationResult,
      asyncMiddleware(this.linkMedia.bind(this)),
      this.handlerServiceErrors,
    );
    router.delete(
      '/',
      [...this.deleteValidationSchema],
      this.validationResult,
      asyncMiddleware(this.deleteMedia.bind(this)),
      this.handlerServiceErrors,
    );
    router.get(
      '/:id',
      [...this.mediaIdParamSchema],
      this.validationResult,
      asyncMiddleware(this.getMedia.bind(this)),
      this.handlerServiceErrors,
    );
    return router;
  }

  get uploadValidationSchema() {
    return [
      // check('attachment'),
      check('model_name')
        .optional()
        .trim()
        .escape(),
      check('model_id').optional().isNumeric().toInt(),
    ];
  }

  get linkValidationSchema() {
    return [check('model_name').exists().trim().escape(), check('model_id').exists().isNumeric().toInt()];
  }

  get deleteValidationSchema() {
    return [query('ids').exists().isArray(), query('ids.*').exists().isNumeric().toInt()];
  }

  get mediaIdParamSchema() {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * Retrieve all or the given attachment ids.
   * @param {Request} req -
   * @param {Response} req -
   * @param {NextFunction} req -
   */
  async getMedia(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: mediaId } = req.params;

    try {
      const media = await this.mediaService.getMedia(tenantId, mediaId);
      return res.status(200).send({ media });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Uploads media.
   * @param {Request} req -
   * @param {Response} req -
   * @param {NextFunction} req -
   */
  async uploadMedia(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { attachment } = req.files;

    const linkMediaDTO: IMediaLinkDTO = this.matchedBodyData(req);
    const modelName = linkMediaDTO.modelName ? upperFirst(camelCase(linkMediaDTO.modelName)) : '';

    try {
      const media = await this.mediaService.upload(tenantId, attachment, modelName, linkMediaDTO.modelId);
      return res.status(200).send({ media_id: media.id });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the given attachment ids from file system and database.
   * @param {Request} req -
   * @param {Response} req -
   * @param {NextFunction} req -
   */
  async deleteMedia(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { ids: mediaIds } = req.query;

    try {
      await this.mediaService.deleteMedia(tenantId, mediaIds);
      return res.status(200).send({
        media_ids: mediaIds,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Links the given media to the specific resource model.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async linkMedia(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: mediaId } = req.params;
    const linkMediaDTO: IMediaLinkDTO = this.matchedBodyData(req);
    const modelName = upperFirst(camelCase(linkMediaDTO.modelName));

    try {
      await this.mediaService.linkMedia(tenantId, mediaId, linkMediaDTO.modelId, modelName);
      return res.status(200).send({ media_id: mediaId });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handler service errors.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  handlerServiceErrors(error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'MINETYPE_NOT_SUPPORTED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'MINETYPE_NOT_SUPPORTED', code: 100 }],
        });
      }
      if (error.errorType === 'MEDIA_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'MEDIA_NOT_FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'MODEL_NAME_HAS_NO_MEDIA') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'MODEL_NAME_HAS_NO_MEDIA', code: 300 }],
        });
      }
      if (error.errorType === 'MODEL_ID_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'MODEL_ID_NOT_FOUND', code: 400 }],
        });
      }
      if (error.errorType === 'MEDIA_IDS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'MEDIA_IDS_NOT_FOUND', code: 500 }],
        });
      }
      if (error.errorType === 'MEDIA_LINK_EXISTS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'MEDIA_LINK_EXISTS', code: 600 }],
        });
      }
    }
    next(error);
  }
}
