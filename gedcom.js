// GEDCOM 5.5/5.5.1 basic parser. Never assume all extensions are supported.
export function parseGedcom(text){
 const records=[]; let current=null, event=null, sub=null;
 for(const raw of text.replace(/^\uFEFF/,'').split(/\r?\n/)){
  const m=raw.match(/^(\d+)\s+(?:(@[^@]+@)\s+)?([A-Z0-9_]+)(?:\s+(.*))?$/i);if(!m)continue;
  const [,lev,id,tag,value='']=m;const n=+lev;
  if(n===0){current={id:id||'',tag,events:[],families:[]};records.push(current);event=null;sub=null;continue}
  if(!current)continue;
  if(n===1){sub=null;if(['BIRT','DEAT','BURI','RESI','MARR','EVEN','OCCU'].includes(tag)){event={type:tag,date:'',place:'',address:'',note:''};current.events.push(event)}else{event=null;if(tag==='NAME')current.name=value.replaceAll('/','').replace(/\s+/g,' ').trim();else if(tag==='SEX')current.sex=value;else if(tag==='FAMC')current.famc=value;else if(tag==='FAMS')current.families.push(value);else if(tag==='HUSB'||tag==='WIFE'||tag==='CHIL'){(current[tag.toLowerCase()]??=[]).push(value)}else if(tag==='NOTE')current.note=value}continue}
  if(n===2&&event){if(tag==='DATE')event.date=value;else if(tag==='PLAC')event.place=value;else if(tag==='ADDR')event.address=value;else if(tag==='NOTE')event.note=value;else if(tag==='TYPE')event.kind=value;sub=tag;continue}
  if(n===3&&event&&tag==='CONT'&&sub==='NOTE')event.note+='\n'+value;
 }
 const persons=records.filter(r=>r.tag==='INDI').map(r=>({id:r.id,name:r.name||'Ónefndur',sex:r.sex||'',birth:r.events.find(e=>e.type==='BIRT')?.date||'',death:r.events.find(e=>e.type==='DEAT')?.date||'',events:r.events,parents:[],children:[],spouses:[]}));
 const byId=new Map(persons.map(p=>[p.id,p]));
 for(const f of records.filter(r=>r.tag==='FAM')){const parents=[...(f.husb||[]),...(f.wife||[])];const children=f.chil||[];for(const a of parents){for(const b of parents){if(a!==b&&byId.has(a)&&byId.has(b))byId.get(a).spouses.push(b)}for(const c of children){if(byId.has(a)&&byId.has(c)){byId.get(a).children.push(c);byId.get(c).parents.push(a)}}}}
 return persons;
}
export function gedYear(s){const matches=String(s||'').match(/\b(1[0-9]{3}|20[0-9]{2})\b/g);return matches?+matches[0]:null}
export function localDate(s){if(!s)return '—';const m=String(s).match(/^(\d{1,2})\s+([A-Z]{3})\s+(\d{4})$/i);if(m){const months=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];const ix=months.indexOf(m[2].toUpperCase());if(ix>=0)return `${m[1].padStart(2,'0')}.${String(ix+1).padStart(2,'0')}.${m[3]}`;}return s;}
