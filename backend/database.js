require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and Key must be provided in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase client initialized.');

module.exports = { supabase };
