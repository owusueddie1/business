import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan } = body;
    if (!plan || !['FREE', 'PRO', 'BUSINESS'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // TODO: Replace with Stripe when ready - keep same interface
    return NextResponse.json({
      checkoutUrl: `https://checkout.lemonsqueezy.com/checkout?plan=${encodeURIComponent(plan)}`,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to create checkout session' }, { status: 500 });
  }
}
