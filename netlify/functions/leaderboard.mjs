import { db, json, adminUser } from "./_shared.mjs";

export default async (req) => {
  if (req.method !== "GET") return json({ error: "Method not allowed" }, 405);
  try {
    const user = await adminUser(req);
    if (!user) return json({ error: "Admin access required. Sign in again." }, 403);

    // Explicitly close the nested participant relation in the PostgREST select.
    const rows = await db(
      "attempts?completed=eq.true&select=id,score,total_questions,duration_seconds,completed_at,participant:participants(team_number,first_name,last_name)&order=score.desc,completed_at.asc"
    );

    // Keep the best/latest completed attempt per participant identity.
    const latest = new Map();
    for (const r of rows) {
      const p = r.participant;
      if (!p) continue;
      const key = `${String(p.team_number).toLowerCase()}|${p.first_name.toLowerCase()}|${p.last_name.toLowerCase()}`;
      const item = {
        name: `${p.first_name} ${p.last_name}`,
        team: p.team_number,
        score: Number(r.score) || 0,
        total: Number(r.total_questions) || 0,
        duration: Number(r.duration_seconds) || 0,
        completedAt: r.completed_at
      };
      const prev = latest.get(key);
      if (!prev || item.score > prev.score || (item.score === prev.score && item.completedAt > prev.completedAt)) latest.set(key, item);
    }

    const individuals = [...latest.values()].sort((a, b) => b.score - a.score || a.duration - b.duration || a.name.localeCompare(b.name));
    const teamsMap = new Map();
    for (const r of individuals) {
      const key = String(r.team);
      const team = teamsMap.get(key) || { team: key, score: 0, total: 0, members: 0 };
      team.score += r.score;
      team.total += r.total;
      team.members += 1;
      teamsMap.set(key, team);
    }
    const teams = [...teamsMap.values()].sort((a, b) => b.score - a.score || b.total - a.total || String(a.team).localeCompare(String(b.team)));
    return json({ individuals, teams });
  } catch (e) {
    return json({ error: e.message || "Leaderboard unavailable" }, 500);
  }
};
