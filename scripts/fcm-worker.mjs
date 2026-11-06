import {initializeApp} from 'firebase/app';
import {getMessaging,onBackgroundMessage} from 'firebase/messaging/sw';
// Only public Firebase web configuration is placed in the worker URL.
try{const raw=new URL(self.location.href).searchParams.get('push');if(raw){const config=JSON.parse(raw);const messaging=getMessaging(initializeApp(config,'finance-push-worker'));onBackgroundMessage(messaging,payload=>{const d=payload.data||{};return self.registration.showNotification(d.title||'Finance',{body:d.body||'გადაამოწმე გადასახადები აპში.',tag:d.tag||'finance-reminder',icon:new URL('icon-192.png',self.registration.scope).href,data:{url:self.registration.scope}});});}}catch(e){console.warn('Finance push configuration unavailable');}
