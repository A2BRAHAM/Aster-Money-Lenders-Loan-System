
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nwebisutntdnxypyovoj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53ZWJpc3V0bnRkbnh5cHlvdm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxOTA3NzAsImV4cCI6MjA4Mzc2Njc3MH0.nzg3rLU9XydS9eQI-C_nUfxYNkGRDsPWG8ZY2GZYZ3A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
