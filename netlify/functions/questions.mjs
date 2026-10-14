import {db,json,fail} from "./_shared.mjs";
export default async (req) => {
 if(req.method!=="GET") return json({error:"Method not allowed"},405);
 try { const rows=await db("questions?active=eq.true&select=id,difficulty,seconds,question,options"); return json({questions:rows.map(q=>({...q, options:Array.isArray(q.options)?q.options:[]}))}); }
 catch(e){return fail(e)}
};
