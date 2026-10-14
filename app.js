import { DEMO_QUESTIONS } from "./questions.js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

const $ = (id) => document.getElementById(id);
const views = ["homeView","quizView","thanksView","requestView","adminLoginView","adminView","celebrationView"];
const ATTEMPT_KEY = "speaksmart_demo_completed";
const SESSION_KEY = "speaksmart_participant_session";
let questions = [], index = 0, score = 0, secondsLeft = 15, timerId = null;
let participant = null, participantToken = null, participantId = null, startedAt = 0, completedScores = [], activeAdminTab = "individual";
let supabase = null, adminSession = null;

function show(viewId) {
  views.forEach(id => $(id).classList.toggle("hidden", id !== viewId));
  window.scrollTo({top: 0, behavior: "smooth"});
}
function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function stopTimer() { if (timerId) clearInterval(timerId); timerId = null; }
function setMessage(id, text) { const el = $(id); if (el) el.textContent = text; }
function getCompleted() {
  try { return JSON.parse(localStorage.getItem(ATTEMPT_KEY) || "null"); } catch { return null; }
}
function setCompleted(data) {
  try { localStorage.setItem(ATTEMPT_KEY, JSON.stringify(data)); } catch {}
}
function cleanName(s) { return s.trim().replace(/\s+/g, " ").slice(0, 50); }

async function initSupabase() {
  if (!SUPABASE_URL.startsWith("https://") || SUPABASE_ANON_KEY.startsWith("PASTE_")) return;
  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data } = await supabase.auth.getSession();
    adminSession = data.session;
  } catch (err) {
    console.warn("Supabase could not initialize:", err);
  }
}
await initSupabase();

const completedAtLoad = getCompleted();
try {
  const savedSession = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  if (savedSession) { participant = savedSession.participant; participantToken = savedSession.participantToken; participantId = savedSession.participantId; }
} catch {}
function restoreCompletedScreen(result) {
  if (!result) return;
  const first = result.participant?.first || "there";
  setMessage("thanksText", `Thank you, ${first}! Your quiz result has been saved.`);
  setMessage("finalScore", `${Number(result.score) || 0} / ${Number(result.total) || 12}`);
  show("thanksView");
}
if (completedAtLoad) restoreCompletedScreen(completedAtLoad);

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (participantToken) headers["x-participant-token"] = participantToken;
  const response = await fetch(`/.netlify/functions/${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}

async function startQuizForParticipant() {
  const data = await api("questions");
  questions = shuffle(data.questions).map(q => ({...q, options: shuffle(q.options)}));
  index = 0; score = 0; completedScores = []; startedAt = Date.now();
  $("timer").style.borderColor = "";
  show("quizView");
  renderQuestion();
}

$("requestBtn").addEventListener("click", () => {
  setMessage("requestMessage", "");
  $("requestCode").value = "";
  show("requestView");
});
$("cancelRequest").addEventListener("click", () => show(getCompleted() ? "thanksView" : "homeView"));
$("requestForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!participantId || !participantToken) {
    setMessage("requestMessage", "Please contact the administrator to authorize another attempt.");
    return;
  }
  const submitButton = e.submitter;
  if (submitButton) submitButton.disabled = true;
  try {
    await api("request-attempt", { method: "POST", body: JSON.stringify({ participantId, code: $("requestCode").value.trim() }) });
    localStorage.removeItem(ATTEMPT_KEY);
    setMessage("requestMessage", "Another attempt approved. Starting your quiz…");
    await startQuizForParticipant();
  } catch (err) {
    setMessage("requestMessage", `${err.message} If the code is correct, ask the administrator to check REQUEST_CODE and the retry_allowed database column.`);
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});

$("participantForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (getCompleted()) { show("thanksView"); return; }
  participant = { team: cleanName($("teamNumber").value), first: cleanName($("firstName").value), last: cleanName($("lastName").value) };
  if (!participant.team || !participant.first || !participant.last) return;
  setMessage("quizMessage", "Connecting to quiz…");
  try {
    const data = await api("register", { method: "POST", body: JSON.stringify(participant) });
    participantId = data.participant.id;
    participantToken = data.participantToken;
    participant = { team: data.participant.team, first: data.participant.first, last: data.participant.last };
    localStorage.setItem(SESSION_KEY, JSON.stringify({ participant, participantId, participantToken }));
    await startQuizForParticipant();
  } catch (err) {
    setMessage("participantMessage", err.message || "Could not register. Please try again.");
  }
});
function renderQuestion() {
  stopTimer();
  if (index >= questions.length) { finishQuiz(); return; }
  const q = questions[index];
  secondsLeft = q.seconds;
  $("difficultyPill").textContent = q.difficulty.toUpperCase();
  $("questionCounter").textContent = `QUESTION ${index + 1} / ${questions.length}`;
  $("progressBar").style.width = `${(index / questions.length) * 100}%`;
  $("timer").textContent = `${secondsLeft}s`;
  $("timer").style.borderColor = "";
  $("questionText").textContent = q.question;
  $("options").replaceChildren();
  setMessage("quizMessage", "");
  q.options.forEach((option, i) => {
    const button = document.createElement("button");
    button.className = "option";
    const key = document.createElement("span");
    key.className = "option-key";
    key.textContent = String.fromCharCode(65 + i);
    const label = document.createElement("span");
    label.textContent = option;
    button.append(key, label);
    button.addEventListener("click", () => answerQuestion(option, false));
    $("options").appendChild(button);
  });
  timerId = setInterval(() => {
    secondsLeft--;
    $("timer").textContent = `${secondsLeft}s`;
    if (secondsLeft <= 5) $("timer").style.borderColor = "#fa7e9a";
    if (secondsLeft <= 0) answerQuestion(null, true);
  }, 1000);
}
function answerQuestion(selected, timedOut) {
  if (!timerId) return;
  stopTimer();
  const q = questions[index];
  completedScores.push({ questionId: q.id, answer: selected ?? "" });
  [...$("options").children].forEach(button => {
    button.disabled = true;
    const label = button.querySelector("span:last-child").textContent;
    if (label === selected) button.classList.add("selected");
  });
  setMessage("quizMessage", timedOut ? "Time's up! Moving on…" : "Answer recorded. Moving on…");
  index++;
  $("progressBar").style.width = `${(index / questions.length) * 100}%`;
  setTimeout(renderQuestion, 450);
}
async function finishQuiz() {
  stopTimer();
  const duration = Math.round((Date.now() - startedAt) / 1000);
  try {
    const data = await api("submit", { method: "POST", body: JSON.stringify({ participantId, answers: completedScores, duration }) });
    const result = { participant, score: data.result.score, total: data.result.total, duration, completedAt: new Date().toISOString() };
    setCompleted(result);
    $("thanksText").textContent = `Thank you, ${participant.first}! Your quiz result has been saved.`;
    $("finalScore").textContent = `${result.score} / ${result.total}`;
    show("thanksView");
  } catch (err) {
    setMessage("quizMessage", `Could not save your score: ${err.message}. Please contact the administrator; do not refresh this page.`);
    show("quizView");
  }
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function renderTable(container, headers, rows) {
  if (!rows.length) {
    $(container).innerHTML = '<p class="muted">No completed scores yet. Complete a demo quiz first.</p>';
    return;
  }
  const table = document.createElement("table");
  table.innerHTML = `<thead><tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>`;
  const tbody = document.createElement("tbody");
  rows.forEach(row => {
    const tr = document.createElement("tr");
    row.forEach((cell, i) => {
      const td = document.createElement("td");
      td.textContent = cell;
      if (i === 0) td.className = "rank";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  const wrap = document.createElement("div");
  wrap.className = "table-wrap";
  wrap.appendChild(table);
  $(container).replaceChildren(wrap);
}
async function loadAdminData() {
  try {
    if (!adminSession?.access_token) throw new Error("Please sign in again to load admin results.");
    const response = await fetch("/.netlify/functions/leaderboard", {
      headers: { Authorization: `Bearer ${adminSession.access_token}` },
      cache: "no-store"
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Leaderboard request failed (${response.status})`);
    const { individuals = [], teams = [] } = payload;
    $("statParticipants").textContent = individuals.length;
    $("statTeams").textContent = new Set(individuals.map(r => r.team)).size;
    $("statAttempts").textContent = individuals.length;
    renderTable("individualTable", ["Rank","Participant","Team","Score","Time"], individuals.map((r,i)=>[String(i+1),r.name,r.team,`${r.score}/${r.total}`,`${r.duration}s`]));
    renderTable("teamsTable", ["Rank","Team","Members","Combined points","Possible"], teams.map((r,i)=>[String(i+1),`Team ${r.team}`,String(r.members),String(r.score),`${r.score}/${r.total}`]));
    setMessage("adminMessage", "Leaderboard data loaded from Supabase.");
  } catch (err) { setMessage("adminMessage", `Could not load leaderboard: ${err.message}`); }
}
$("adminLoginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  setMessage("adminLoginMessage", "");
  if (!supabase) {
    setMessage("adminLoginMessage", "Supabase is not configured yet. Follow the setup steps, then try again.");
    return;
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email: $("adminEmail").value.trim(),
    password: $("adminPassword").value
  });
  if (error) { setMessage("adminLoginMessage", error.message); return; }
  adminSession = data.session;
  const check = await fetch("/.netlify/functions/admin-results", { headers: { Authorization: `Bearer ${adminSession.access_token}` } });
  if (!check.ok) { setMessage("adminLoginMessage", "This account is not authorized as an administrator."); await supabase.auth.signOut(); adminSession = null; return; }
  show("adminView");
  await loadAdminData();
});
$("adminLogout").addEventListener("click", async () => {
  if (supabase) await supabase.auth.signOut();
  adminSession = null;
  show("adminLoginView");
});
document.querySelectorAll(".tab").forEach(button => button.addEventListener("click", () => {
  activeAdminTab = button.dataset.tab;
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b === button));
  $("individualTab").classList.toggle("hidden", activeAdminTab !== "individual");
  $("teamsTab").classList.toggle("hidden", activeAdminTab !== "teams");
  $("celebrateTab").classList.toggle("hidden", activeAdminTab !== "celebrate");
}));
function showCelebration(teamMode) {
  const r = getCompleted();
  if (!r) { setMessage("adminMessage", "Complete a demo quiz before previewing a celebration."); return; }
  $("celebrationIcon").textContent = teamMode ? "🎉" : "🏆";
  $("celebrationTitle").textContent = teamMode ? "Team celebration" : "Individual champion";
  $("celebrationWinner").textContent = teamMode ? `Team ${r.participant.team}` : `${r.participant.first} ${r.participant.last}`;
  $("celebrationDetail").textContent = `${r.score} points out of ${r.total} • Thank you for making communication count!`;
  show("celebrationView");
}
$("celebrateIndividual").addEventListener("click", () => showCelebration(false));
$("celebrateTeam").addEventListener("click", () => showCelebration(true));
$("backToAdmin").addEventListener("click", () => show("adminView"));

// Admin login can be reached with #admin while developing.
if (location.hash === "#admin") show("adminLoginView");
