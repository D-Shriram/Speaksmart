# SpeakSmart Quiz starter

## 1. Install and run
- Install Node.js LTS and VS Code.
- Open this folder in VS Code.
- In VS Code Terminal run `npm install`.
- Copy the Supabase project URL and anon/public key into `config.js`.
- Run `npm run dev` and open the local URL printed by Netlify CLI.

## 2. Supabase
- Create a Supabase project.
- Open SQL Editor and run `supabase.sql`.
- Create an admin user in Authentication, then add its UUID to `public.admin_allowlist`.
- Add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `REQUEST_CODE`, and `ADMIN_EMAIL` to Netlify environment variables.

## Important
This repository is a UI and setup scaffold, not yet a secure production quiz. The backend functions must be implemented and tested before collecting real participants or publishing the quiz. Do not use the demo local scoring for an official leaderboard. Do not expose service-role credentials in browser code.
