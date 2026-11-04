import {cors,preflight} from "../cors";
export const OPTIONS=preflight;
import {env} from "cloudflare:workers";
import {getDb} from "../../../db";
import {submissions} from "../../../db/schema";
import {desc,eq} from "drizzle-orm";
export async function GET(req:Request){
 const json=(data:unknown,options:ResponseInit={})=>Response.json(data,{...options,headers:{...cors(req).headers,...options.headers}});
 const key=(env as unknown as Record<string,string>).ADMIN_KEY;
 if(!key||req.headers.get("authorization")!==`Bearer ${key}`)return json({error:"Access denied"},{status:401,headers:{"Cache-Control":"no-store"}});
 try{const rows=await getDb().select().from(submissions).orderBy(desc(submissions.createdAt));return json(rows,{headers:{"Cache-Control":"no-store"}})}catch{return json({error:"Unable to load results"},{status:500})}
}
export async function DELETE(req:Request){
 const c=cors(req);
 const json=(data:unknown,status=200)=>Response.json(data,{status,headers:c.headers});
 const key=(env as unknown as Record<string,string>).ADMIN_KEY;
 if(!key||req.headers.get("authorization")!==`Bearer ${key}`)return json({error:"Access denied"},401);
 if(!c.allowed)return json({error:"Invalid origin"},403);
 try{
  const raw=await req.text();
  if(raw.length>1024)return json({error:"Invalid request"},413);
  let b;try{b=JSON.parse(raw)}catch{return json({error:"Invalid request"},400)}
  if(typeof b?.id!=="string"||! /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(b.id))return json({error:"Invalid response ID"},400);
  const removed=await getDb().delete(submissions).where(eq(submissions.id,b.id)).returning({id:submissions.id});
  return removed.length?json({ok:true}):json({error:"Response not found"},404);
 }catch{return json({error:"Unable to delete response"},500)}
}
