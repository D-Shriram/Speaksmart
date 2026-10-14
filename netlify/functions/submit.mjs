import {db,json,body,hash} from "./_shared.mjs";
export default async (req) => {
 if(req.method!=="POST") return json({error:"Method not allowed"},405);
 const b=await body(req), pid=String(b.participantId||""), token=req.headers.get("x-participant-token")||"", answers=Array.isArray(b.answers)?b.answers:[], duration=Math.max(0,Math.min(86400,Number(b.duration)||0));
 if(!pid||!token||!answers.length) return json({error:"Participant session and answers are required."},400);
 try {
   const p=await db(`participants?id=eq.${encodeURIComponent(pid)}&select=id,browser_token_hash,retry_allowed&limit=1`);
   if(!p.length||p[0].browser_token_hash!==await hash(token)) return json({error:"Invalid participant session."},401);
   const prev=await db(`attempts?participant_id=eq.${encodeURIComponent(pid)}&completed=eq.true&select=id&limit=1`);
   if(prev.length&&!p[0].retry_allowed) return json({error:"An attempt is already completed. Use the Request button for another attempt."},409);
   const ids=[...new Set(answers.map(a=>String(a.questionId||"")))];
   const qs=await db(`questions?id=in.(${ids.map(encodeURIComponent).join(",")})&active=eq.true&select=id,correct_answer`);
   if(!qs.length||qs.length!==ids.length) return json({error:"Question set is invalid. Reload the quiz and try again."},400);
   const answerMap=new Map(answers.map(a=>[String(a.questionId),String(a.answer??"")]));
   const score=qs.reduce((n,q)=>n+(answerMap.get(q.id)===q.correct_answer?1:0),0);
   const rows=await db("attempts?select=id,score,total_questions,completed,duration_seconds,completed_at",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({participant_id:pid,score,total_questions:qs.length,completed:true,duration_seconds:duration,completed_at:new Date().toISOString()})});
   await db(`participants?id=eq.${encodeURIComponent(pid)}`,{method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({retry_allowed:false})});
   return json({result:{score,total:qs.length,duration,attemptId:rows[0].id}},201);
 } catch(e){return json({error:e.message||"Submission failed"},500)}
};
