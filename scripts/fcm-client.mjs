import {initializeApp,getApps} from 'firebase/app';
import {getMessaging,getToken,deleteToken,onMessage,isSupported} from 'firebase/messaging';
let listener;
function messaging(config){const app=getApps().find(x=>x.name==='finance-push')||initializeApp(config,'finance-push');return getMessaging(app);}
async function listen(config,registration){if(!await isSupported())throw Error('ამ ბრაუზერს Push შეტყობინებების მხარდაჭერა არ აქვს.');const m=messaging(config);if(!listener)listener=onMessage(m,async payload=>{const d=payload.data||{};await registration.showNotification(d.title||'Finance',{body:d.body||'გადაამოწმე გადასახადები აპში.',tag:d.tag||'finance-reminder',icon:new URL('icon-192.png',registration.scope).href,data:{url:registration.scope}});});return m;}
globalThis.FinancePush={
 listen,
 async connect(config,vapidKey,registration){const m=await listen(config,registration);return getToken(m,{vapidKey,serviceWorkerRegistration:registration});},
 async disconnect(config){if(config&&await isSupported())await deleteToken(messaging(config));listener?.();listener=null;}
};
