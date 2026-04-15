export interface Referral {
  id?: string;
  referrerUid: string;
  referrerEmail?: string;
  referredEmail: string;
  referredUid?: string;       // populated when invited user signs up
  status: 'pending' | 'signed_up' | 'subscribed' | 'rewarded';
  createdAt?: any;            // Firestore Timestamp
  signedUpAt?: any;
  subscribedAt?: any;
  rewardClaimedAt?: any;
  rewardType?: 'free_month' | 'discount';
  inviteCode: string;         // 6-char referrer code
}

export interface ReferralStats {
  totalSent: number;
  signedUp: number;
  subscribed: number;
  freeMonthsEarned: number;
}
