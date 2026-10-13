import React,{useMemo,useState} from 'react';
import {gedYear,localDate} from './gedcom';

export function Kinship({people}){
 const [a,setA]=useState(''),[b,setB]=useState('');
 const byId=useMemo(()=>new Map(people.map(p=>[p.id,p])),[people]);
 const path=useMemo(()=>{
  if(!a||!b)return null;
  const queue=[[a]],seen=new Set([a]);
  while(queue.length){const p=queue.shift(),last=p[p.length-1];if(last===b)return p;
   const person=byId.get(last);if(!person)continue;
   for(const id of [...(person.parents||[]),...(person.children||[]),...(person.spouses||[])])if(!seen.has(id)&&byId.has(id)){seen.add(id);queue.push([...p,id]);}
  }return null;
 },[a,b,byId]);
 return <div className="panel"><h2>Hvernig eru þau skyld?</h2><p>Veldu tvo einstaklinga og sjáðu stystu skráðu tengingu þeirra. Þetta er ekki endilega eina tengingin.</p><div className="twofields"><label>Fyrri einstaklingur<select value={a} onChange={e=>setA(e.target.value)}><option value="">Veldu einstakling</option>{people.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label>Seinni einstaklingur<select value={b} onChange={e=>setB(e.target.value)}><option value="">Veldu einstakling</option>{people.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label></div>{a&&b&&(path?<div className="path">{path.map((id,i)=><div key={i} className="pathitem"><b>{byId.get(id)?.name}</b>{i<path.length-1&&<span>↓</span>}</div>)}</div>:<p>Engin skráð tenging fannst í þessum gögnum.</p>)}</div>;
}
export function Statistics({people}){
 const years=people.map(p=>gedYear(p.birth)).filter(Boolean);
 const deceased=people.filter(p=>gedYear(p.birth)&&gedYear(p.death)&&gedYear(p.death)>=gedYear(p.birth));
 const ages=deceased.map(p=>gedYear(p.death)-gedYear(p.birth));
 const counts=new Map();for(const p of people)for(const e of p.events||[])if(e.place)counts.set(e.place,(counts.get(e.place)||0)+1);
 const top=[...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,12);
 return <div className="panel"><h2>Tölfræði safnsins</h2><p>Allar tölur miðast eingöngu við einstaklinga sem eru í innlesnu safni.</p><div className="statgrid"><div><strong>{people.length.toLocaleString('is-IS')}</strong><small>Einstaklingar</small></div><div><strong>{years.length?Math.min(...years):'—'}</strong><small>Elsta skráða fæðingarár</small></div><div><strong>{ages.length?Math.round(ages.reduce((a,b)=>a+b,0)/ages.length):'—'}</strong><small>Meðalaldur við andlát (gróft ártal)</small></div></div><h3>Algengustu skráðu staðirnir</h3>{top.map(([place,count])=><div className="line" key={place}><b>{place}</b><span>{count} atburðir</span></div>)}</div>;
}
export function Reunion({people}){
 const [ancestor,setAncestor]=useState('');const byId=useMemo(()=>new Map(people.map(p=>[p.id,p])),[people]);
 const descendants=useMemo(()=>{if(!ancestor)return [];const queue=[ancestor],seen=new Set(queue),out=[];while(queue.length){const id=queue.shift();for(const child of byId.get(id)?.children||[])if(!seen.has(child)){seen.add(child);queue.push(child);if(byId.has(child))out.push(byId.get(child));}}return out;},[ancestor,byId]);
 const download=()=>{const content=['Nafn;Fæðing',...descendants.map(p=>`"${p.name.replaceAll('"','""')}";"${localDate(p.birth)}"`)].join('\n');const blob=new Blob(['\uFEFF',content],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='aettarmot.csv';link.click();URL.revokeObjectURL(url)};
 return <div className="panel"><h2>Undirbúningur ættarmóts</h2><p>Veldu sameiginlegan forföður og skoðaðu skráða afkomendur. Skráin er ekki boðslisti með tengiliðaupplýsingum.</p><select value={ancestor} onChange={e=>setAncestor(e.target.value)}><option value="">Veldu forföður</option>{people.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>{ancestor&&<><h3>{descendants.length} skráðir afkomendur</h3><button className="secondary" onClick={download}>Sækja lista (CSV)</button>{descendants.slice(0,300).map(p=><div className="line" key={p.id}><b>{p.name}</b><span>{localDate(p.birth)}</span></div>)}</>}</div>;
}
export function Graveyards({people}){
 const graves=people.flatMap(p=>(p.events||[]).filter(e=>e.type==='BURI').map(e=>({person:p,event:e})));
 const [q,setQ]=useState('');const shown=graves.filter(g=>(g.person.name+' '+g.event.place).toLocaleLowerCase('is').includes(q.toLocaleLowerCase('is')));
 return <div className="panel"><h2>Grafreitir og kirkjugarðar</h2><p>Grafreitur er skráður sérstaklega frá dánarstað. Staðsetning leiðis er aðeins sýnd ef hún er þekkt.</p><input placeholder="Leita að einstaklingi eða kirkjugarði" value={q} onChange={e=>setQ(e.target.value)}/>{shown.map((g,i)=><div className="line" key={g.person.id+i}><b>{g.person.name}</b><span>{g.event.place||'Óþekktur grafreitur'} · {localDate(g.event.date)}</span></div>)}{!shown.length&&<p>Engar grafreitaskráningar fundust.</p>}</div>;
}
export function Documents({people}){
 const entries=people.flatMap(p=>(p.events||[]).filter(e=>e.note||e.source).map(e=>({person:p,event:e})));
 return <div className="panel"><h2>Heimildir og söguleg skjöl</h2><p>Hér birtast heimildatilvísanir og athugasemdir sem fylgja innlesnum atburðum. Skráa- og ljósmyndageymsla verður tengd við aðgangsstýrða Supabase Storage áður en raunveruleg skjöl eru birt.</p>{entries.slice(0,300).map((x,i)=><div className="line" key={i}><b>{x.person.name} — {x.event.type}</b><span>{x.event.note||x.event.source}</span></div>)}{!entries.length&&<p>Engar heimildatilvísanir í núverandi gögnum.</p>}</div>;
}
export function Quality({people}){
 const ids=new Set(people.map(p=>p.id));const problems=[];
 for(const p of people){if(gedYear(p.birth)&&gedYear(p.death)&&gedYear(p.birth)>gedYear(p.death))problems.push(`${p.name}: dánarár á undan fæðingarári`);for(const id of [...(p.parents||[]),...(p.children||[])])if(!ids.has(id))problems.push(`${p.name}: vantar tengdan einstakling ${id}`)}
 const names=new Map();for(const p of people){const key=p.name.toLocaleLowerCase('is')+'|'+(gedYear(p.birth)||'');names.set(key,[...(names.get(key)||[]),p])}for(const matches of names.values())if(matches.length>1)problems.push(`Möguleg tvískráning: ${matches.map(p=>p.name+' ('+p.id+')').join(', ')}`);
 return <div className="panel"><h2>Gæðaskoðun og tillögur</h2><p>Kerfið bendir á mögulegar villur en sameinar aldrei einstaklinga sjálfkrafa.</p><h3>{problems.length} atriði til yfirferðar</h3>{problems.slice(0,200).map((p,i)=><div className="line" key={i}>{p}</div>)}{!problems.length&&<p>Engin augljós vandamál fundust með þessum reglum.</p>}</div>;
}
