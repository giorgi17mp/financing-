/* Pure calendar and credit calculations, shared by UI tests. */
(function(root){
'use strict';
const iso=d=>d.toISOString().slice(0,10);
function dueDate(period,day){const [y,m]=period.split('-').map(Number);return iso(new Date(Date.UTC(y,m-1,Math.min(Number(day),new Date(Date.UTC(y,m,0)).getUTCDate()))));}
function shiftMonth(period,n){const [y,m]=period.split('-').map(Number);return iso(new Date(Date.UTC(y,m-1+n,1))).slice(0,7);}
function diff(a,b){return Math.round((Date.parse(a+'T12:00:00Z')-Date.parse(b+'T12:00:00Z'))/86400000);}
function item(r,paid,today,period=today.slice(0,7)){const due=dueDate(period,r.day),key=period+'-'+r.id,done=!!paid[key],days=diff(due,today);return {r,key,due,days,paid:done,snoozed:!done&&r.snoozeUntil&&r.snoozeUntil>today,status:done?'paid':days<0?'overdue':days===0?'today':'upcoming'};}
function list(state,today,period=today.slice(0,7)){return state.reminders.filter(r=>r.enabled!==false&&(!r.startMonth||r.startMonth<=period)).map(r=>item(r,state.reminderPaid,today,period)).sort((a,b)=>Number(a.paid)-Number(b.paid)||a.due.localeCompare(b.due));}
function periods(state,today){let p=state.settings.reminderTrackingStart||today.slice(0,7),end=shiftMonth(today.slice(0,7),1),out=[];if(!/^\d{4}-\d{2}$/.test(p)||p>end)p=today.slice(0,7);while(p<=end&&out.length<1200){out.push(p);p=shiftMonth(p,1);}return out;}
function openItems(state,today){return periods(state,today).flatMap(p=>list(state,today,p)).filter(i=>!i.paid).sort((a,b)=>a.due.localeCompare(b.due));}
function alerts(state,today){const n=state.settings.notifications||{};if(!n.enabled)return [];const lead=n.leadDays||[3,1,0];return openItems(state,today).filter(i=>!i.paid&&!i.snoozed&&(i.days<0||lead.includes(i.days)));}
function credit(debt,limit,targetPercent){const cents=n=>Math.round(Number(n)*100),used=Math.max(0,cents(debt)),cap=cents(limit),goal=Math.round(cap*targetPercent/100);return {used:used/100,goal:goal/100,limit:cap/100,goalRemaining:(goal-used)/100,limitRemaining:(cap-used)/100,goalPercent:goal>0?used/goal*100:used>0?100:0,limitPercent:cap>0?used/cap*100:0,overGoal:used>goal,overLimit:used>cap};}
root.FinanceReminder={dueDate,shiftMonth,diff,item,list,openItems,alerts,credit};if(typeof module!=='undefined')module.exports=root.FinanceReminder;
})(globalThis);
