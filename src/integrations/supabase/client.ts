// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xndzcnzpjdzexmcrotcz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZHpjbnpwamR6ZXhtY3JvdGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MDk2NzEsImV4cCI6MjA2Mzk4NTY3MX0.95m0y3NFgwoOqyT99hN5Z5G1DkHcnXbO0LvYlqt10u0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);