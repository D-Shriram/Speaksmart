
export default async () => {
  const required = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];

  const missing = required.filter(
    (name) => !process.env[name]
  );

  return new Response(
    JSON.stringify(
      missing.length
        ? { status: "configuration_required", missing }
        : {
            status: "ok",
            message: "SpeakSmart backend is configured.",
          }
    ),
    {
      status: missing.length ? 500 : 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
