import { StripeService } from './stripe.service';

function config(map: Record<string, unknown>) {
  return {
    get: (key: string) => map[key],
  } as never;
}

describe('StripeService mock mode (M3-19/M3-21)', () => {
  it('is mock when secret missing', () => {
    const svc = new StripeService(config({ STRIPE_SECRET_KEY: undefined, STRIPE_MOCK: false }));
    expect(svc.isMockMode()).toBe(true);
  });

  it('is mock when STRIPE_MOCK forced', () => {
    const svc = new StripeService(
      config({ STRIPE_SECRET_KEY: 'sk_test_x', STRIPE_MOCK: true }),
    );
    expect(svc.isMockMode()).toBe(true);
  });

  it('creates mock customer and setup intent without PAN', async () => {
    const svc = new StripeService(config({}));
    const customer = await svc.createCustomer({
      email: 'mock@clox.test',
      name: 'Mock',
    });
    expect(customer.id).toMatch(/^cus_mock_/);
    expect(customer.mock).toBe(true);

    const setup = await svc.createSetupIntent(customer.id);
    expect(setup.id).toMatch(/^seti_mock_/);
    expect(setup.clientSecret).toContain('secret_mock');
    expect(setup.mock).toBe(true);

    const pm = await svc.attachPaymentMethod({
      customerId: customer.id,
      paymentMethodId: 'pm_card_visa',
    });
    expect(pm.paymentMethodId).toMatch(/^pm_/);
    expect(pm.mock).toBe(true);
  });
});
