import React,{useState} from 'react';
import {localDate} from './gedcom';
export default function FamilyTree({root,byId,onOpen}){
 const [depth,setDepth]=useState(4),[zoom,setZoom]=useState(85),[collapsed,setCollapsed]=useState({}),[mode,setMode]=useState('parents');
 if(!root)return <p>Veldu einstakling fyrst.</p>;
 const card=(p,main=false)=><button type="button" className={'family-node '+(main?'family-root':'')} onClick={()=>onOpen(p.id)} title="Opna einstaklingsspjald"><strong>{p.name||'Ónafngreindur'}</strong><small>{localDate(p.birth)||'Fæðingardagur óskráður'}</small></button>;
 const branch=(p,level,path=new Set())=>{
  const id=String(p.id),cycle=path.has(id),ids=(p[mode]||[]).map(String).filter(x=>byId.has(x));
  const more=ids.length>0&&level<depth&&!collapsed[id]&&!cycle;
  const next=new Set(path);next.add(id);
  return <div className="family-branch" key={id}>
   {more&&<div className="family-parents">{ids.map(pid=>branch(byId.get(pid),level+1,next))}</div>}
   <div className="family-nodewrap">{card(p,level===0)}{ids.length>0&&!cycle&&<button className="family-toggle" title={collapsed[id]?'Opna grein':'Loka grein'} onClick={()=>setCollapsed(s=>({...s,[id]:!s[id]}))}>{collapsed[id]?'+':more?'−':level>=depth?'+':'−'}</button>}</div>
  </div>;
 };
 return <div className="family-view">
  <div className="family-toolbar"><div className="family-modes"><button className={mode==='parents'?'active':''} onClick={()=>{setMode('parents');setCollapsed({})}}>Forfeður</button><button className={mode==='children'?'active':''} onClick={()=>{setMode('children');setCollapsed({})}}>Afkomendur</button></div><label>Kynslóðir <select value={depth} onChange={e=>setDepth(+e.target.value)}>{Array.from({length:12},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select></label><label>Stærð <input aria-label="Stærð trés" type="range" min="45" max="125" value={zoom} onChange={e=>setZoom(+e.target.value)}/></label><button onClick={()=>{setCollapsed({});setZoom(85)}}>Endurstilla</button></div>
  <p className="family-hint">{mode==='parents'?'Föður- og móðurætt greinast út frá einstaklingnum. Röð foreldra fylgir skráðum tengingum.':'Afkomendur greinast eftir skráðum barnatengingum.'} Ýttu á + eða − til að opna og loka greinum. Smelltu á nafn til að skoða einstakling.</p>
  <div className="family-scroll"><div className="family-scale" style={{zoom:`${zoom}%`}}>{branch(root,0)}</div></div>
 </div>;
}
