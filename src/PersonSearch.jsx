import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Search} from 'lucide-react';
import {localDate} from './gedcom';

export default function PersonSearch({people,value,onChange,label='Velja einstakling'}){
 const current=people.find(p=>p.id===value);
 const [query,setQuery]=useState('');
 const [open,setOpen]=useState(false);
 const [active,setActive]=useState(0);
 const root=useRef(null);
 useEffect(()=>{setQuery('')},[value]);
 useEffect(()=>{const handler=e=>{if(root.current&&!root.current.contains(e.target))setOpen(false)};document.addEventListener('pointerdown',handler);return()=>document.removeEventListener('pointerdown',handler)},[]);
 const matches=useMemo(()=>{
  const q=query.trim().toLocaleLowerCase('is');
  if(!q)return [];
  return people.filter(p=>p.name?.toLocaleLowerCase('is').includes(q)||String(p.birth||'').toLocaleLowerCase('is').includes(q)).slice(0,30);
 },[people,query]);
 const choose=p=>{onChange(p.id);setQuery('');setOpen(false);setActive(0)};
 return <div className="person-search" ref={root}>
  <label className="person-search-label">{label}</label>
  <div className="person-search-input"><Search size={17}/><input aria-label={label} autoComplete="off" value={open?query:(current?.name||'')} placeholder="Byrjaðu að skrifa nafn..." onFocus={()=>{setOpen(true);setQuery('')}} onChange={e=>{setQuery(e.target.value);setOpen(true);setActive(0)}} onKeyDown={e=>{if(e.key==='Escape')setOpen(false);if(e.key==='ArrowDown'){e.preventDefault();setActive(a=>Math.min(a+1,matches.length-1))}if(e.key==='ArrowUp'){e.preventDefault();setActive(a=>Math.max(0,a-1))}if(e.key==='Enter'&&matches[active]){e.preventDefault();choose(matches[active])}}}/></div>
  {open&&<div className="person-search-results" role="listbox">{!query.trim()?<div className="person-search-hint">Skrifaðu nafn til að leita í öllu safninu.</div>:matches.length?matches.map((p,i)=><button type="button" role="option" aria-selected={i===active} className={i===active?'focused':''} key={p.id} onMouseDown={e=>e.preventDefault()} onClick={()=>choose(p)}><strong>{p.name}</strong><small>{localDate(p.birth)}{p.death?' – '+localDate(p.death):''}</small></button>):<div className="person-search-hint">Enginn fannst.</div>}</div>}
 </div>
}
