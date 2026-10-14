const base = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
export const json = (data, status=200) => new Response(JSON.stringify(data), {status, headers:{"Content-Type":"application/json", "Cache-Control":"no-store"}});
export const body = async (req) => { try { return await req.json(); } catch { return {}; } };
export const hash = async (value) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,"0")).join("");
};
export const randomToken = () => crypto.randomUUID()+"."+crypto.randomUUID();
export async function db(path, options={}) {
  if (!base || !key) throw new Error("Backend environment is not configured");
  const response = await fetch(`${base}/rest/v1/${path}`, { ...options, headers:{apikey:key, Authorization:`Bearer ${key}`, "Content-Type":"application/json", ...(options.headers||{})} });
  const text = await response.text();
  let data; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) throw new Error(typeof data === "object" ? (data.message || data.details || `Supabase returned ${response.status}`) : `Supabase returned ${response.status}`);
  return data;
}
export async function adminUser(req) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return null;
  const response = await fetch(`${base}/auth/v1/user`, {headers:{apikey:process.env.SUPABASE_ANON_KEY || "", Authorization:`Bearer ${token}`}});
  if (!response.ok) return null;
  const user = await response.json();
  const rows = await db(`admin_allowlist?user_id=eq.${encodeURIComponent(user.id)}&select=user_id&limit=1`);
  return rows?.length ? user : null;
}
export const fail = (e) => json({error: e?.message || "Unexpected server error"}, 500);
