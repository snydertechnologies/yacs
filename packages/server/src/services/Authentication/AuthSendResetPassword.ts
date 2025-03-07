import {
  IAuthResetedPasswordEventPayload,
  IAuthSendedResetPassword,
  IAuthSendingResetPassword,
  IPasswordReset,
  ISystemUser,
} from '@bigcapital/libs-backend';
import config from '@bigcapital/server/config';
import { ServiceError } from '@bigcapital/server/exceptions';
import { EventPublisher } from '@bigcapital/server/lib/EventPublisher/EventPublisher';
import events from '@bigcapital/server/subscribers/events';
import { PasswordReset } from '@bigcapital/server/system/models';
import { hashPassword } from '@bigcapital/server/utils';
import moment from 'moment';
import { Inject, Service } from 'typedi';
import uniqid from 'uniqid';
import { ERRORS } from './_constants';

@Service()
export class AuthSendResetPassword {
  @Inject()
  private eventPublisher: EventPublisher;

  @Inject('repositories')
  private sysRepositories: any;

  /**
   * Generates and retrieve password reset token for the given user email.
   * @param {string} email
   * @return {<Promise<IPasswordReset>}
   */
  public async sendResetPassword(email: string): Promise<PasswordReset> {
    const user = await this.validateEmailExistance(email);

    const token: string = uniqid();

    // Triggers sending reset password event.
    await this.eventPublisher.emitAsync(events.auth.sendingResetPassword, {
      user,
      token,
    } as IAuthSendingResetPassword);

    // Delete all stored tokens of reset password that associate to the give email.
    this.deletePasswordResetToken(email);

    // Creates a new password reset row with unique token.
    const passwordReset = await PasswordReset.query().insert({ email, token });

    // Triggers sent reset password event.
    await this.eventPublisher.emitAsync(events.auth.sendResetPassword, {
      user,
      token,
    } as IAuthSendedResetPassword);

    return passwordReset;
  }

  /**
   * Resets a user password from given token.
   * @param {string} token - Password reset token.
   * @param {string} password - New Password.
   * @return {Promise<void>}
   */
  public async resetPassword(token: string, password: string): Promise<void> {
    const { systemUserRepository } = this.sysRepositories;

    // Finds the password reset token.
    const tokenModel: IPasswordReset = await PasswordReset.query().findOne('token', token);
    // In case the password reset token not found throw token invalid error..
    if (!tokenModel) {
      throw new ServiceError(ERRORS.TOKEN_INVALID);
    }
    // Different between tokne creation datetime and current time.
    if (moment().diff(tokenModel.createdAt, 'seconds') > config.resetPasswordSeconds) {
      // Deletes the expired token by expired token email.
      await this.deletePasswordResetToken(tokenModel.email);
      throw new ServiceError(ERRORS.TOKEN_EXPIRED);
    }
    const user = await systemUserRepository.findOneByEmail(tokenModel.email);

    if (!user) {
      throw new ServiceError(ERRORS.USER_NOT_FOUND);
    }
    const hashedPassword = await hashPassword(password);

    await systemUserRepository.update({ password: hashedPassword }, { id: user.id });
    // Deletes the used token.
    await this.deletePasswordResetToken(tokenModel.email);

    // Triggers `onResetPassword` event.
    await this.eventPublisher.emitAsync(events.auth.resetPassword, {
      user,
      token,
      password,
    } as IAuthResetedPasswordEventPayload);
  }

  /**
   * Deletes the password reset token by the given email.
   * @param {string} email
   * @returns {Promise}
   */
  private async deletePasswordResetToken(email: string) {
    return PasswordReset.query().where('email', email).delete();
  }

  /**
   * Validates the given email existance on the storage.
   * @throws {ServiceError}
   * @param {string} email - email address.
   */
  private async validateEmailExistance(email: string): Promise<ISystemUser> {
    const { systemUserRepository } = this.sysRepositories;
    const userByEmail = await systemUserRepository.findOneByEmail(email);

    if (!userByEmail) {
      throw new ServiceError(ERRORS.EMAIL_NOT_FOUND);
    }
    return userByEmail;
  }
}
