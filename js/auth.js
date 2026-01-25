import { supabase } from "./platform-guard.js";

export { supabase };

export async function logout() {
  await supabase.auth.signOut();
}