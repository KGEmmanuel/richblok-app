import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

admin.initializeApp();
const db = admin.firestore();

const stripeSecret = functions.config().stripe?.secret_key || process.env.STRIPE_SECRET_KEY || '';
const webhookSecret = functions.config().stripe?.webhook_secret || process.env.STRIPE_WEBHOOK_SECRET || '';
const proPriceId = functions.config().stripe?.pro_price_id || process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly';

const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' });

/**
 * Triggered when a new Firebase Auth user is created.
 * Creates a Stripe Customer and stores the customerId on the user document.
 */
export const createStripeCustomer = functions.auth.user().onCreate(async (user) => {
  try {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { firebaseUid: user.uid }
    });

    await db.doc(`utilisateurs/${user.uid}`).set({
      stripe_customer_id: customer.id,
      subscription_tier: 'free',
      subscription_status: 'free',
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      email: user.email,
      profile_complete: false
    }, { merge: true });

    return { customerId: customer.id };
  } catch (error: any) {
    console.error('createStripeCustomer error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * HTTPS Callable: creates a Stripe Checkout session for the Pro tier.
 * Returns the Checkout URL for the client to redirect to.
 */
export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  const uid = context.auth.uid;
  const userDoc = await db.doc(`utilisateurs/${uid}`).get();
  const userData = userDoc.data();

  if (!userData?.stripe_customer_id) {
    throw new functions.https.HttpsError('failed-precondition', 'No Stripe customer found');
  }

  const successUrl = data.successUrl || 'https://richblok-app-production-86b6.up.railway.app/profile?subscription=success';
  const cancelUrl = data.cancelUrl || 'https://richblok-app-production-86b6.up.railway.app/profile?subscription=cancelled';

  try {
    const session = await stripe.checkout.sessions.create({
      customer: userData.stripe_customer_id,
      mode: 'subscription',
      line_items: [{ price: proPriceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { firebaseUid: uid }
    });

    return { sessionId: session.id, url: session.url };
  } catch (error: any) {
    console.error('createCheckoutSession error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * HTTPS Callable: creates a Stripe Customer Portal session for self-service billing.
 */
export const createPortalSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  const uid = context.auth.uid;
  const userDoc = await db.doc(`utilisateurs/${uid}`).get();
  const userData = userDoc.data();

  if (!userData?.stripe_customer_id) {
    throw new functions.https.HttpsError('failed-precondition', 'No Stripe customer found');
  }

  const returnUrl = data.returnUrl || 'https://richblok-app-production-86b6.up.railway.app/settings';

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userData.stripe_customer_id,
      return_url: returnUrl
    });

    return { url: portalSession.url };
  } catch (error: any) {
    console.error('createPortalSession error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * HTTP Webhook handler for Stripe subscription lifecycle events.
 * Updates the user's subscription_status and subscription_tier in Firestore.
 */
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];

  if (!sig || typeof sig !== 'string') {
    res.status(400).send('Missing stripe-signature header');
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const uid = (sub.metadata as any)?.firebaseUid;
        if (uid) {
          await db.doc(`utilisateurs/${uid}`).update({
            subscription_status: sub.status === 'active' ? 'pro' : sub.status,
            subscription_tier: sub.status === 'active' ? 'pro' : 'free',
            stripe_subscription_id: sub.id,
            subscription_current_period_end: admin.firestore.Timestamp.fromMillis(sub.current_period_end * 1000)
          });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const uid = (sub.metadata as any)?.firebaseUid;
        if (uid) {
          await db.doc(`utilisateurs/${uid}`).update({
            subscription_status: 'cancelled',
            subscription_tier: 'free',
            stripe_subscription_id: admin.firestore.FieldValue.delete()
          });
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const userQuery = await db.collection('utilisateurs')
          .where('stripe_customer_id', '==', customerId)
          .limit(1).get();
        if (!userQuery.empty) {
          await userQuery.docs[0].ref.update({
            subscription_status: 'past_due'
          });
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    res.status(500).send(`Webhook handler error: ${error.message}`);
  }
});

/**
 * Sends a referral invite email via Resend (or a placeholder log in dev).
 * Production: configure functions:config:set resend.api_key="re_..."
 */
export const sendInviteEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in to send invites');
  }

  const to = data.to;
  const inviteCode = data.inviteCode;
  const referrerEmail = context.auth.token.email || 'a friend';

  if (!to || !inviteCode) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing to or inviteCode');
  }

  const resendApiKey = functions.config().resend?.api_key || process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log(`[DEV MODE] Would send invite email to ${to} with code ${inviteCode}`);
    return { success: true, mode: 'dev' };
  }

  const inviteUrl = `https://richblok-app-production-86b6.up.railway.app/register?ref=${inviteCode}`;
  const subject = `${referrerEmail} invited you to join RichBlok`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
      <h1 style="color: #1e88e5;">You've been invited to RichBlok</h1>
      <p><strong>${referrerEmail}</strong> thinks you'd love RichBlok — the verified-skills network where recruiters trust your profile from day one.</p>
      <p>When you sign up using their referral, you both get a free month of Pro.</p>
      <a href="${inviteUrl}" style="display: inline-block; background: #1e88e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Accept Invite</a>
      <p style="color: #666; font-size: 12px;">Or paste this link: ${inviteUrl}</p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'RichBlok <invites@richblok.com>',
        to,
        subject,
        html
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Resend API error: ${errorText}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('sendInviteEmail error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Helper callable: increment monthly challenge submission counter for free-tier rate limiting.
 */
export const recordChallengeSubmission = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  const uid = context.auth.uid;
  await db.collection('challenge_submissions').add({
    uid,
    challenge_id: data.challengeId,
    submitted_at: admin.firestore.FieldValue.serverTimestamp()
  });

  return { success: true };
});
