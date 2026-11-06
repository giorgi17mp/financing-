/** Finance v3 backend. Install in the owner's Google Apps Script account.
 * Private credentials belong ONLY in Script Properties; see setup.html.
 * Google Drive and Dropbox are append-only and read-back verified separately.
 */
var FINANCE_APP='https://giorgi17mp.github.io/financing-/';
function reply_(x){return ContentService.createTextOutput(JSON.stringify(x)).setMimeType(ContentService.MimeType.JSON);}
function props_(){return PropertiesService.getScriptProperties();}
function sha_(s){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,s,Utilities.Charset.UTF_8).map(function(b){return ('0'+((b+256)%256).toString(16)).slice(-2);}).join('');}
function doGet(e){var params=e&&e.parameter||{};if(params.state||params.code||params.error)return finishDropboxOAuth_(params);return reply_({protocol:3});}
function authorized_(x){var s=props_().getProperty('FINANCE_TOKEN');return s&&s.length>=32&&x.token===s;}
function schedulerEnabled_(){return ScriptApp.getProjectTriggers().some(function(t){return t.getHandlerFunction()==='financeHourly';});}
function folder_(){var p=props_(),id=p.getProperty('FINANCE_FOLDER_ID');if(id)return DriveApp.getFolderById(id);var f=DriveApp.createFolder('FinanceAppBackupsV3');p.setProperty('FINANCE_FOLDER_ID',f.getId());return f;}
function validateBackup_(b){if(!b||b.format!=='finance-v7'||!/^[a-zA-Z0-9-]{10,100}$/.test(b.backupId)||typeof b.payload!=='string'||b.payload.length>20000000||sha_(b.payload)!==b.sha256||!Number.isFinite(Date.parse(b.at)))throw Error('invalid-backup');var s=JSON.parse(b.payload);if(!Array.isArray(s.data)||!Array.isArray(s.reminders)||!s.settings||!s.base)throw Error('invalid-state');return s;}
function saveDrive_(b){var folder=folder_(),name='finance-'+b.backupId+'.json',files=folder.getFilesByName(name),file;if(files.hasNext()){file=files.next();var old=JSON.parse(file.getBlob().getDataAsString('UTF-8'));if(old.sha256!==b.sha256||old.payload!==b.payload)throw Error('id-conflict');}else file=folder.createFile(name,JSON.stringify(b),MimeType.PLAIN_TEXT);var check=JSON.parse(file.getBlob().getDataAsString('UTF-8'));if(sha_(check.payload)!==b.sha256)throw Error('drive-readback-failed');var p=props_(),last=p.getProperty('FINANCE_LATEST_AT');if(!last||b.at>=last){p.setProperty('FINANCE_LATEST_FILE',file.getId());p.setProperty('FINANCE_LATEST_AT',b.at);}return file;}
function dropboxAccess_(){var p=props_(),key=p.getProperty('DROPBOX_APP_KEY'),secret=p.getProperty('DROPBOX_APP_SECRET'),refresh=p.getProperty('DROPBOX_REFRESH_TOKEN');if(!key||!secret||!refresh)throw Error('Dropbox დასაკავშირებელია');var cache=CacheService.getScriptCache(),cached=cache.get('dropbox-access');if(cached)return cached;var res=UrlFetchApp.fetch('https://api.dropbox.com/oauth2/token',{method:'post',payload:{grant_type:'refresh_token',refresh_token:refresh,client_id:key,client_secret:secret},muteHttpExceptions:true});if(res.getResponseCode()!==200)throw Error('Dropbox ავტორიზაცია შესამოწმებელია');var token=JSON.parse(res.getContentText()).access_token;if(!token)throw Error('Dropbox ავტორიზაცია ვერ დადასტურდა');cache.put('dropbox-access',token,10000);return token;}
function saveDropbox_(b,file){try{var token=dropboxAccess_(),path='/finance-'+b.backupId+'.json';var res=UrlFetchApp.fetch('https://content.dropboxapi.com/2/files/upload',{method:'post',contentType:'application/octet-stream',headers:{Authorization:'Bearer '+token,'Dropbox-API-Arg':JSON.stringify({path:path,mode:'add',autorename:false,mute:true,strict_conflict:true})},payload:Utilities.newBlob(JSON.stringify(b),'application/json').getBytes(),muteHttpExceptions:true});var code=res.getResponseCode();if(code!==200&&code!==409)throw Error('Dropbox ატვირთვა ვერ შესრულდა');var read=UrlFetchApp.fetch('https://content.dropboxapi.com/2/files/download',{method:'post',headers:{Authorization:'Bearer '+token,'Dropbox-API-Arg':JSON.stringify({path:path})},muteHttpExceptions:true});if(read.getResponseCode()!==200)throw Error('Dropbox ასლი ვერ წავიკითხეთ');var stored=JSON.parse(read.getContentText());if(stored.backupId!==b.backupId||stored.sha256!==b.sha256||sha_(stored.payload)!==b.sha256)throw Error('Dropbox ასლი არ ემთხვევა');file.setDescription('finance-dropbox-verified:'+b.sha256);return {verified:true,sha256:b.sha256};}catch(e){return {verified:false,error:e.message||'Dropbox ასლი ვერ დადასტურდა'};}}
function devices_(){return JSON.parse(props_().getProperty('FINANCE_DEVICES')||'{}');}
function doPost(e){var lock=LockService.getScriptLock();try{var x=JSON.parse(e.postData.contents);if(!authorized_(x))return reply_({ok:false,error:'unauthorized'});lock.waitLock(25000);var p=props_();if(x.action==='dropbox-connect')return reply_(startDropboxOAuth_());if(x.action==='push-config'){var cfg=JSON.parse(p.getProperty('FIREBASE_PUBLIC_CONFIG')||'null'),vapid=p.getProperty('FIREBASE_VAPID_PUBLIC_KEY');if(!cfg||!vapid||!p.getProperty('FIREBASE_SERVICE_ACCOUNT'))throw Error('Firebase ჯერ დასაკავშირებელია');var safe={};['apiKey','authDomain','projectId','storageBucket','messagingSenderId','appId'].forEach(function(k){if(typeof cfg[k]==='string')safe[k]=cfg[k];});if(!safe.apiKey||!safe.projectId||!safe.messagingSenderId||!safe.appId)throw Error('არასრული Firebase public config');return reply_({ok:true,protocol:3,firebaseConfig:safe,vapidKey:vapid,schedulerEnabled:schedulerEnabled_()});}
 if(x.action==='subscribe'||x.action==='unsubscribe'){if(!/^[-a-zA-Z0-9_]{5,100}$/.test(x.deviceId||''))throw Error('invalid-device');var d=devices_();if(x.action==='subscribe'){if(typeof x.pushToken!=='string'||x.pushToken.length<20||x.pushToken.length>4096)throw Error('invalid-push-token');if(!d[x.deviceId]&&Object.keys(d).length>=5)throw Error('მაქსიმუმ 5 ტელეფონია დაშვებული');d[x.deviceId]={token:x.pushToken,at:new Date().toISOString()};}else delete d[x.deviceId];p.setProperty('FINANCE_DEVICES',JSON.stringify(d));return reply_({ok:true,protocol:3,subscribed:x.action==='subscribe',schedulerEnabled:schedulerEnabled_()});}
 if(x.action==='test-push'){var device=devices_()[x.deviceId];if(!device)throw Error('ჯერ დააკავშირე ეს ტელეფონი');var sent=sendPush_(device.token,'Finance · სატესტო შეტყობინება','შეტყობინებები ამ ტელეფონზე მუშაობს.','finance-test');return reply_({ok:sent.accepted,protocol:3,accepted:sent.accepted,error:sent.error});}
 if(x.action)throw Error('unknown-action');var b=x.backup;validateBackup_(b);var file=saveDrive_(b),dropbox=saveDropbox_(b,file);return reply_({ok:true,protocol:3,backupId:b.backupId,sha256:b.sha256,destinations:{google:{verified:true,sha256:b.sha256},dropbox:dropbox}});
 }catch(err){return reply_({ok:false,error:err.message||'backup-failed'});}finally{if(lock.hasLock())lock.releaseLock();}}
// Run ONCE from the Script editor after authorizing Drive, URL Fetch and triggers.
function installFinanceScheduler(){ScriptApp.getProjectTriggers().forEach(function(t){if(t.getHandlerFunction()==='financeHourly')ScriptApp.deleteTrigger(t);});ScriptApp.newTrigger('financeHourly').timeBased().everyHours(1).create();}
function base64url_(s){return Utilities.base64EncodeWebSafe(s).replace(/=+$/,'');}
function firebaseAccess_(){var cache=CacheService.getScriptCache(),cached=cache.get('finance-fcm-oauth');if(cached)return cached;var sa=JSON.parse(props_().getProperty('FIREBASE_SERVICE_ACCOUNT')||'null');if(!sa||!sa.private_key||!sa.client_email||!sa.project_id)throw Error('Firebase service account დასაკავშირებელია');var now=Math.floor(Date.now()/1000),unsigned=base64url_(JSON.stringify({alg:'RS256',typ:'JWT'}))+'.'+base64url_(JSON.stringify({iss:sa.client_email,scope:'https://www.googleapis.com/auth/firebase.messaging',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600})),sig=Utilities.computeRsaSha256Signature(unsigned,sa.private_key),jwt=unsigned+'.'+base64url_(sig);var response=UrlFetchApp.fetch('https://oauth2.googleapis.com/token',{method:'post',payload:{grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:jwt},muteHttpExceptions:true});if(response.getResponseCode()!==200)throw Error('Firebase ავტორიზაცია ვერ შესრულდა');var token=JSON.parse(response.getContentText()).access_token;cache.put('finance-fcm-oauth',token,3300);return token;}
function sendPush_(token,title,body,tag){try{var sa=JSON.parse(props_().getProperty('FIREBASE_SERVICE_ACCOUNT')||'null');if(!sa||!/^[-a-z0-9]+$/.test(sa.project_id))throw Error('Firebase project missing');var res=UrlFetchApp.fetch('https://fcm.googleapis.com/v1/projects/'+sa.project_id+'/messages:send',{method:'post',contentType:'application/json',headers:{Authorization:'Bearer '+firebaseAccess_()},payload:JSON.stringify({message:{token:token,data:{title:title,body:body,tag:tag,url:FINANCE_APP},webpush:{headers:{TTL:'3600',Urgency:'normal'}}}}),muteHttpExceptions:true});if(res.getResponseCode()!==200)return {accepted:false,error:'Firebase-მა შეტყობინება არ მიიღო'};var message=JSON.parse(res.getContentText());return {accepted:!!message.name};}catch(e){return {accepted:false,error:e.message};}}
function dueDate_(period,day){var a=period.split('-').map(Number),last=new Date(Date.UTC(a[0],a[1],0)).getUTCDate();return new Date(Date.UTC(a[0],a[1]-1,Math.min(day,last))).toISOString().slice(0,10);}
function nextPeriod_(period){var a=period.split('-').map(Number);return new Date(Date.UTC(a[0],a[1],1)).toISOString().slice(0,7);}
function alertItems_(state,today){var n=state.settings.notifications||{};if(!n.enabled)return [];var periods=[],period=state.settings.reminderTrackingStart||today.slice(0,7),end=nextPeriod_(today.slice(0,7)),lead=n.leadDays||[3,1,0],out=[];if(!/^\d{4}-\d{2}$/.test(period)||period>end)period=today.slice(0,7);while(period<=end&&periods.length<1200){periods.push(period);period=nextPeriod_(period);}periods.forEach(function(period){state.reminders.forEach(function(r){var key=period+'-'+r.id,due=dueDate_(period,r.day),days=Math.round((Date.parse(due+'T12:00:00Z')-Date.parse(today+'T12:00:00Z'))/86400000);if(r.enabled!==false&&(!r.startMonth||r.startMonth<=period)&&!state.reminderPaid[key]&&!(r.snoozeUntil&&r.snoozeUntil>today)&&(days<0||lead.indexOf(days)>=0))out.push({id:r.id,key:key,due:due,days:days});});});return out;}
function financeHourly(){var lock=LockService.getScriptLock();if(!lock.tryLock(1000))return;try{var p=props_(),id=p.getProperty('FINANCE_LATEST_FILE');if(!id)return;var b=JSON.parse(DriveApp.getFileById(id).getBlob().getDataAsString('UTF-8')),state=validateBackup_(b),n=state.settings.notifications||{},zone=n.timezone==='Asia/Tbilisi'?'Asia/Tbilisi':'America/New_York',today=Utilities.formatDate(new Date(),zone,'yyyy-MM-dd'),hour=Number(Utilities.formatDate(new Date(),zone,'H'));var alerts=alertItems_(state,today);if(n.enabled&&hour>=Number(n.hour||9)&&hour<=21&&alerts.length){var devices=devices_(),sent=JSON.parse(p.getProperty('FINANCE_SENT')||'{}');if(sent.day!==today)sent={day:today,devices:{}};var overdue=alerts.filter(function(i){return i.days<0;}).length;Object.keys(devices).forEach(function(key){if(sent.devices[key])return;var result=sendPush_(devices[key].token,'Finance · გადასახადების შეხსენება',overdue?overdue+' ვადაგადაცილებული გადასახადია. გადაამოწმე აპში.':alerts.length+' გადასახადის ვადა ახლოვდება. გადაამოწმე აპში.','finance-bills-'+today);if(result.accepted)sent.devices[key]=true;});p.setProperty('FINANCE_SENT',JSON.stringify(sent));}
 // Retry incomplete Dropbox copies even while the phone app is closed.
 if(p.getProperty('DROPBOX_REFRESH_TOKEN')){var files=folder_().getFiles(),attempted=0;while(files.hasNext()&&attempted<5){var f=files.next();if(!/^finance-.*\.json$/.test(f.getName())||String(f.getDescription()||'').indexOf('finance-dropbox-verified:')===0)continue;attempted++;try{var pending=JSON.parse(f.getBlob().getDataAsString('UTF-8'));validateBackup_(pending);saveDropbox_(pending,f);}catch(ignore){}}}
 }finally{lock.releaseLock();}}
// Owner-only setup helper: no secret is logged. Get code from Dropbox's authorization page.
function connectDropboxOnce(){exchangeDropboxCode_(props_().getProperty('DROPBOX_AUTH_CODE'));}
function exchangeDropboxCode_(code,redirect){
  var p=props_(),code=(code||'').trim(),key=(p.getProperty('DROPBOX_APP_KEY')||'').trim(),secret=(p.getProperty('DROPBOX_APP_SECRET')||'').trim();
  if(!code||!key||!secret||/^PASTE_/.test(code)||/^PASTE_/.test(secret))throw Error('Fill DROPBOX_APP_KEY, DROPBOX_APP_SECRET and DROPBOX_AUTH_CODE in Script Properties');
  var payload={grant_type:'authorization_code',code:code,client_id:key,client_secret:secret};if(redirect)payload.redirect_uri=redirect;
  var res=UrlFetchApp.fetch('https://api.dropbox.com/oauth2/token',{method:'post',payload:payload,muteHttpExceptions:true}),status=res.getResponseCode(),tokens;
  try{tokens=JSON.parse(res.getContentText());}catch(e){throw Error('Dropbox returned an unreadable response (HTTP '+status+').');}
  if(status!==200){
    if(tokens.error==='invalid_client')throw Error('Dropbox rejected the app key or app secret (invalid_client). Check DROPBOX_APP_KEY and DROPBOX_APP_SECRET.');
    if(tokens.error==='invalid_grant')throw Error('Dropbox rejected the one-time authorization code (invalid_grant). It may be expired, already used, or from another app.');
    throw Error('Dropbox connection failed (HTTP '+status+'). No credentials were changed.');
  }
  if(!tokens.refresh_token)throw Error('Request token_access_type=offline');
  p.setProperty('DROPBOX_REFRESH_TOKEN',tokens.refresh_token);p.deleteProperty('DROPBOX_AUTH_CODE');var cache=CacheService.getScriptCache();cache.remove('dropbox-access');
}

// Start only through the authenticated app. The browser never receives private keys.
function startDropboxOAuth_(){
  var p=props_(),key=(p.getProperty('DROPBOX_APP_KEY')||'').trim(),secret=(p.getProperty('DROPBOX_APP_SECRET')||'').trim(),redirect=ScriptApp.getService().getUrl();
  if(!key||!secret||/^PASTE_/.test(secret))throw Error('Dropbox-ის აპის გასაღებები ჯერ შესავსებია');
  if(!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(redirect||''))throw Error('სკრიპტი ჯერ Web App-ად გამოსაქვეყნებელია');
  var state=Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'');
  p.setProperty('DROPBOX_OAUTH_PENDING',JSON.stringify({hash:sha_(state),expires:Date.now()+15*60*1000,redirect:redirect}));
  return {ok:true,protocol:3,authorizeUrl:'https://www.dropbox.com/oauth2/authorize?client_id='+encodeURIComponent(key)+'&response_type=code&token_access_type=offline&redirect_uri='+encodeURIComponent(redirect)+'&state='+encodeURIComponent(state)};
}
function dropboxResultPage_(ok,verified){
  var title=ok?'Dropbox დაკავშირებულია':'Dropbox-ის დაკავშირება ვერ დასრულდა',message=verified?'მიმდინარე სარეზერვო ასლი შენახულია და მთლიანობა შემოწმებულია.':ok?'კავშირი მზადაა. დაბრუნდი Finance-ში და დააჭირე „გადამოწმება / გაგზავნა“.':'დაბრუნდი Finance-ში და ხელახლა დააჭირე „Dropbox-ის დაკავშირება“. კოდის კოპირება საჭირო არ არის.';
  return HtmlService.createHtmlOutput('<!doctype html><html lang="ka"><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>Finance · Dropbox</title><style>body{font-family:system-ui;background:#f3f6fb;color:#17243b;padding:24px;line-height:1.6}main{max-width:540px;margin:10vh auto;background:white;border-radius:24px;padding:28px}h1{font-size:24px}a{display:inline-block;background:#2563eb;color:white;padding:14px 22px;border-radius:14px;text-decoration:none}</style></head><body><main><h1>'+title+'</h1><p>'+message+'</p><a target="_top" rel="noreferrer" href="'+FINANCE_APP+'?backups=1">Finance-ში დაბრუნება</a></main></body></html>').setTitle('Finance · Dropbox');
}
function finishDropboxOAuth_(params){
  var lock=LockService.getScriptLock(),ok=false,verified=false;
  try{
    lock.waitLock(25000);
    var p=props_(),pending=JSON.parse(p.getProperty('DROPBOX_OAUTH_PENDING')||'null');
    if(!pending||pending.expires<Date.now()||typeof params.state!=='string'||! /^[a-f0-9]{64}$/.test(params.state)||sha_(params.state)!==pending.hash)throw Error('invalid-state');
    p.deleteProperty('DROPBOX_OAUTH_PENDING');
    if(params.error||typeof params.code!=='string'||!params.code||params.code.length>2048)throw Error('authorization-cancelled');
    exchangeDropboxCode_(params.code,pending.redirect);ok=true;
    var latest=p.getProperty('FINANCE_LATEST_FILE');
    if(latest){var file=DriveApp.getFileById(latest),backup=JSON.parse(file.getBlob().getDataAsString('UTF-8'));validateBackup_(backup);verified=saveDropbox_(backup,file).verified===true;}
  }catch(ignore){/* Never reflect an authorization code, token or provider response into HTML. */}
  finally{if(lock.hasLock())lock.releaseLock();}
  return dropboxResultPage_(ok,verified);
}

// OWNER ONLY: run manually in the editor. Never callable through doPost.
// Creates a private credential without placing it in source code or logs.
function setupFinanceOnce(){
 var lock=LockService.getScriptLock();lock.waitLock(25000);
 try{
  var p=props_(),token=p.getProperty('FINANCE_TOKEN');
  if(token&&token.length<32)throw Error('FINANCE_TOKEN must contain at least 32 characters');
  if(!p.getProperty('FINANCE_FOLDER_ID')){
   var old=DriveApp.getFoldersByName('FinanceAppBackups');
   if(old.hasNext()){var folder=old.next();if(old.hasNext())throw Error('Multiple FinanceAppBackups folders: select FINANCE_FOLDER_ID explicitly');p.setProperty('FINANCE_FOLDER_ID',folder.getId());}
  }
  folder_();
  if(!token)p.setProperty('FINANCE_TOKEN',Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,''));
  if(!schedulerEnabled_())ScriptApp.newTrigger('financeHourly').timeBased().everyHours(1).create();
  return 'Setup complete. FINANCE_TOKEN is stored privately in Script Properties. Connect the phone and verify its first backup.';
 }finally{lock.releaseLock();}
}
