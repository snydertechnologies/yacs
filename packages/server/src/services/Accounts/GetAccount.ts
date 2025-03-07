import { TransformerInjectable } from '@bigcapital/server/lib/Transformer/TransformerInjectable';
import I18nService from '@bigcapital/server/services/I18n/I18nService';
import HasTenancyService from '@bigcapital/server/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { AccountTransformer } from './AccountTransform';

@Service()
export class GetAccount {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private i18nService: I18nService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the given account details.
   * @param {number} tenantId
   * @param {number} accountId
   */
  public getAccount = async (tenantId: number, accountId: number) => {
    const { Account } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    // Find the given account or throw not found error.
    const account = await Account.query().findById(accountId).throwIfNotFound();

    const accountsGraph = await accountRepository.getDependencyGraph();

    // Transformes the account model to POJO.
    const transformed = await this.transformer.transform(tenantId, account, new AccountTransformer(), {
      accountsGraph,
    });
    return this.i18nService.i18nApply([['accountTypeLabel'], ['accountNormalFormatted']], transformed, tenantId);
  };
}
