import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://sjqmmkfafotvjhupujoi.supabase.co', 'sb_publishable_C3TvLpCopYeqcou9OXPjfg_iv9IJx10');
async function test() {
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email: `testuser${Math.floor(Math.random() * 10000)}@testdomain.com`,
    password: 'password123'
  });
  if (authErr) { console.error("Auth Error:", authErr); return; }
  console.log("User:", authData.user?.id);
  
  const { data: custData, error: custErr } = await supabase.from('customers').insert([{
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '123456789',
    company: 'Test Co',
    address: '123 Test St',
    projectName: 'Test Project',
    country: 'Testland',
    user_id: authData.user?.id
  }]).select();
  if (custErr) { console.error("Insert Customer Error:", custErr); }
  else { console.log("Customer Inserted:", custData); }
  
  const { data: profData, error: profErr } = await supabase.from('company_profiles').insert([{
    name: 'Test Profile',
    email: 'prof@example.com',
    phone: '123456',
    address: '123 Prof St',
    country: 'Testland',
    bank: { accountName: 'Test', accountNumber: '123' },
    user_id: authData.user?.id
  }]).select();
  if (profErr) { console.error("Insert Profile Error:", profErr); }
  else { console.log("Profile Inserted:", profData); }
}
test();
