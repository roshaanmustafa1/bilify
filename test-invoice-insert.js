import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://sjqmmkfafotvjhupujoi.supabase.co', 'sb_publishable_C3TvLpCopYeqcou9OXPjfg_iv9IJx10');
async function test() {
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email: `testuser${Math.floor(Math.random() * 10000)}@testdomain.com`,
    password: 'password123'
  });
  
  const payload = {
    invoice_number: 'INV-001',
    project_name: 'Test',
    date: '2023-01-01',
    due_date: '2023-01-31',
    customer_id: '00000000-0000-0000-0000-000000000000',
    currency: 'USD',
    items: [],
    subtotal: 0,
    tax_total: 0,
    discount: 0,
    total: 0,
    notes: '',
    terms: '',
    status: 'Draft',
    template: 'TemplateCorporate',
    user_id: authData?.user?.id
  };
  
  const { error } = await supabase.from('invoices').insert([payload]);
  console.log("Insert Error:", error);
}
test();
