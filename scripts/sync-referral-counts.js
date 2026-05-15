import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false }
});

const mapBy = (items, key) =>
  new Map((items || []).filter((item) => item?.[key]).map((item) => [item[key], item]));

async function syncReferralCounts() {
  const { data: users, error } = await supabase
    .from('users')
    .select('idnum, referralCode, referredByCode, referralCount, referralBonusTotal, bonus');

  if (error) throw new Error(`Failed to fetch users: ${error.message}`);

const usersByReferralCode = mapBy(users, 'referralCode');
  const usersByIdnum = mapBy(users, 'idnum');
  const referredUsersByReferrer = new Map();

  for (const user of users || []) {
    if (!user.referredByCode) continue;

    const referrer = usersByReferralCode.get(user.referredByCode) || usersByIdnum.get(user.referredByCode);
    if (!referrer?.idnum || referrer.idnum === user.idnum) continue;

    const referrals = referredUsersByReferrer.get(referrer.idnum) || [];
    referrals.push({ referredUser: user, referralCode: user.referredByCode });
    referredUsersByReferrer.set(referrer.idnum, referrals);
  }

  let updatedUsers = 0;
  let referralRowsCreated = 0;

  for (const [referrerId, referrals] of referredUsersByReferrer.entries()) {
    const referrer = (users || []).find((user) => user.idnum === referrerId);
    const referralCount = referrals.length;
    const currentReferralCount = Number(referrer?.referralCount || 0);

    if (referralCount !== currentReferralCount) {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          referralCount,
          updated_at: new Date().toISOString()
        })
        .eq('idnum', referrerId);

      if (updateError) {
        console.error(`Failed to update referral count for ${referrerId}:`, updateError.message);
      } else {
        updatedUsers++;
      }
    }

    for (const referral of referrals) {
      const { error: upsertError } = await supabase
        .from('referrals')
        .upsert([{
          referrerId,
          referredId: referral.referredUser.idnum,
          referralCode: referral.referralCode,
          bonusEarned: 0,
          level: 1,
        }], { onConflict: 'referrerId,referredId' });

      if (upsertError) {
        console.warn(`Could not create referral row for ${referral.referredUser.idnum}:`, upsertError.message);
      } else {
        referralRowsCreated++;
      }
    }
  }

  return {
    referrersFound: referredUsersByReferrer.size,
    updatedUsers,
    referralRowsCreated,
  };
}

syncReferralCounts()
  .then((summary) => {
    console.log('Referral count sync completed:', summary);
  })
  .catch((error) => {
    console.error('Referral count sync failed:', error.message);
    process.exit(1);
  });
