import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../config/env.js';

let razorpay = null;

function getClient() {
  if (!razorpay && env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
}

export function createOrder(amount, receipt) {
  const client = getClient();
  if (!client) throw new Error('Razorpay not configured');
  return client.orders.create({
    amount, // in paise
    currency: 'INR',
    receipt,
    notes: { source: 'agriforge' },
  });
}

export function verifySignature(orderId, paymentId, signature) {
  const expected = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
}

export function verifyWebhookSignature(body, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret || env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest('hex');
  return expected === signature;
}
