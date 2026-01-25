import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/* ================================
   CONFIG
================================ */

const SUPABASE_URL = "https://iabzmoxzbqzcqgypxctr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhYnptb3h6YnF6Y3FneXB4Y3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDgzNzAsImV4cCI6MjA4MjY4NDM3MH0.mHke56jh8WSlzzQxa7o2PIxqLRk1eyPRZerJ3avuGkQ";

const PUBLIC_PATHS = [
  "/",
  "/index.html",
  "/waitlist.html",
  "/auth/login.html",
  "/auth/signup.html",
  "/about.html",
  "/apply.html"
];

/* ================================
   CLIENT
================================ */

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ================================
   GUARD LOGIC
================================ */

function isPublicPage() {
  return PUBLIC_PATHS.includes(window.location.pathname);
}

async function protectPlatform() {
  if (isPublicPage()) return;

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect();
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !data || data.role !== "owner") {
    redirect();
  }
}

function redirect() {
  window.location.replace("/waitlist.html");
}

/* ================================
   RUN
================================ */

protectPlatform();