import { EchangeRateLatestPOJO, ExchangeRateLatestDTO } from '@bigcapital/libs-backend';
import { ExchangeRate } from '@bigcapital/server/lib/ExchangeRate/ExchangeRate';
import { ExchangeRateServiceType } from '@bigcapital/server/lib/ExchangeRate/types';
import { TenantMetadata } from '@bigcapital/server/system/models';
import { Service } from 'typedi';

@Service()
export class ExchangeRatesService {
  /**
   * Gets the latest exchange rate.
   * @param {number} tenantId
   * @param {number} exchangeRateLatestDTO
   * @returns {EchangeRateLatestPOJO}
   */
  public async latest(tenantId: number, exchangeRateLatestDTO: ExchangeRateLatestDTO): Promise<EchangeRateLatestPOJO> {
    const organization = await TenantMetadata.query().findOne({ tenantId });

    // Assign the organization base currency as a default currency
    // if no currency is provided
    const fromCurrency = exchangeRateLatestDTO.fromCurrency || organization.baseCurrency;
    const toCurrency = exchangeRateLatestDTO.toCurrency || organization.baseCurrency;

    const exchange = new ExchangeRate(ExchangeRateServiceType.OpenExchangeRate);
    const exchangeRate = await exchange.latest(fromCurrency, toCurrency);

    return {
      baseCurrency: fromCurrency,
      toCurrency: exchangeRateLatestDTO.toCurrency,
      exchangeRate,
    };
  }
}
