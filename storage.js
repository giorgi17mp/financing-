/* Finance durable storage v7. No embedded personal data or network access. */
(function(root){
'use strict';
const KEY='finance_v7_mirror', DB='finance-durable-v7';
const clone=x=>JSON.parse(JSON.stringify(x));
const TYPES=['income','debit_expense','credit_expense','transfer_georgia','georgia_expense','georgia_income','credit_payment'];
function validDate(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return false;const d=new Date(s+'T12:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===s;}
const cents=n=>Math.round(Number(n)*100);
function validate(s){
 if(!s||!Array.isArray(s.data)||!Array.isArray(s.reminders)||!s.settings||typeof s.settings!=='object'||!s.reminderPaid||typeof s.reminderPaid!=='object')throw Error('არასრული სარეზერვო ასლი');
 const ids=new Set();for(const e of s.data){if(!e||typeof e.id!=='string'||!/^[-_a-zA-Z0-9]+$/.test(e.id)||ids.has(e.id))throw Error('განმეორებული ან არასწორი ჩანაწერის ID');ids.add(e.id);if(!TYPES.includes(e.type)||typeof e.amount!=='number'||!Number.isFinite(e.amount)||e.amount<0||Math.abs(e.amount)>1e10||typeof e.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(e.date))throw Error('არასწორი ჩანაწერი: '+e.id);if(e.gelAmount!=null&&(typeof e.gelAmount!=='number'||!Number.isFinite(e.gelAmount)||e.gelAmount<0))throw Error('არასწორი GEL თანხა');}
 const rids=new Set();for(const r of s.reminders){if(!r||typeof r.id!=='string'||!/^[-_a-zA-Z0-9]+$/.test(r.id)||rids.has(r.id)||typeof r.name!=='string'||!Number.isInteger(r.day)||r.day<1||r.day>31||!['USD','GEL'].includes(r.currency)||!(r.amount===''||(typeof r.amount==='number'&&Number.isFinite(r.amount)&&r.amount>=0)))throw Error('არასწორი რემაინდერი');rids.add(r.id);}
 if(s.settings.notifications){const n=s.settings.notifications;if(typeof n.enabled!=='boolean'||!Array.isArray(n.leadDays)||n.leadDays.some(d=>!Number.isInteger(d)||d<0||d>31)||!Number.isInteger(n.hour)||n.hour<0||n.hour>23||!['America/New_York','Asia/Tbilisi'].includes(n.timezone))throw Error('არასწორი შეტყობინებების პარამეტრები');}
 if(!(s.settings.creditLimit>0)||!Number.isFinite(s.settings.creditLimit)||!Number.isFinite(s.settings.creditTarget)||s.settings.creditTarget<0||s.settings.creditTarget>100)throw Error('არასწორი ლიმიტი / სამიზნე');
 if(!s.base||!validDate(s.base.as_of)||!['debit','credit','georgia'].every(k=>typeof s.base[k]==='number'&&Number.isFinite(s.base[k])))throw Error('საწყისი ბალანსი აკლია');
 if(s.settings.budgets&&Object.values(s.settings.budgets).some(n=>typeof n!=='number'||!Number.isFinite(n)||n<0))throw Error('არასწორი ბიუჯეტი');
 if(s.trash?.length){const copy={...s,trash:[],data:s.trash.map(r=>r.entry)};validate(copy);}
 if(s.trash&&!Array.isArray(s.trash))throw Error('არასწორი სანაგვე');return s;
}
async function digest(s){if(!crypto.subtle)return root.financeHash(s);const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return Array.from(new Uint8Array(buf),b=>b.toString(16).padStart(2,'0')).join('');}
async function pack(state,revision,reason){validate(state);const payload=JSON.stringify(state);return {format:'finance-v7',revision,backupId:typeof crypto.randomUUID==='function'?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join(''),at:new Date().toISOString(),reason,payload,sha256:await digest(payload)};}
async function unpack(e){if(!e||e.format!=='finance-v7'||!Number.isSafeInteger(e.revision)||e.revision<1||typeof e.payload!=='string'||await digest(e.payload)!==e.sha256)throw Error('ასლის მთლიანობა ვერ დადასტურდა');return validate(JSON.parse(e.payload));}
function request(r){return new Promise((res,rej)=>{r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
function done(tx){return new Promise((res,rej)=>{tx.oncomplete=res;tx.onerror=()=>rej(tx.error||Error('შენახვის შეცდომა'));tx.onabort=()=>rej(tx.error||Error('შენახვა შეწყდა'));});}
class Store{
 constructor({indexedDB:factory=root.indexedDB,localStorage:local=root.localStorage,name=DB}={}){this.factory=factory;this.local=local;this.name=name;this.current=null;this.mirrorWarning='';}
 async open(){const r=this.factory.open(this.name,1);r.onupgradeneeded=()=>{r.result.createObjectStore('current');r.result.createObjectStore('history',{keyPath:'backupId'});};this.db=await new Promise((res,rej)=>{r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);r.onblocked=()=>rej(Error('დახურე აპის სხვა ფანჯრები და სცადე ხელახლა'));});this.db.onversionchange=()=>this.db.close();}
 async read(){const tx=this.db.transaction('current','readonly');return request(tx.objectStore('current').get('state'));}
 async start(){await this.open();let primary=await this.read(),mirror=null;try{const raw=this.local.getItem(KEY);if(raw){mirror=JSON.parse(raw);await unpack(mirror);}}catch(e){this.mirrorWarning='მეორე ადგილობრივი ასლი მიუწვდომელია ან დაზიანებულია';}
 if(primary){await unpack(primary);if(mirror&&mirror.revision>primary.revision)throw Error('ასლების ვერსიები განსხვავდება. ჯერ გაიტანე ორივე ასლი და შეამოწმე.');this.current=primary;this.writeMirror(primary);return unpack(primary);}
 if(mirror)throw Error('ძირითადი საცავი ცარიელია. მეორე ასლი ხელმისაწვდომია ექსპორტისთვის; ავტომატური ჩანაცვლება შეჩერებულია.');return null;}
 writeMirror(e){try{this.local.setItem(KEY,JSON.stringify(e));if(this.local.getItem(KEY)!==JSON.stringify(e))throw Error();this.mirrorWarning='';}catch(err){this.mirrorWarning='შენახულია ძირითად საცავში; მეორე ასლი ვერ შეიქმნა — ჩამოტვირთე Backup';}}
 async commit(state,reason='edit'){
 const expected=this.current?.revision||0, e=await pack(clone(state),expected+1,reason);
 let tx;try{tx=this.db.transaction(['current','history'],'readwrite',{durability:'strict'});}catch(err){if(err.name!=='TypeError')throw err;tx=this.db.transaction(['current','history'],'readwrite');}const finished=done(tx),cur=tx.objectStore('current'),hist=tx.objectStore('history');let conflict=false;
 const r=cur.get('state');r.onsuccess=()=>{if((r.result?.revision||0)!==expected){conflict=true;tx.abort();return;}cur.put(e,'state');hist.put(e);};
 try{await finished;}catch(err){if(conflict)throw Error('სხვა ფანჯარაში შეიცვალა მონაცემები. ეს ცვლილება არ შენახულა. გაიტანე ასლი და განაახლე გვერდი.');throw err;}
 this.current=e;this.writeMirror(e);return clone(state);
 }
 async history(){const rows=await request(this.db.transaction('history').objectStore('history').getAll());return rows.sort((a,b)=>b.revision-a.revision);}
 async prune(){// Keep recent changes, daily checkpoints and every import/migration.
 const rows=await this.history(),days=new Set(),keep=new Set(rows.slice(0,80).map(x=>x.backupId));for(const e of rows){const day=e.at.slice(0,10);if(days.size<60&&!days.has(day)){keep.add(e.backupId);days.add(day);}if(/migration|import|reconcile/.test(e.reason))keep.add(e.backupId);}
 const tx=this.db.transaction('history','readwrite'),finished=done(tx);for(const e of rows)if(!keep.has(e.backupId))tx.objectStore('history').delete(e.backupId);await finished;
 }
}
function balances(s,today){const b={debit:cents(s.base.debit),credit:cents(s.base.credit),georgia:cents(s.base.georgia)};for(const e of s.data){if(!validDate(e.date)||e.date<=s.base.as_of||e.date>today)continue;const a=cents(e.amount);if(e.type==='income')b.debit+=a;if(['debit_expense','transfer_georgia','credit_payment'].includes(e.type))b.debit-=a;if(e.type==='credit_expense')b.credit+=a;if(e.type==='credit_payment')b.credit-=a;if(e.type==='transfer_georgia')b.georgia+=cents(e.gelAmount||0);if(e.type==='georgia_expense')b.georgia-=a;if(e.type==='georgia_income')b.georgia+=a;}return Object.fromEntries(Object.entries(b).map(([k,v])=>[k,v/100]));}
root.FinanceStorage={Store,validate,pack,unpack,validDate,balances,cents,clone,KEY};
if(typeof module!=='undefined')module.exports=root.FinanceStorage;
})(globalThis);
