# SpeakSmart backend patch

This patch adds Netlify Functions for question delivery (without correct answers), participant registration, server-side scoring, repeat-attempt authorization, public leaderboards, and allowlisted admin results.

## Before use
1. Rotate the Supabase secret key that was shared in chat. Do not put the replacement in `config.js`, Git, or chat.
2. Keep `.env` local only; this ZIP intentionally excludes `.env`, `.netlify`, and `node_modules`.
3. Confirm `.gitignore` includes `.env`, `.env.*`, `!.env.example`, `node_modules/`, `.netlify/`, `.DS_Store`.
4. Run `backend-migration.sql` once in Supabase SQL Editor. It only adds `retry_allowed`; it does not delete data.
5. Ensure local `.env` has `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `REQUEST_CODE=156156`. The secret key must be the rotated replacement.
6. Run `npm run dev`.

## Function URLs
- `GET /.netlify/functions/health`
- `GET /.netlify/functions/questions` (correct answers are not returned)
- `POST /.netlify/functions/register` JSON `{ "team":"1", "first":"A", "last":"B" }`
- `POST /.netlify/functions/submit` with header `x-participant-token: <participantToken>` and JSON `{ "participantId":"...", "duration":90, "answers":[{"questionId":"q1","answer":"exact option text"}] }`
- `POST /.netlify/functions/request-attempt` with same participant token and JSON `{ "participantId":"...", "code":"156156" }`
- `GET /.netlify/functions/leaderboard`
- `GET /.netlify/functions/admin-results` with `Authorization: Bearer <Supabase access token>` for an allowlisted admin

## Important limitation
The existing `app.js` is the original demo UI and has not been switched over to call these endpoints yet. Do not run a real event or publish publicly until the frontend quiz flow is wired to these functions and tested end-to-end. These functions are the backend layer, not a completed end-to-end deployment.
