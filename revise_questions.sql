-- Run this in Supabase SQL Editor AFTER the original supabase.sql succeeded.
-- Updates the existing rows with balanced options and revised question wording.
update public.questions
set difficulty = 'easy', seconds = 15,
    question = 'What is the best tone for answering a professional call?',
    options = '["Friendly and clear", "Bored and impatient", "Loud enough to dominate the conversation", "Sarcastic, so the caller knows you are busy"]'::jsonb,
    correct_answer = 'Friendly and clear'
where id = 'q1';

update public.questions
set difficulty = 'easy', seconds = 15,
    question = 'Why should you speak at a suitable pace?',
    options = '["To finish before the caller can ask questions", "So the listener can follow your message", "To make every call sound formal and serious", "Because speaking quickly always shows confidence"]'::jsonb,
    correct_answer = 'So the listener can follow your message'
where id = 'q2';

update public.questions
set difficulty = 'easy', seconds = 15,
    question = 'How should you begin a professional phone call?',
    options = '["Start explaining the issue immediately", "Ask the caller why they are disturbing you", "Greet the person and introduce yourself", "Wait for the other person to guess who you are"]'::jsonb,
    correct_answer = 'Greet the person and introduce yourself'
where id = 'q3';

update public.questions
set difficulty = 'easy', seconds = 15,
    question = 'You need to put a caller on hold. What should you do?',
    options = '["Ask first and explain briefly", "Press hold without saying anything", "Mute the phone until they hang up", "Tell them to call again another day"]'::jsonb,
    correct_answer = 'Ask first and explain briefly'
where id = 'q4';

update public.questions
set difficulty = 'easy', seconds = 15,
    question = 'Which voice quality usually sounds confident?',
    options = '["A clear, steady voice", "A whisper that is hard to hear", "A different volume in every sentence", "A flat delivery with no acknowledgement"]'::jsonb,
    correct_answer = 'A clear, steady voice'
where id = 'q5';

update public.questions
set difficulty = 'easy', seconds = 15,
    question = 'What should you do while someone is speaking?',
    options = '["Prepare a reply and interrupt early", "Check messages while they explain", "Listen without interrupting", "Talk over them to show enthusiasm"]'::jsonb,
    correct_answer = 'Listen without interrupting'
where id = 'q6';

update public.questions
set difficulty = 'easy', seconds = 15,
    question = 'What is a good way to end a professional call?',
    options = '["Hang up once you have said your part", "Summarize next steps and thank the caller", "Start a new topic just before ending", "Leave the call without a closing"]'::jsonb,
    correct_answer = 'Summarize next steps and thank the caller'
where id = 'q7';

update public.questions
set difficulty = 'easy', seconds = 15,
    question = 'What can voice tone communicate beyond the words themselves?',
    options = '["Only the speaker''s age", "The exact length of the conversation", "Whether the phone signal is strong", "Attitude and emotion"]'::jsonb,
    correct_answer = 'Attitude and emotion'
where id = 'q8';

update public.questions
set difficulty = 'medium', seconds = 12,
    question = 'A listener keeps asking you to repeat yourself. What should you do first?',
    options = '["Speak faster to keep the call moving", "Slow down, articulate clearly and check understanding", "Raise your voice immediately, regardless of the cause", "Tell the listener to concentrate more carefully"]'::jsonb,
    correct_answer = 'Slow down, articulate clearly and check understanding'
where id = 'q9';

update public.questions
set difficulty = 'medium', seconds = 12,
    question = 'You need to transfer a caller to another department. What is best?',
    options = '["Explain why, ask permission and transfer them appropriately", "Transfer the call without warning", "Tell them to search for the department online", "Give a number you think might be correct"]'::jsonb,
    correct_answer = 'Explain why, ask permission and transfer them appropriately'
where id = 'q10';

update public.questions
set difficulty = 'medium', seconds = 12,
    question = 'Which action demonstrates active listening?',
    options = '["Waiting silently for the call to end", "Changing the subject to something easier", "Restating the concern to confirm you understood", "Repeating your own point until the caller agrees"]'::jsonb,
    correct_answer = 'Restating the concern to confirm you understood'
where id = 'q11';

update public.questions
set difficulty = 'medium', seconds = 12,
    question = 'Why can speaking too quickly be a problem during instructions?',
    options = '["It makes the speaker sound less formal every time", "The listener may miss important details", "It always causes a poor phone connection", "It prevents the speaker from using polite words"]'::jsonb,
    correct_answer = 'The listener may miss important details'
where id = 'q12';

update public.questions
set difficulty = 'medium', seconds = 12,
    question = 'You do not know the answer to a caller''s question. What should you do?',
    options = '["Give a confident answer even if you are unsure", "Say the issue belongs to someone else and end the call", "Ignore the question and continue with your script", "Be honest and offer to verify the information"]'::jsonb,
    correct_answer = 'Be honest and offer to verify the information'
where id = 'q13';

update public.questions
set difficulty = 'medium', seconds = 12,
    question = 'What should a useful voicemail usually include?',
    options = '["Your name, reason for calling and callback details", "A long explanation of unrelated background", "Only your first name, spoken very quickly", "Personal details the recipient does not need"]'::jsonb,
    correct_answer = 'Your name, reason for calling and callback details'
where id = 'q14';

update public.questions
set difficulty = 'medium', seconds = 12,
    question = 'An upset caller is explaining a problem. Which tone is best?',
    options = '["Dismissive and brief", "Calm, respectful and empathetic", "Sarcastic but technically accurate", "Loud enough to stop further complaints"]'::jsonb,
    correct_answer = 'Calm, respectful and empathetic'
where id = 'q15';

update public.questions
set difficulty = 'medium', seconds = 12,
    question = 'There is loud background noise during your call. What should you do?',
    options = '["Continue as normal and let the caller adjust", "Shout for the rest of the conversation", "Move somewhere quieter or explain the issue", "End the call without telling the caller why"]'::jsonb,
    correct_answer = 'Move somewhere quieter or explain the issue'
where id = 'q16';

update public.questions
set difficulty = 'hard', seconds = 10,
    question = 'A customer becomes angry during a difficult call. What is the best response?',
    options = '["Interrupt and defend every decision immediately", "Match their tone so they know you are serious", "Listen, acknowledge the concern and respond calmly", "Transfer them without explanation to avoid the conflict"]'::jsonb,
    correct_answer = 'Listen, acknowledge the concern and respond calmly'
where id = 'q17';

update public.questions
set difficulty = 'hard', seconds = 10,
    question = 'A colleague misunderstands your phone instructions. What should you do next?',
    options = '["Repeat the exact same sentence at a higher volume", "Rephrase the steps and ask them to confirm understanding", "Assume they were distracted and end the call", "Send a message without checking what they misunderstood"]'::jsonb,
    correct_answer = 'Rephrase the steps and ask them to confirm understanding'
where id = 'q18';

update public.questions
set difficulty = 'hard', seconds = 10,
    question = 'What does effective speaking pace involve?',
    options = '["Speaking quickly whenever the topic is familiar", "Keeping exactly the same speed in every situation", "Using long pauses after nearly every word", "Adjusting speed and pauses to the listener and message"]'::jsonb,
    correct_answer = 'Adjusting speed and pauses to the listener and message'
where id = 'q19';

update public.questions
set difficulty = 'hard', seconds = 10,
    question = 'You must explain a complicated issue by phone. What is most effective?',
    options = '["Break it into clear sections, pause for questions and confirm understanding", "Use technical terms throughout so the explanation sounds expert", "Deliver all details at once to avoid being interrupted", "Ask the caller to read the documentation instead"]'::jsonb,
    correct_answer = 'Break it into clear sections, pause for questions and confirm understanding'
where id = 'q20';

update public.questions
set difficulty = 'hard', seconds = 10,
    question = 'A caller criticizes your work. How can you remain professional?',
    options = '["Argue until the caller admits they are wrong", "End the call as soon as the criticism begins", "Listen for the issue and respond to the facts respectfully", "Criticize the caller''s communication style in return"]'::jsonb,
    correct_answer = 'Listen for the issue and respond to the facts respectfully'
where id = 'q21';

update public.questions
set difficulty = 'hard', seconds = 10,
    question = 'You realize you have interrupted a caller several times. What is the best recovery?',
    options = '["Continue speaking so you do not lose your point", "Apologize briefly, invite them to continue and listen", "Tell the caller to make their point faster", "Ignore it because interruptions are normal on calls"]'::jsonb,
    correct_answer = 'Apologize briefly, invite them to continue and listen'
where id = 'q22';

update public.questions
set difficulty = 'hard', seconds = 10,
    question = 'How should you confirm an important appointment over the phone?',
    options = '["Assume both people remember all the details", "Confirm the date, time and agreed next steps", "Only repeat the person''s name before hanging up", "Ask the other person to send the details whenever possible"]'::jsonb,
    correct_answer = 'Confirm the date, time and agreed next steps'
where id = 'q23';

update public.questions
set difficulty = 'hard', seconds = 10,
    question = 'Why can a pause be useful in a phone conversation?',
    options = '["It can give the listener time to process information", "It proves the caller has disconnected", "It removes the need to explain the message clearly", "It should be avoided because silence is always unprofessional"]'::jsonb,
    correct_answer = 'It can give the listener time to process information'
where id = 'q24';

-- Team leaderboard rule: combined total points across all completed team members.
-- Later, the protected admin backend should query:
-- SELECT p.team_number, SUM(a.score) AS combined_score,
--        COUNT(DISTINCT p.id) AS members
-- FROM public.attempts a
-- JOIN public.participants p ON p.id = a.participant_id
-- WHERE a.completed = true
-- GROUP BY p.team_number
-- ORDER BY combined_score DESC, p.team_number ASC;
