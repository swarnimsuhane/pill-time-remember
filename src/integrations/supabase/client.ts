
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://apnjcagpjdutxddnzfmu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwbmpjYWdwamR1dHhkZG56Zm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2ODg2ODUsImV4cCI6MjA2NDI2NDY4NX0.cd5mJXFg-L3Q_RncUpLUA-nyhBNkqbvedHfcDhWvNhg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
