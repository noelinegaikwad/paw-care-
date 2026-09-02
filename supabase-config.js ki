window.PAWCARE_CONFIG = {
  SUPABASE_URL: "https://zyoshujmkmiixxwprntm.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_yTB5GoXLEpRevdgE10OMSw_CdGV0FkJ"
};

if (
  window.PAWCARE_CONFIG.SUPABASE_URL &&
  window.PAWCARE_CONFIG.SUPABASE_ANON_KEY &&
  !window.PAWCARE_CONFIG.SUPABASE_URL.includes("YOUR_SUPABASE")
) {
  window.pawSupabase = window.supabase.createClient(
    window.PAWCARE_CONFIG.SUPABASE_URL,
    window.PAWCARE_CONFIG.SUPABASE_ANON_KEY
  );
}