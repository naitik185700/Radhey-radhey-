import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt } = body;

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret';

    // In a live Razorpay integration:
    // const instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
    // const order = await instance.orders.create({ amount: amount * 100, currency, receipt });

    // Generate mock compliant order object for development/testing
    const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    return NextResponse.json({
      orderId: mockOrderId,
      amount: Math.round(amount * 100), // amount in paise
      currency,
      keyId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
