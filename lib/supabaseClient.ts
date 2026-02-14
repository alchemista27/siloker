import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Job = {
  id: string;
  title: string;
  slug: string;
  company: string;
  location: string;
  salary_min: number;
  salary_max: number;
  description: string;
  created_at: string;
};

export type Application = {
  id: string;
  job_id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
};
