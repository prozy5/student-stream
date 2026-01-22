<!-- Supabase Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
  // SS:I Supabase Configuration
  const SUPABASE_URL = "https://iabzmoxzbqzcqgypxctr.supabase.co";

  // ⚠️ Replace this with your real anon public key
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhYnptb3h6YnF6Y3FneXB4Y3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDgzNzAsImV4cCI6MjA4MjY4NDM3MH0.mHke56jh8WSlzzQxa7o2PIxqLRk1eyPRZerJ3avuGkQ";

  // Create client
  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log("SS:I Supabase connected");
</script>