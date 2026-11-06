/** Set Script Property FINANCE_TOKEN to a NEW private random secret (32+ characters).
 * Deploy as Web app: Execute as yourself; access Anyone. Token authorizes writes.
 * Append-only: never overwrites or deletes any pre-existing backup.
 */
function response_(x){return ContentService.createTextOutput(JSON.stringify(x)).setMimeType(ContentService.MimeType.JSON);}
function doGet(){return response_({protocol:2});}
function sha_(s){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,s,Utilities.Charset.UTF_8).map(function(b){return ('0'+((b+256)%256).toString(16)).slice(-2);}).join('');}
function doPost(e){var lock=LockService.getScriptLock();try{
 var x=JSON.parse(e.postData.contents),props=PropertiesService.getScriptProperties(),secret=props.getProperty('FINANCE_TOKEN');
 if(!secret||secret.length<32||x.token!==secret)return response_({ok:false,error:'unauthorized'});
 var b=x.backup;if(!b||b.format!=='finance-v7'||!/^[a-zA-Z0-9-]{10,100}$/.test(b.backupId)||typeof b.payload!=='string'||b.payload.length>20000000||sha_(b.payload)!==b.sha256)return response_({ok:false,error:'invalid-backup'});
 var state=JSON.parse(b.payload);if(!Array.isArray(state.data)||!Array.isArray(state.reminders)||!state.settings||!state.base)return response_({ok:false,error:'invalid-state'});
 lock.waitLock(25000);var folderId=props.getProperty('FINANCE_FOLDER_ID'),folder;if(folderId)folder=DriveApp.getFolderById(folderId);else{folder=DriveApp.createFolder('FinanceAppBackupsV2');props.setProperty('FINANCE_FOLDER_ID',folder.getId());}
 var name='finance-'+b.backupId+'.json',files=folder.getFilesByName(name),file;
 if(files.hasNext()){file=files.next();var old=JSON.parse(file.getBlob().getDataAsString('UTF-8'));if(old.sha256!==b.sha256||old.payload!==b.payload)return response_({ok:false,error:'id-conflict'});}
 else file=folder.createFile(name,JSON.stringify(b),MimeType.PLAIN_TEXT);
 var stored=JSON.parse(file.getBlob().getDataAsString('UTF-8'));if(sha_(stored.payload)!==b.sha256)throw Error('readback');
 return response_({ok:true,protocol:2,backupId:b.backupId,sha256:b.sha256});
 }catch(err){return response_({ok:false,error:'backup-failed'});}finally{if(lock.hasLock())lock.releaseLock();}}
