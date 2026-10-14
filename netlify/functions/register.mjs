import {db,json,body,hash,randomToken} from "./_shared.mjs";
export default async (req) => {
 if(req.method!=="POST") return json({error:"Method not allowed"},405);
 const b=await body(req); const team=String(b.team||"").trim().slice(0,40), first=String(b.first||"").trim().replace(/\s+/g," ").slice(0,50), last=String(b.last||"").trim().replace(/\s+/g," ").slice(0,50);
 if(!team||!first||!last) return json({error:"Team number, first name and last name are required."},400);
 try {
   const existing=await db(`participants?team_number=eq.${encodeURIComponent(team)}&first_name=ilike.${encodeURIComponent(first)}&last_name=ilike.${encodeURIComponent(last)}&select=id&limit=1`);
   if(existing.length) return json({error:"This participant is already registered. Use the Request button to ask for another attempt."},409);
   const token=randomToken(), tokenHash=await hash(token);
   const rows=await db("participants?select=id,team_number,first_name,last_name",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({team_number:team,first_name:first,last_name:last,browser_token_hash:tokenHash,retry_allowed:false})});
   return json({participant:{id:rows[0].id,team,first,last},participantToken:token},201);
 } catch(e){return json({error:e.message||"Registration failed"},500)}
};
