import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const supabase = createClient(
  "https://iabzmoxzbqzcqgypxctr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhYnptb3h6YnF6Y3FneXB4Y3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDgzNzAsImV4cCI6MjA4MjY4NDM3MH0.mHke56jh8WSlzzQxa7o2PIxqLRk1eyPRZerJ3avuGkQ"
);

/* AUTH */
export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getUser() {
  return (await supabase.auth.getUser()).data.user;
}

/* CASES */
export async function getCases() {
  const { data } = await supabase.from("cases").select("*").order("id");
  return data || [];
}

export async function getCase(id) {
  const { data } = await supabase.from("cases").select("*").eq("id", id).single();
  return data;
}

/* COMMENTS */
export async function getComments(caseId) {
  const { data } = await supabase
    .from("comments")
    .select("*")
    .eq("case_id", caseId)
    .order("created_at");
  return data || [];
}

export async function addComment(caseId, author, message) {
  await supabase.from("comments").insert({
    case_id: caseId,
    author,
    message
  });
}