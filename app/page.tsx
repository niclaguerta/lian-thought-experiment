"use client";
import {useEffect,useState} from "react";
import {content} from "./content";
const numbers=["1","2","3","4","5","6a","6b"];
const apiBase=typeof window!=="undefined"&&window.location.hostname.endsWith(".github.io")?"https://lian-thought-experiment.flashypumpkin.chatgpt.site":"";
const assetBase=typeof window!=="undefined"?new URL(".",window.location.href).pathname:"/";
const artwork=["cards-1","sheets-2","cards-5","sheets-6","sheets-10","sheets-14","sheets-18"];
const empty={moral:"",practical:"",amplificant:"",renunciant:"",groupLabel:""};
export default function Workshop(){
 const lang="en"; const [step,setStep]=useState(0),[answers,setAnswers]=useState(empty),[ready,setReady]=useState(false),[id,setId]=useState(""),[status,setStatus]=useState(""),[busy,setBusy]=useState(false),[submitted,setSubmitted]=useState(false);
 const section=content.en[step];
 useEffect(()=>{try{const raw=localStorage.getItem("lian-workshop-v1");if(raw){const d=JSON.parse(raw);setAnswers({...empty,...d.answers});setId(d.id||crypto.randomUUID());setSubmitted(!!d.submitted);}else setId(crypto.randomUUID());}catch{setId(crypto.randomUUID());}setReady(true)},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem("lian-workshop-v1",JSON.stringify({answers,id,lang,submitted}));}catch{}},[answers,id,lang,submitted,ready]);
 useEffect(()=>{document.documentElement.lang="en"},[lang]);
 function move(n:number){setStep(n);window.scrollTo({top:0,behavior:"smooth"});setStatus("")}
 function field(key:keyof typeof empty,label:string){return <label className="response" key={key}><span>{label}</span><textarea value={answers[key]} disabled={submitted} maxLength={20000} onChange={e=>setAnswers({...answers,[key]:e.target.value})} placeholder={"Write your response here…"} rows={key==="moral"||key==="practical"?6:13}/><small>{answers[key].length.toLocaleString()} / 20,000</small></label>}
 async function submit(){if(!Object.entries(answers).filter(([k])=>k!=="groupLabel").every(([,v])=>v.trim())){setStatus("Please complete the two responses in part 4 and both stories in 6a and 6b before submitting.");return;}setBusy(true);setStatus("");try{const res=await fetch(apiBase+"/api/submissions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,language:lang,...answers})});if(!res.ok)throw Error();setSubmitted(true)}catch{setStatus("We couldn’t submit your responses. Your draft is still here; please try again.")}finally{setBusy(false)}}
 return <div className={"workshop tone-"+step}><header><a className="brand" href={apiBase?"./":"/"}>IDEA</a><div className="header-right"><span className="edition">AI · AUTHORSHIP · POSSIBLE FUTURES</span></div></header>
 <div className="layout"><aside><p className="eyebrow">{"THE ACTIVITY"}</p><nav aria-label="Activity steps">{numbers.map((n,i)=><button key={n} aria-current={step===i?"step":undefined} className={step===i?"active":""} onClick={()=>move(i)}><b>{n.padStart(2,"0")}</b><span>{content.en[i][0]}</span><em>{[3,5,6].includes(i)?"✎":"↗"}</em></button>)}</nav><div className="aside-note"><span>2026 → 2036</span><p>{"One character. Two futures. A question of what makes an idea our own."}</p></div><a className="facilitator" href={apiBase?"./results.html":"/results"}>{"Facilitator access"} ↗</a></aside>
 <main><figure className="art-panel"><img src={assetBase+"original/"+artwork[step]+".webp"} alt={step===2?"Question card 3a from the original activity":"Original illustration of Lian, part "+numbers[step]}/></figure><div className="paper-content"><div className="meta"><span>{"PART"} {numbers[step]}{""}</span><span>{[3,5,6].includes(step)?"WRITE & REFLECT":"READ & CONSIDER"}</span></div>
 <div className="heading"><span className="big-number">{numbers[step]}</span><div><p className="eyebrow">{step<4?"YEAR 2026":"YEAR 2036"}</p><h1>{section[0]}</h1></div></div>

 <div className={step===2?"questions":"passages"}>{section.slice(1).map((s,i)=><div className="passage" key={i}>{step===2&&<b className="question-label">3{String.fromCharCode(97+i)}</b>}<p>{s}</p></div>)}</div>
 {step===3&&<div className="fields">{field("moral","Moral concerns")}{field("practical","Practical concerns")}</div>}
 {step===5&&field("amplificant","Lian’s adventures as an Amplificant")}
 {step===6&&field("renunciant","Lian’s adventures as a Renunciant")}
 {step===6&&<section className="submit-panel">{submitted?<p role="status">Submitted. Thank you.</p>:<><label>Name (optional)<input maxLength={120} autoComplete="name" value={answers.groupLabel} onChange={e=>setAnswers({...answers,groupLabel:e.target.value})}/></label><button className="primary" style={{marginTop:20}} disabled={busy||!ready} onClick={submit}>{busy?"Submitting…":"Submit"}</button></>}{status&&<p role="status">{status}</p>}</section>}
 <footer><button disabled={step===0} onClick={()=>move(step-1)}>← {"Previous"}</button><span>{step+1} / 7</span>{step<6?<button className="next" onClick={()=>move(step+1)}>{"Continue"} →</button>:<span>{submitted?"✓":""}</span>}</footer></div>
 </main></div></div>
}
