import {cors,preflight} from "../cors";
export const OPTIONS=preflight;
import {env} from "cloudflare:workers";
import {getDb} from "../../../db";
import {submissions} from "../../../db/schema";
export async function POST(req:Request){
 const json=(data:unknown,options:ResponseInit={})=>Response.json(data,{...options,headers:{...cors(req).headers,...options.headers}});
 if(!cors(req).allowed)return json({error:"Invalid origin"},{status:403});
 if(Number(req.headers.get("content-length")||0)>350000)return json({error:"Too large"},{status:413});
 try {const raw=await req.text();if(raw.length>150000)return json({error:"Too large"},{status:413});const b=JSON.parse(raw);
 if(typeof b.id!=="string"||! /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(b.id)||!["en","zh"].includes(b.language))return json({error:"Invalid submission"},{status:400});
 for(const k of ["moral","practical","amplificant","renunciant"])if(typeof b[k]!=="string"||!b[k].trim()||b[k].length>20000)return json({error:"Complete all four responses"},{status:400});
 if(typeof b.groupLabel!=="string"||!b.groupLabel.trim()||b.groupLabel.length>120)return json({error:"Please enter your name (up to 120 characters)"},{status:400});
 await getDb().insert(submissions).values({id:b.id,createdAt:new Date().toISOString(),language:b.language,groupLabel:b.groupLabel.trim(),moral:b.moral.trim(),practical:b.practical.trim(),amplificant:b.amplificant.trim(),renunciant:b.renunciant.trim()}).onConflictDoNothing();
 return json({ok:true,id:b.id},{headers:{"Cache-Control":"no-store"}});
 }catch(e){console.error("Submission failed",e instanceof Error?e.message:"error");return json({error:"Unable to save submission"},{status:500})}
}
