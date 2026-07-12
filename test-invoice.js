import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://sjqmmkfafotvjhupujoi.supabase.co', 'sb_publishable_C3TvLpCopYeqcou9OXPjfg_iv9IJx10');
async function test() {
  const { data, error } = await supabase.from('invoices').select('*').limit(1);
  if (error) console.error("Error:", error);
  else console.log("Data:", data);
}
test();
