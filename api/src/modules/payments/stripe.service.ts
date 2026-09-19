import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import type { AppEnv } from '../../config/env.validation';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private client: Stripe | null = null;

  constructor(private readonly config: ConfigService<AppEnv, true>) {}

  isMockMode() {
    const forced = this.config.get('STRIPE_MOCK', { infer: true });
    const key = this.config.get('STRIPE_SECRET_KEY', { infer: true });
    return Boolean(forced || !key);
  }

  private getClient(): Stripe {
    if (this.isMockMode()) {
      throw new Error('Stripe client unavailable in mock mode');
    }
    if (!this.client) {
      const key = this.config.get('STRIPE_SECRET_KEY', { infer: true });
      this.client = new Stripe(key!);
    }
    return this.client;
  }

  async createCustomer(params: {
    email: string;
    name: string;
    metadata?: Record<string, string>;
  }) {
    if (this.isMockMode()) {
      const id = `cus_mock_${params.email.replace(/[^a-z0-9]/gi, '').slice(0, 18)}`;
      this.logger.warn(`STRIPE_MOCK: created customer ${id}`);
      return { id, mock: true as const };
    }
    const customer = await this.getClient().customers.create({
      email: params.email,
      name: params.name,
      metadata: params.metadata,
    });
    return { id: customer.id, mock: false as const };
  }

  async createSetupIntent(customerId: string) {
    if (this.isMockMode()) {
      const id = `seti_mock_${Date.now()}`;
      this.logger.warn(`STRIPE_MOCK: setupIntent ${id}`);
      return {
        id,
        clientSecret: `${id}_secret_mock`,
        mock: true as const,
      };
    }
    const intent = await this.getClient().setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session',
    });
    return {
      id: intent.id,
      clientSecret: intent.client_secret!,
      mock: false as const,
    };
  }

  async attachPaymentMethod(params: { customerId: string; paymentMethodId: string }) {
    if (this.isMockMode()) {
      const pm = params.paymentMethodId.startsWith('pm_')
        ? params.paymentMethodId
        : `pm_mock_${Date.now()}`;
      this.logger.warn(`STRIPE_MOCK: attach ${pm} to ${params.customerId}`);
      return { paymentMethodId: pm, mock: true as const };
    }
    const stripe = this.getClient();
    await stripe.paymentMethods.attach(params.paymentMethodId, {
      customer: params.customerId,
    });
    await stripe.customers.update(params.customerId, {
      invoice_settings: { default_payment_method: params.paymentMethodId },
    });
    return { paymentMethodId: params.paymentMethodId, mock: false as const };
  }

  /** Stripe Connect Express account (M4). Mock when no secret key. */
  async createConnectAccount(params: {
    email: string;
    businessName: string;
    metadata?: Record<string, string>;
  }) {
    if (this.isMockMode()) {
      const id = `acct_mock_${params.email.replace(/[^a-z0-9]/gi, '').slice(0, 16)}`;
      this.logger.warn(`STRIPE_MOCK: Connect account ${id}`);
      return { id, mock: true as const };
    }
    const account = await this.getClient().accounts.create({
      type: 'express',
      country: 'AU',
      email: params.email,
      business_type: 'company',
      company: { name: params.businessName },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: params.metadata,
    });
    return { id: account.id, mock: false as const };
  }

  async createAccountLink(params: {
    accountId: string;
    refreshUrl: string;
    returnUrl: string;
  }) {
    if (this.isMockMode()) {
      const url = `${params.returnUrl}${params.returnUrl.includes('?') ? '&' : '?'}connect=mock&account=${params.accountId}`;
      this.logger.warn(`STRIPE_MOCK: AccountLink ${url}`);
      return { url, mock: true as const };
    }
    const link = await this.getClient().accountLinks.create({
      account: params.accountId,
      refresh_url: params.refreshUrl,
      return_url: params.returnUrl,
      type: 'account_onboarding',
    });
    return { url: link.url, mock: false as const };
  }

  async retrieveConnectAccount(accountId: string) {
    if (this.isMockMode()) {
      return {
        id: accountId,
        payoutsEnabled: true,
        chargesEnabled: true,
        mock: true as const,
      };
    }
    const account = await this.getClient().accounts.retrieve(accountId);
    return {
      id: account.id,
      payoutsEnabled: Boolean(account.payouts_enabled),
      chargesEnabled: Boolean(account.charges_enabled),
      mock: false as const,
    };
  }
}
