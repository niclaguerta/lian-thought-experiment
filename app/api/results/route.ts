import {cors,preflight} from "../cors";
export const OPTIONS=preflight;
import {env} from "cloudflare:workers";
import {getDb} from "../../../db";
import {submissions} from "../../../db/schema";
import {desc} from "drizzle-orm";
export async function GET(req:Request){
 const json=(data:unknown,options:ResponseInit={})=>Response.json(data,{...options,headers:{...cors(req).headers,...options.headers}});
 const key=(env as unknown as Record<string,string>).ADMIN_KEY;
 if(!key||req.headers.get("authorization")!==`Bearer ${key}`)return json({error:"Access denied"},{status:401,headers:{"Cache-Control":"no-store"}});
 try{const rows=await getDb().select().from(submissions).orderBy(desc(submissions.createdAt));return json(rows,{headers:{"Cache-Control":"no-store"}})}catch{return json({error:"Unable to load results"},{status:500})}
}
