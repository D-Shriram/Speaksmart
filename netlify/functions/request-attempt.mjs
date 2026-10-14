import {db,json,body,hash} from "./_shared.mjs";
export default async (req)=>{
 if(req.method!=="POST") return json({error:"Method not allowed"},405);
 const b=await body(req),pid=String(b.participantId||""),token=req.headers.get("x-participant-token")||"",code=String(b.code||"");
 if(!pid||!token||!code) return json({error:"Participant session and code are required."},400);
 if(!process.env.REQUEST_CODE||code!==process.env.REQUEST_CODE) return json({error:"Incorrect request code."},403);
 try{const rows=await db(`participants?id=eq.${encodeURIComponent(pid)}&select=id,browser_token_hash&limit=1`);if(!rows.length||rows[0].browser_token_hash!==await hash(token))return json({error:"Invalid participant session."},401);await db(`participants?id=eq.${encodeURIComponent(pid)}`,{method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({retry_allowed:true})});return json({ok:true,message:"Another attempt is authorized. You may start again."});}catch(e){return json({error:e.message||"Request failed"},500)}
};
