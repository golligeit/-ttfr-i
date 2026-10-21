import React,{useMemo,useState} from 'react';
import {gedYear} from './gedcom';
const unique=a=>[...new Set((a||[]).filter(Boolean))];
export function linkFamily(people,baseId,relation,targetId,role,source=''){
 const next=people.map(p=>({...p,parents:[...(p.parents||[])],children:[...(p.children||[])],spouses:[...(p.spouses||[])],events:[...(p.events||[])]}));
 const base=next.find(p=>p.id===baseId),other=next.find(p=>p.id===targetId);
 if(!base||!other||baseId===targetId)throw Error('Veldu tvo ólíka einstaklinga.');
 const add=(p,k,id)=>p[k]=unique([...p[k],id]);
 const parentChild=(parent,child)=>{if(parent.id===child.id)throw Error('Einstaklingur getur ekki verið sitt eigið foreldri.');add(parent,'children',child.id);add(child,'parents',parent.id)};
 if(relation==='child')parentChild(base,other);
 if(relation==='parent')parentChild(other,base);
 if(relation==='spouse'){add(base,'spouses',other.id);add(other,'spouses',base.id)}
 if(relation==='sibling'){
  if(!(base.parents||[]).length)throw Error('Skráðu fyrst foreldri svo hægt sé að tengja systkini á öruggan hátt.');
  for(const pid of base.parents){const p=next.find(x=>x.id===pid);if(p)parentChild(p,other)}
 }
 if(source.trim())base.events.push({type:'SOUR',place:'',date:'',note:`${relation}: ${other.name} — ${source.trim()}`});
 return next;
}
function getWarnings(base,other,relation,people){
 const warnings=[];
 const parent=relation==='child'?base:relation==='parent'?other:null;
 const child=relation==='child'?other:relation==='parent'?base:null;
 if(parent&&child){const pb=gedYear(parent.birth),cb=gedYear(child.birth),pd=gedYear(parent.death);if(pb&&cb){const age=cb-pb;if(age<0)warnings.push('Barnið er skráð fætt áður en foreldrið fæddist.');else if(age<18)warnings.push(`Foreldrið er um ${age} ára við fæðingu barnsins. Athugaðu fæðingardagsetningar beggja.`)}if(pd&&cb&&cb>pd+1)warnings.push('Barnið er skráð fætt eftir andlát foreldris. Athugaðu dagsetningar.');}
 if(relation==='parent'&&(base.parents||[]).length>=2)warnings.push('Tveir foreldrar eru þegar skráðir. Athugaðu hvort tengingin eigi við.');
 if(relation==='spouse'&&((base.spouses||[]).includes(other.id)))warnings.push('Þessi maki er þegar tengdur.');
 const descendants=new Set();const visit=(id)=>{if(descendants.has(id))return;descendants.add(id);for(const c of people.find(p=>p.id===id)?.children||[])visit(c)};visit(child?.id||'');if(parent&&descendants.has(parent.id))warnings.push('Þessi tenging myndi skapa hring í ættartrénu. Ekki vista.');
 return warnings;
}
export default function RelationshipEditor({people,base,relation,onClose,onSave}){
 const [mode,setMode]=useState('existing'),[search,setSearch]=useState(''),[picked,setPicked]=useState(''),[name,setName]=useState(''),[birth,setBirth]=useState(''),[death,setDeath]=useState(''),[sex,setSex]=useState(''),[source,setSource]=useState(''),[confirmed,setConfirmed]=useState(false),[coParent,setCoParent]=useState(''),[error,setError]=useState('');
 const spouses=(base.spouses||[]).map(id=>people.find(p=>p.id===id)).filter(Boolean);
 const matches=useMemo(()=>people.filter(p=>p.id!==base.id&&p.name.toLocaleLowerCase('is').includes(search.toLocaleLowerCase('is'))).slice(0,25),[people,search,base.id]);
 const candidate=mode==='existing'?people.find(p=>p.id===picked):{id:'new',name,birth,death,sex,events:[],parents:[],children:[],spouses:[]};
 const warnings=candidate?.name?getWarnings(base,candidate,relation,people):[];
 const labels={child:'barn',parent:'foreldri',spouse:'maka',sibling:'systkini'};
 async function submit(e){e.preventDefault();setError('');try{
  if(!candidate?.name?.trim())throw Error('Veldu eða skráðu einstakling.');
  if(mode==='existing'&&!picked)throw Error('Veldu einstakling úr leitarniðurstöðum.');
  if(warnings.some(w=>w.includes('hring')))throw Error('Óheimilt að mynda hring í ættartrénu.');
  if(warnings.length&&!confirmed)throw Error('Farðu yfir viðvaranir og staðfestu dagsetningarnar.');
  let list=people;let id=picked;
  if(mode==='new'){id=`N${Date.now()}_${Math.random().toString(36).slice(2,10)}`;list=[...people,{...candidate,id,name:name.trim()}]}
  list=linkFamily(list,base.id,relation,id,'',source);
  if(relation==='child'&&coParent&&coParent!==base.id)list=linkFamily(list,coParent,'child',id);
  await onSave(list,id);
 }catch(err){setError(err.message)}}
 return <div className="overlay"><form className="modal family-modal" onSubmit={submit}>
 <div className="modalhead"><h2>Skrá {labels[relation]}</h2><button type="button" onClick={onClose}>×</button></div>
 <p><b>Tengt við:</b> {base.name}</p>
 <div className="family-choice"><button type="button" className={mode==='existing'?'primary':'secondary'} onClick={()=>{setMode('existing');setConfirmed(false)}}>Finna í safninu</button><button type="button" className={mode==='new'?'primary':'secondary'} onClick={()=>{setMode('new');setConfirmed(false)}}>Skrá nýjan</button></div>
 {mode==='existing'?<><label>Leita að nafni<input value={search} onChange={e=>{setSearch(e.target.value);setPicked('');setConfirmed(false)}} placeholder="Sláðu inn nafn"/></label><div className="family-results">{matches.map(p=><button type="button" className={picked===p.id?'selected':''} key={p.id} onClick={()=>{setPicked(p.id);setConfirmed(false)}}>{p.name} · {p.birth||'fæðing óþekkt'} {picked===p.id?'✓':''}</button>)}</div></>:<><label>Nafn<input required value={name} onChange={e=>setName(e.target.value)}/></label><label>Fæðing (DD.MM.YYYY eða ár)<input value={birth} onChange={e=>{setBirth(e.target.value);setConfirmed(false)}} placeholder="DD.MM.YYYY"/></label><label>Andlát (valfrjálst)<input value={death} onChange={e=>setDeath(e.target.value)} placeholder="DD.MM.YYYY"/></label><label>Kyn (valfrjálst)<select value={sex} onChange={e=>setSex(e.target.value)}><option value="">Óskráð</option><option value="F">Kona</option><option value="M">Karl</option></select></label>{people.some(p=>p.name.toLocaleLowerCase('is')===name.trim().toLocaleLowerCase('is'))&&<p className="family-warning">Athugaðu: Einstaklingur með sama nafn er þegar í safninu. Leitaðu áður en þú stofnar nýjan.</p>}</>}
 {relation==='parent'&&<p className="family-warning">Er þetta faðir eða móðir? Veldu rétt kyn ef það er þekkt; annars má hafa óskráð.</p>}
 {relation==='child'&&spouses.length>0&&<label>Á að skrá maka sem hitt foreldrið?<select value={coParent} onChange={e=>setCoParent(e.target.value)}><option value="">Nei / ákveða síðar</option>{spouses.map(p=><option key={p.id} value={p.id}>Já – {p.name}</option>)}</select><small>Ekki gert sjálfkrafa; þú velur sjálfur.</small></label>}
 <label>Heimild (valfrjálst)<input value={source} onChange={e=>setSource(e.target.value)} placeholder="Kirkjubók, manntal, munnleg heimild ..."/></label>
 {warnings.length>0&&<div className="family-warning"><b>Athuga áður en þú vistar</b>{warnings.map((w,i)=><p key={i}>{w}</p>)}<label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/> Ég hef athugað dagsetningar og vil halda áfram.</label></div>}
 {error&&<p className="family-error">{error}</p>}
 <div className="actions"><button type="button" className="secondary" onClick={onClose}>Hætta við</button><button className="primary" type="submit">Vista ættartengsl</button></div>
 </form></div>
}
