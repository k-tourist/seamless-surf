
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tykerrffdqepbgnpwjys.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5a2VycmZmZHFlcGJnbnB3anlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MDYxNDYsImV4cCI6MjA1NjM4MjE0Nn0.TDENYYjtxidRg1DRZ-4u0L0XkmPqdZyqIGJ4FsTD4fg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});
