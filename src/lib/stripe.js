import Stripe from 'stripe';

let stripeClient;

export const isStripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLIC_KEY);

export const getStripe = () => {
  if (!isStripeConfigured()) {
    throw new Error('Stripe is not configured.');
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  return stripeClient;
};

export const getBaseUrl = () => {
  const authUrl = process.env.NEXTAUTH_URL || process.env.NEXTAUTHH_URL;
  return authUrl || 'http://localhost:3000';
};
