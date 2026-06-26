// src/config/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usvyesisjcsujrhigjny.supabase.co';
const supabaseAnonKey = 'sb_publishable_VUPZUQkPVehrhG3lqh7_EA_07wt3ksq';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);