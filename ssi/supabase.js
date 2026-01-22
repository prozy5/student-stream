import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const SUPABASE_URL = "https://iabzmoxzbqzcqgypxctr.supabase.co";
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhYnptb3h6YnF6Y3FneXB4Y3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDgzNzAsImV4cCI6MjA4MjY4NDM3MH0.mHke56jh8WSlzzQxa7o2PIxqLRk1eyPRZerJ3avuGkQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------- CASES ----------

export async function createCase(title, description) {
  const { data, error } = await supabase
    .from("cases")
    .insert([{ title, description, status: "open" }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCases() {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getCaseById(id) {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// ---------- FILE UPLOAD ----------

export async function uploadEvidence(caseId, file) {
  const filePath = `${caseId}/${Date.now()}_${file.name}`;

  const { error } = await supabase.storage
    .from("case-files")
    .upload(filePath, file);

  if (error) throw error;

  return filePath;
}