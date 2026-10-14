-- Run this script in Supabase SQL Editor.
-- This starter schema keeps participant scores and questions in the database.
create extension if not exists pgcrypto;

create table if not exists public.questions (
  id text primary key,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  seconds integer not null check (seconds between 10 and 15),
  question text not null,
  options jsonb not null,
  correct_answer text not null,
  active boolean not null default true
);

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  team_number text not null,
  first_name text not null,
  last_name text not null,
  browser_token_hash text,
  created_at timestamptz not null default now()
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete cascade,
  score integer not null default 0,
  total_questions integer not null default 0,
  completed boolean not null default false,
  duration_seconds integer not null default 0,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.admin_allowlist (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.questions enable row level security;
alter table public.participants enable row level security;
alter table public.attempts enable row level security;
alter table public.admin_allowlist enable row level security;

-- No public read/write policies are created. Server functions use the service role.
-- Never expose the service-role key in browser code.

insert into public.questions (id,difficulty,seconds,question,options,correct_answer) values
('q1','easy',15,'What is the most appropriate tone when answering a professional phone call?','["Impatient and rushed","Friendly, clear and professional","Extremely loud","Bored and uninterested"]'::jsonb,'Friendly, clear and professional'),
('q2','easy',15,'What does speaking at a suitable pace help a listener do?','["Understand and process the message","Assume the speaker is nervous","Finish the call sooner at any cost","Ignore key details"]'::jsonb,'Understand and process the message'),
('q3','easy',15,'Which is a good way to begin a professional call?','["Who is this?","Speak quickly; I am busy","Greet the person and introduce yourself","Wait silently"]'::jsonb,'Greet the person and introduce yourself'),
('q4','easy',15,'If you need to place a caller on hold, what should you do?','["Put them on hold without warning","Ask permission and explain briefly","Mute them for several minutes","Disconnect and call later"]'::jsonb,'Ask permission and explain briefly'),
('q5','easy',15,'Which voice quality usually helps convey confidence?','["A clear, steady voice","A whisper that is hard to hear","A constantly rising volume","A flat, uninterested delivery"]'::jsonb,'A clear, steady voice'),
('q6','easy',15,'What should you do while another person is speaking?','["Plan your reply and interrupt","Check messages aloud","Listen without interrupting","Talk over them"]'::jsonb,'Listen without interrupting'),
('q7','easy',15,'What is appropriate telephone etiquette at the end of a call?','["Hang up immediately","Summarize next steps and thank the caller","Start an unrelated topic","Leave without saying anything"]'::jsonb,'Summarize next steps and thank the caller'),
('q8','easy',15,'What is the main purpose of voice tone?','["Make every sentence identical","Communicate attitude and emotion along with words","Replace listening","Make speech as loud as possible"]'::jsonb,'Communicate attitude and emotion along with words'),
('q9','medium',12,'A listener repeatedly asks you to repeat yourself. What should you do first?','["Speak faster","Raise your voice immediately","Slow down, articulate clearly and check understanding","End the conversation"]'::jsonb,'Slow down, articulate clearly and check understanding'),
('q10','medium',12,'You need to transfer a caller to another department. What is best?','["Transfer without explanation","Explain the reason, ask permission and connect them appropriately","Tell them to call another day","Give an unverified number"]'::jsonb,'Explain the reason, ask permission and connect them appropriately'),
('q11','medium',12,'Which response shows active listening on a call?','["Repeat the concern in your own words to confirm understanding","Change the subject","Finish the caller sentences repeatedly","Remain silent without acknowledgement"]'::jsonb,'Repeat the concern in your own words to confirm understanding'),
('q12','medium',12,'Why should you avoid speaking too quickly during instructions?','["It always sounds confident","The listener may miss important details","It makes the call more polite","It improves pronunciation automatically"]'::jsonb,'The listener may miss important details'),
('q13','medium',12,'You do not know the answer to a caller question. What should you say?','["Invent an answer","Blame another team","Be honest and offer to verify the information","Ignore the question"]'::jsonb,'Be honest and offer to verify the information'),
('q14','medium',12,'Which is the best way to leave a voicemail?','["Give your name, reason, contact details and callback request","Speak softly and quickly","Give unrelated personal details","Leave no contact information"]'::jsonb,'Give your name, reason, contact details and callback request'),
('q15','medium',12,'A caller sounds upset. Which tone is most helpful?','["Sarcastic","Calm, respectful and empathetic","Dismissive","Aggressive"]'::jsonb,'Calm, respectful and empathetic'),
('q16','medium',12,'What should you do if there is background noise during a call?','["Ignore it even if the caller cannot hear","Shout continuously","Move to a quieter place or explain the issue","End every sentence abruptly"]'::jsonb,'Move to a quieter place or explain the issue'),
('q17','hard',10,'During a difficult customer call, the other person becomes angry. What is the best response?','["Interrupt to defend yourself","Match their angry tone","Listen, acknowledge their concern and respond calmly","Put the call on hold without explanation"]'::jsonb,'Listen, acknowledge their concern and respond calmly'),
('q18','hard',10,'A colleague misunderstands your instructions over the phone. What should you do next?','["Repeat the same words louder","Rephrase instructions into steps and ask them to confirm","Assume they were not listening","Send an unrelated message"]'::jsonb,'Rephrase instructions into steps and ask them to confirm'),
('q19','hard',10,'Which statement best describes effective pace in professional speaking?','["Always speak as fast as possible","Use the same speed for all content","Adjust speed and pauses to the audience and complexity","Pause after every word"]'::jsonb,'Adjust speed and pauses to the audience and complexity'),
('q20','hard',10,'You must explain a complicated issue to a customer by phone. What is best?','["Use jargon to sound knowledgeable","Explain in short sections, pause for questions and confirm understanding","Deliver everything without pausing","Ask the customer not to interrupt"]'::jsonb,'Explain in short sections, pause for questions and confirm understanding'),
('q21','hard',10,'Which action best protects professionalism when a caller criticizes your work?','["Argue and take it personally","Listen for the issue and respond to facts respectfully","End the call without warning","Criticize the caller"]'::jsonb,'Listen for the issue and respond to facts respectfully'),
('q22','hard',10,'You realize you have interrupted a caller several times. What is the best recovery?','["Continue speaking","Apologize briefly, invite them to continue and listen","Tell them to be faster","Ignore it"]'::jsonb,'Apologize briefly, invite them to continue and listen'),
('q23','hard',10,'What is the best way to confirm an important appointment by phone?','["Assume both people remember","Confirm date, time and next steps","Only say goodbye","Ask the other person to guess"]'::jsonb,'Confirm date, time and next steps'),
('q24','hard',10,'Why can a pause be useful in telephonic communication?','["It gives the listener time to process information and respond","It always means the call failed","It replaces clear explanations","It should always be avoided"]'::jsonb,'It gives the listener time to process information and respond')
on conflict (id) do nothing;

-- After creating your administrator in Authentication, copy that user's UUID
-- and run this (replace USER_UUID):
-- insert into public.admin_allowlist(user_id) values ('USER_UUID');
