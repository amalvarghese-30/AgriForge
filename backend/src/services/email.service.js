import { Resend } from 'resend';
import { env } from '../config/env.js';

let resend = null;

function getClient() {
  if (!resend && env.RESEND_API_KEY) {
    resend = new Resend(env.RESEND_API_KEY);
  }
  return resend;
}

export async function send({ to, subject, html }) {
  const client = getClient();
  if (!client) return null;
  try {
    const result = await client.emails.send({
      from: `AgriForge <${env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
    return result;
  } catch (err) {
    console.error('Email send failed:', err);
    return null;
  }
}

export async function sendWelcome(user) {
  return send({
    to: user.email,
    subject: 'Welcome to AgriForge',
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h1 style="color:#16a34a;">Welcome to AgriForge, ${user.fullName}!</h1>
      <p>Your account has been created successfully. You can now browse and purchase agricultural machinery and equipment.</p>
      <p>If you have any questions, reply to this email.</p>
    </div>`,
  });
}

export async function sendOrderConfirmation(order) {
  const itemsHtml = order.items.map(i => `<tr><td style="padding:8px 0;">${i.title}${i.variantName ? ` (${i.variantName})` : ''}</td><td style="padding:8px 0;text-align:center;">x${i.quantity}</td><td style="padding:8px 0;text-align:right;">₹${i.price.toLocaleString('en-IN')}</td></tr>`).join('');
  return send({
    to: order.shippingAddress?.email,
    subject: `Order Confirmed #${order.orderNumber}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h1 style="color:#16a34a;">Order Confirmed</h1>
      <p>Your order <strong>#${order.orderNumber}</strong> has been placed successfully.</p>
      <table style="width:100%;border-collapse:collapse;">${itemsHtml}</table>
      <hr style="border-color:#e5e7eb;margin:16px 0;" />
      <p style="text-align:right;"><strong>Total: ₹${order.total.toLocaleString('en-IN')}</strong></p>
      <p>We'll notify you when your order ships.</p>
    </div>`,
  });
}

export async function sendShippingUpdate(order) {
  return send({
    to: order.shippingAddress?.email,
    subject: `Order Shipped #${order.orderNumber}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h1 style="color:#16a34a;">Your Order Has Shipped!</h1>
      <p>Order <strong>#${order.orderNumber}</strong> is on its way.</p>
      ${order.trackingNumber ? `<p>Tracking Number: <strong>${order.trackingNumber}</strong></p>` : ''}
      <p>Delivery to: ${order.shippingAddress?.fullName}, ${order.shippingAddress?.city}, ${order.shippingAddress?.pincode}</p>
    </div>`,
  });
}

export async function sendStockNotification(productTitle, email) {
  return send({
    to: email,
    subject: `Back in Stock: ${productTitle}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h1 style="color:#16a34a;">Back in Stock!</h1>
      <p><strong>${productTitle}</strong> is now available. Visit AgriForge to order.</p>
    </div>`,
  });
}
