export type SubscriptionTier = 'free' | 'pro' | 'team';
export type SubscriptionStatus = 'free' | 'pro' | 'cancelled' | 'past_due';

export interface UserSubscription {
  subscription_status: SubscriptionStatus;
  subscription_tier: SubscriptionTier;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_current_period_end?: Date;
}
