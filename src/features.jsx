import React,{useMemo,useState} from 'react';
import {gedYear,localDate} from './gedcom';
import PersonSearch from './PersonSearch';

export function Kinship({people,onOpenPerson}){
 const [a,setA]=useState(''),[b,setB]=useState('');
 const byId=useMemo(()=>new Map(people.map(p=>[String(p.id),p])),[people]);
 const result=useMemo(()=>{
  if(!a||!b)return null;
  const ancestors=(start)=>{const found=new Map([[String(start),[String(start)]]]);const queue=[String(start)];let pos=0;
   while(pos<queue.length){const id=queue[pos++],chain=found.get(id);for(const parent of byId.get(id)?.parents||[]){const pid=String(parent);if(!byId.has(pid)||found.has(pid))continue;found.set(pid,[...chain,pid]);queue.push(pid)}}return found};
  const left=ancestors(a),right=ancestors(b);let best=null;
  for(const [id,l] of left){const r=right.get(id);if(!r)continue;const score=l.length+r.length-2;const balance=Math.max(l.length,r.length);if(!best||score<best.score||(score===best.score&&balance<best.balance))best={id,left:l,right:r,score,balance}}
  return best;
 },[a,b,byId]);
 const card=(id)=>{const p=byId.get(id);return <button type="button" className="kin-person" key={id} onClick={()=>onOpenPerson?.(id)} title="Opna einstaklingsspjald"><strong>{p?.name||id}</strong><small>{localDate(p?.birth)||''}</small></button>};
 return <div className="panel"><h2>Hvernig eru þau skyld?</h2><p>Veldu tvo einstaklinga. Ættartréð sýnir leið beggja að næsta sameiginlega forföður samkvæmt skráðum foreldratengingum. Smelltu á hvaða nafn sem er til að opna einstaklingsspjaldið.</p><div className="twofields"><PersonSearch people={people} value={a} onChange={setA} label="Fyrri einstaklingur"/><PersonSearch people={people} value={b} onChange={setB} label="Seinni einstaklingur"/></div>{a&&b&&(result?<div className="kin-tree"><h3>Sameiginlegur forfaðir</h3><div className="kin-root">{card(result.id)}</div><div className="kin-branches"><div className="kin-branch"><h4>Fyrri einstaklingur</h4>{result.left.slice(0,-1).reverse().map((id,i)=><React.Fragment key={id}><span className="kin-line">│</span>{card(id)}</React.Fragment>)}</div><div className="kin-branch"><h4>Seinni einstaklingur</h4>{result.right.slice(0,-1).reverse().map((id,i)=><React.Fragment key={id}><span className="kin-line">│</span>{card(id)}</React.Fragment>)}</div></div><p className="kin-note">{result.score} kynslóðaskref samtals. Mögulegt er að fleiri sameiginlegir forfeður séu skráðir.</p></div>:<p>Enginn sameiginlegur forfaðir fannst í skráðum foreldratengingum.</p>)}</div>;
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

// Comparison uses only dated residence records and dated events; never guesses locations.
function placesAt(people,year){
 const counts=new Map();
 for(const p of people){
  const birth=gedYear(p.birth),death=gedYear(p.death);
  if((birth&&year<birth)||(death&&year>death))continue;
  const residence=(p.events||[]).filter(e=>e.type==='RESI'&&e.place&&(()=>{
   const years=String(e.date||'').match(/\b(?:1\d{3}|20\d{2})\b/g)?.map(Number)||[];
   return years.length>=2?year>=years[0]&&year<=years[1]:years.length===1&&year===years[0];
  })());
  const events=residence.length?residence:(p.events||[]).filter(e=>['BIRT','DEAT'].includes(e.type)&&e.place&&gedYear(e.date)===year);
  for(const place of new Set(events.map(e=>e.place)))counts.set(place,(counts.get(place)||0)+1);
 }
 return counts;
}
export function EraComparison({people}){
 const [before,setBefore]=useState(1850),[after,setAfter]=useState(1900);
 const a=useMemo(()=>placesAt(people,before),[people,before]);
 const b=useMemo(()=>placesAt(people,after),[people,after]);
 const places=[...new Set([...a.keys(),...b.keys()])].sort((x,y)=>(b.get(y)||0)-(b.get(x)||0)).slice(0,100);
 return <div className="panel"><h2>Berðu saman tvö tímabil</h2><p>Fjöldi skráðra einstaklinga á hverjum stað á völdum árum. Ekki er ályktað um búsetu þegar ár vantar.</p><div className="twofields"><label>Fyrra ár<input type="number" min="1000" max="2026" value={before} onChange={e=>setBefore(Number(e.target.value))}/></label><label>Seinna ár<input type="number" min="1000" max="2026" value={after} onChange={e=>setAfter(Number(e.target.value))}/></label></div><div className="line"><b>Staður</b><span>{before} / {after}</span></div>{places.map(place=><div className="line" key={place}><b>{place}</b><span>{a.get(place)||0} / {b.get(place)||0}</span></div>)}{!places.length&&<p>Engar staðsetningar skráðar fyrir þessi ár.</p>}</div>;
}
export function Journey({people}){
 const [id,setId]=useState('');const person=people.find(p=>p.id===id);
 const events=(person?.events||[]).filter(e=>e.place&&['BIRT','RESI','DEAT','BURI'].includes(e.type)).slice().sort((a,b)=>(gedYear(a.date)||9999)-(gedYear(b.date)||9999));
 return <div className="panel"><h2>Lífshlaup og flutningar</h2><p>Skoðaðu skráða staði einstaklings í tímaröð. Ódagsettir atburðir birtast síðast.</p><PersonSearch people={people} value={id} onChange={setId} label="Leita að einstaklingi"/>{events.map((e,i)=><div className="line" key={i}><b>{e.place}</b><span>{e.type} · {localDate(e.date)}</span></div>)}{id&&!events.length&&<p>Engir staðir skráðir.</p>}</div>;
}
