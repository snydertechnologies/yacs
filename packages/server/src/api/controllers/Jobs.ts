import BaseController from '@bigcapital/server/api/controllers/BaseController';
import { ServiceError } from '@bigcapital/server/exceptions';
import JobsService from '@bigcapital/server/services/Jobs/JobsService';
import { type NextFunction, type Request, type Response, Router } from 'express';
import { Inject, Service } from 'typedi';

@Service()
export default class ItemsController extends BaseController {
  @Inject()
  jobsService: JobsService;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.get('/:id', this.getJob, this.handlerServiceErrors);

    return router;
  }

  /**
   * Retrieve job details.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private getJob = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const job = await this.jobsService.getJob(id);

      return res.status(200).send({
        job: this.transfromToResponse(job),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles service errors.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private handlerServiceErrors = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ServiceError) {
    }
    next(error);
  };
}
