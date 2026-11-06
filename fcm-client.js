(()=>{var Pe=()=>{};var Le=function(e){let t=[],n=0;for(let r=0;r<e.length;r++){let i=e.charCodeAt(r);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=i&63|128):(i&64512)===55296&&r+1<e.length&&(e.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(e.charCodeAt(++r)&1023),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=i&63|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=i&63|128)}return t},tn=function(e){let t=[],n=0,r=0;for(;n<e.length;){let i=e[n++];if(i<128)t[r++]=String.fromCharCode(i);else if(i>191&&i<224){let o=e[n++];t[r++]=String.fromCharCode((i&31)<<6|o&63)}else if(i>239&&i<365){let o=e[n++],s=e[n++],c=e[n++],f=((i&7)<<18|(o&63)<<12|(s&63)<<6|c&63)-65536;t[r++]=String.fromCharCode(55296+(f>>10)),t[r++]=String.fromCharCode(56320+(f&1023))}else{let o=e[n++],s=e[n++];t[r++]=String.fromCharCode((i&15)<<12|(o&63)<<6|s&63)}}return t.join("")},$e={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();let n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<e.length;i+=3){let o=e[i],s=i+1<e.length,c=s?e[i+1]:0,f=i+2<e.length,a=f?e[i+2]:0,U=o>>2,x=(o&3)<<4|c>>4,V=(c&15)<<2|a>>6,W=a&63;f||(W=64,s||(V=64)),r.push(n[U],n[x],n[V],n[W])}return r.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(Le(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):tn(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();let n=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<e.length;){let o=n[e.charAt(i++)],c=i<e.length?n[e.charAt(i)]:0;++i;let a=i<e.length?n[e.charAt(i)]:64;++i;let x=i<e.length?n[e.charAt(i)]:64;if(++i,o==null||c==null||a==null||x==null)throw new ne;let V=o<<2|c>>4;if(r.push(V),a!==64){let W=c<<4&240|a>>2;if(r.push(W),x!==64){let en=a<<6&192|x;r.push(en)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}},ne=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},nn=function(e){let t=Le(e);return $e.encodeByteArray(t,!0)},re=function(e){return nn(e).replace(/\./g,"")},He=function(e){try{return $e.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};function rn(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}var on=()=>rn().__FIREBASE_DEFAULTS__,sn=()=>{if(typeof process>"u"||typeof process.env>"u")return;let e=process.env.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},an=()=>{if(typeof document>"u")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let t=e&&He(e[1]);return t&&JSON.parse(t)},cn=()=>{try{return Pe()||on()||sn()||an()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}};var ie=()=>cn()?.config;var K=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}wrapCallback(t){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(n):t(n,r))}}};function z(){try{return typeof indexedDB=="object"}catch{return!1}}function q(){return new Promise((e,t)=>{try{let n=!0,r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{t(i.error?.message||"")}}catch(n){t(n)}})}function je(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}var fn="FirebaseError",m=class e extends Error{constructor(t,n,r){super(n),this.code=t,this.customData=r,this.name=fn,Object.setPrototypeOf(this,e.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,w.prototype.create)}},w=class{constructor(t,n,r){this.service=t,this.serviceName=n,this.errors=r}create(t,...n){let r=n[0]||{},i=`${this.service}/${t}`,o=this.errors[t],s=o?un(o,r):"Error",c=`${this.serviceName}: ${s} (${i}).`;return new m(i,c,r)}};function un(e,t){try{let n=0,r="";for(;n<e.length;){let i=e.indexOf("{$",n);if(i===-1){r+=e.substring(n);break}let o=e.indexOf("}",i+2);if(o===-1){r+=e.substring(n);break}let s=e.substring(i+2,o),c=t[s];r+=e.substring(n,i)+(c!=null?String(c):`<${s}?>`),n=o+1}return r}catch{return e}}function G(e,t){if(e===t)return!0;let n=Object.keys(e),r=Object.keys(t);for(let i of n){if(!r.includes(i))return!1;let o=e[i],s=t[i];if(Fe(o)&&Fe(s)){if(!G(o,s))return!1}else if(o!==s)return!1}for(let i of r)if(!n.includes(i))return!1;return!0}function Fe(e){return e!==null&&typeof e=="object"}var eo=14400*1e3;function M(e){return e&&e._delegate?e._delegate:e}var l=class{constructor(t,n,r){this.name=t,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}};var S="[DEFAULT]";var oe=class{constructor(t,n){this.name=t,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){let n=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(n)){let r=new K;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{let i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(t){let n=this.normalizeInstanceIdentifier(t?.identifier),r=t?.optional??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(ln(t))try{this.getOrInitializeService({instanceIdentifier:S})}catch{}for(let[n,r]of this.instancesDeferred.entries()){let i=this.normalizeInstanceIdentifier(n);try{let o=this.getOrInitializeService({instanceIdentifier:i});r.resolve(o)}catch{}}}}clearInstance(t=S){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){let t=Array.from(this.instances.values());await Promise.all([...t.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...t.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=S){return this.instances.has(t)}getOptions(t=S){return this.instancesOptions.get(t)||{}}initialize(t={}){let{options:n={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(let[o,s]of this.instancesDeferred.entries()){let c=this.normalizeInstanceIdentifier(o);r===c&&s.resolve(i)}return i}onInit(t,n){let r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(t),this.onInitCallbacks.set(r,i);let o=this.instances.get(r);return o&&t(o,r),()=>{i.delete(t)}}invokeOnInitCallbacks(t,n){let r=this.onInitCallbacks.get(n);if(r)for(let i of r)try{i(t,n)}catch{}}getOrInitializeService({instanceIdentifier:t,options:n={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:dn(t),options:n}),this.instances.set(t,r),this.instancesOptions.set(t,n),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=S){return this.component?this.component.multipleInstances?t:S:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function dn(e){return e===S?void 0:e}function ln(e){return e.instantiationMode==="EAGER"}var J=class{constructor(t){this.name=t,this.providers=new Map}addComponent(t){let n=this.getProvider(t.name);if(n.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);n.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);let n=new oe(t,this);return this.providers.set(t,n),n}getProviders(){return Array.from(this.providers.values())}};var hn=[],d;(function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"})(d||(d={}));var pn={debug:d.DEBUG,verbose:d.VERBOSE,info:d.INFO,warn:d.WARN,error:d.ERROR,silent:d.SILENT},gn=d.INFO,bn={[d.DEBUG]:"log",[d.VERBOSE]:"log",[d.INFO]:"info",[d.WARN]:"warn",[d.ERROR]:"error"},mn=(e,t,...n)=>{if(t<e.logLevel)return;let r=new Date().toISOString(),i=bn[t];if(i)console[i](`[${r}]  ${e.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)},Y=class{constructor(t){this.name=t,this._logLevel=gn,this._logHandler=mn,this._userLogHandler=null,hn.push(this)}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in d))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?pn[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,d.DEBUG,...t),this._logHandler(this,d.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,d.VERBOSE,...t),this._logHandler(this,d.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,d.INFO,...t),this._logHandler(this,d.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,d.WARN,...t),this._logHandler(this,d.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,d.ERROR,...t),this._logHandler(this,d.ERROR,...t)}};var wn=(e,t)=>t.some(n=>e instanceof n),Ue,Ve;function yn(){return Ue||(Ue=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function _n(){return Ve||(Ve=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var We=new WeakMap,ae=new WeakMap,Ke=new WeakMap,se=new WeakMap,fe=new WeakMap;function En(e){let t=new Promise((n,r)=>{let i=()=>{e.removeEventListener("success",o),e.removeEventListener("error",s)},o=()=>{n(h(e.result)),i()},s=()=>{r(e.error),i()};e.addEventListener("success",o),e.addEventListener("error",s)});return t.then(n=>{n instanceof IDBCursor&&We.set(n,e)}).catch(()=>{}),fe.set(t,e),t}function In(e){if(ae.has(e))return;let t=new Promise((n,r)=>{let i=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",s),e.removeEventListener("abort",s)},o=()=>{n(),i()},s=()=>{r(e.error||new DOMException("AbortError","AbortError")),i()};e.addEventListener("complete",o),e.addEventListener("error",s),e.addEventListener("abort",s)});ae.set(e,t)}var ce={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return ae.get(e);if(t==="objectStoreNames")return e.objectStoreNames||Ke.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return h(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function ze(e){ce=e(ce)}function Sn(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){let r=e.call(X(this),t,...n);return Ke.set(r,t.sort?t.sort():[t]),h(r)}:_n().includes(e)?function(...t){return e.apply(X(this),t),h(We.get(this))}:function(...t){return h(e.apply(X(this),t))}}function vn(e){return typeof e=="function"?Sn(e):(e instanceof IDBTransaction&&In(e),wn(e,yn())?new Proxy(e,ce):e)}function h(e){if(e instanceof IDBRequest)return En(e);if(se.has(e))return se.get(e);let t=vn(e);return t!==e&&(se.set(e,t),fe.set(t,e)),t}var X=e=>fe.get(e);function v(e,t,{blocked:n,upgrade:r,blocking:i,terminated:o}={}){let s=indexedDB.open(e,t),c=h(s);return r&&s.addEventListener("upgradeneeded",f=>{r(h(s.result),f.oldVersion,f.newVersion,h(s.transaction),f)}),n&&s.addEventListener("blocked",f=>n(f.oldVersion,f.newVersion,f)),c.then(f=>{o&&f.addEventListener("close",()=>o()),i&&f.addEventListener("versionchange",a=>i(a.oldVersion,a.newVersion,a))}).catch(()=>{}),c}function B(e,{blocked:t}={}){let n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",r=>t(r.oldVersion,r)),h(n).then(()=>{})}var An=["get","getKey","getAll","getAllKeys","count"],Tn=["put","add","delete","clear"],ue=new Map;function qe(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(ue.get(t))return ue.get(t);let n=t.replace(/FromIndex$/,""),r=t!==n,i=Tn.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||An.includes(n)))return;let o=async function(s,...c){let f=this.transaction(s,i?"readwrite":"readonly"),a=f.store;return r&&(a=a.index(c.shift())),(await Promise.all([a[n](...c),i&&f.done]))[0]};return ue.set(t,o),o}ze(e=>({...e,get:(t,n,r)=>qe(t,n)||e.get(t,n,r),has:(t,n)=>!!qe(t,n)||e.has(t,n)}));var le=class{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Dn(n)){let r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}};function Dn(e){return e.getComponent()?.type==="VERSION"}var he="@firebase/app",Ge="0.16.5";var _=new Y("@firebase/app"),Cn="@firebase/app-compat",kn="@firebase/analytics-compat",On="@firebase/analytics",Rn="@firebase/app-check-compat",Nn="@firebase/app-check",xn="@firebase/auth",Mn="@firebase/auth-compat",Bn="@firebase/crashlytics",Pn="@firebase/database",Fn="@firebase/data-connect",Ln="@firebase/database-compat",$n="@firebase/functions",Hn="@firebase/functions-compat",jn="@firebase/installations",Un="@firebase/installations-compat",Vn="@firebase/messaging",Wn="@firebase/messaging-compat",Kn="@firebase/performance",zn="@firebase/performance-compat",qn="@firebase/remote-config",Gn="@firebase/remote-config-compat",Jn="@firebase/storage",Yn="@firebase/storage-compat",Xn="@firebase/firestore",Qn="@firebase/ai",Zn="@firebase/firestore-compat",er="firebase";var pe="[DEFAULT]",tr={[he]:"fire-core",[Cn]:"fire-core-compat",[On]:"fire-analytics",[kn]:"fire-analytics-compat",[Nn]:"fire-app-check",[Rn]:"fire-app-check-compat",[xn]:"fire-auth",[Mn]:"fire-auth-compat",[Bn]:"fire-cls",[Pn]:"fire-rtdb",[Fn]:"fire-data-connect",[Ln]:"fire-rtdb-compat",[$n]:"fire-fn",[Hn]:"fire-fn-compat",[jn]:"fire-iid",[Un]:"fire-iid-compat",[Vn]:"fire-fcm",[Wn]:"fire-fcm-compat",[Kn]:"fire-perf",[zn]:"fire-perf-compat",[qn]:"fire-rc",[Gn]:"fire-rc-compat",[Jn]:"fire-gcs",[Yn]:"fire-gcs-compat",[Xn]:"fire-fst",[Zn]:"fire-fst-compat",[Qn]:"fire-vertex","fire-js":"fire-js",[er]:"fire-js-all"};var P=new Map,nr=new Map,ge=new Map;function Je(e,t){try{e.container.addComponent(t)}catch(n){_.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function E(e){let t=e.name;if(ge.has(t))return _.debug(`There were multiple attempts to register component ${t}.`),!1;ge.set(t,e);for(let n of P.values())Je(n,e);for(let n of nr.values())Je(n,e);return!0}function L(e,t){let n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}var rr={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},y=new w("app","Firebase",rr);var be=class{constructor(t,n,r){this._isDeleted=!1,this._options={...t},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new l("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw y.create("app-deleted",{appName:this._name})}};function ye(e,t={}){let n=e;typeof t!="object"&&(t={name:t});let r={name:pe,automaticDataCollectionEnabled:!0,...t},i=r.name;if(typeof i!="string"||!i)throw y.create("bad-app-name",{appName:String(i)});if(n||(n=ie()),!n)throw y.create("no-options");let o=P.get(i);if(o)if(G(n,o.options)){if(G(r,o.config))return o;throw y.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(o.config),newValue:JSON.stringify(r)})}else throw y.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(o.options),newValue:JSON.stringify(n)});let s=new J(i);for(let f of ge.values())s.addComponent(f);let c=new be(n,r,s);return P.set(i,c),c}function _e(e=pe){let t=P.get(e);if(!t&&e===pe&&ie())return ye();if(!t)throw y.create("no-app",{appName:e});return t}function Ze(){return Array.from(P.values())}function p(e,t,n){let r=tr[e]??e;n&&(r+=`-${n}`);let i=r.match(/\s|\//),o=t.match(/\s|\//);if(i||o){let s=[`Unable to register library "${r}" with version "${t}":`];i&&s.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&o&&s.push("and"),o&&s.push(`version name "${t}" contains illegal characters (whitespace or "/")`),_.warn(s.join(" "));return}E(new l(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}var ir="firebase-heartbeat-database",or=1,F="firebase-heartbeat-store",de=null;function et(){return de||(de=v(ir,or,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(F)}catch(n){console.warn(n)}}}}).catch(e=>{throw y.create("idb-open",{originalErrorMessage:e.message})})),de}async function sr(e){try{let n=(await et()).transaction(F),r=await n.objectStore(F).get(tt(e));return await n.done,r}catch(t){if(t instanceof m)_.warn(t.message);else{let n=y.create("idb-get",{originalErrorMessage:t?.message});_.warn(n.message)}}}async function Ye(e,t){try{let r=(await et()).transaction(F,"readwrite");await r.objectStore(F).put(t,tt(e)),await r.done}catch(n){if(n instanceof m)_.warn(n.message);else{let r=y.create("idb-set",{originalErrorMessage:n?.message});_.warn(r.message)}}}function tt(e){return`${e.name}!${e.options.appId}`}var ar=1024,cr=30,me=class{constructor(t){this.container=t,this._heartbeatsCache=null;let n=this.container.getProvider("app").getImmediate();this._storage=new we(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){try{let n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Xe();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(i=>i.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:n}),this._heartbeatsCache.heartbeats.length>cr){let i=ur(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(i,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(t){_.warn(t)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";let t=Xe(),{heartbeatsToSend:n,unsentEntries:r}=fr(this._heartbeatsCache.heartbeats),i=re(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return _.warn(t),""}}};function Xe(){return new Date().toISOString().substring(0,10)}function fr(e,t=ar){let n=[],r=e.slice();for(let i of e){let o=n.find(s=>s.agent===i.agent);if(o){if(o.dates.push(i.date),Qe(n)>t){o.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Qe(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}var we=class{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return z()?q().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let n=await sr(this.app);return n?.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){let r=await this.read();return Ye(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){let r=await this.read();return Ye(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...t.heartbeats]})}else return}};function Qe(e){return re(JSON.stringify({version:2,heartbeats:e})).length}function ur(e){if(e.length===0)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}function dr(e){E(new l("platform-logger",t=>new le(t),"PRIVATE")),E(new l("heartbeat",t=>new me(t),"PRIVATE")),p(he,Ge,e),p(he,Ge,"esm2020"),p("fire-js","")}dr("");var lr="firebase",hr="13.2.0";p(lr,hr,"app");var it="@firebase/installations",ve="0.6.24";var ot=1e4,st=`w:${ve}`,at="FIS_v2",pr="https://firebaseinstallations.googleapis.com/v1",gr=3600*1e3,br="installations",mr="Installations";var wr={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},T=new w(br,mr,wr);function ct(e){return e instanceof m&&e.code.includes("request-failed")}function ft({projectId:e}){return`${pr}/projects/${e}/installations`}function ut(e){return{token:e.token,requestStatus:2,expiresIn:_r(e.expiresIn),creationTime:Date.now()}}async function dt(e,t){let r=(await t.json()).error;return T.create("request-failed",{requestName:e,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function lt({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function yr(e,{refreshToken:t}){let n=lt(e);return n.append("Authorization",Er(t)),n}async function ht(e){let t=await e();return t.status>=500&&t.status<600?e():t}function _r(e){return Number(e.replace("s","000"))}function Er(e){return`${at} ${e}`}async function Ir({appConfig:e,heartbeatServiceProvider:t},{fid:n}){let r=ft(e),i=lt(e),o=t.getImmediate({optional:!0});if(o){let a=await o.getHeartbeatsHeader();a&&i.append("x-firebase-client",a)}let s={fid:n,authVersion:at,appId:e.appId,sdkVersion:st},c={method:"POST",headers:i,body:JSON.stringify(s)},f=await ht(()=>fetch(r,c));if(f.ok){let a=await f.json();return{fid:a.fid||n,registrationStatus:2,refreshToken:a.refreshToken,authToken:ut(a.authToken)}}else throw await dt("Create Installation",f)}function pt(e){return new Promise(t=>{setTimeout(t,e)})}function Sr(e){return btoa(String.fromCharCode(...e)).replace(/\+/g,"-").replace(/\//g,"_")}var vr=/^[cdef][\w-]{21}$/,Se="";function Ar(){try{let e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;let n=Tr(e);return vr.test(n)?n:Se}catch{return Se}}function Tr(e){return Sr(e).substr(0,22)}function k(e){return`${e.appName}!${e.appId}`}var C=new Map;function gt(e,t){let n=k(e);bt(n,t),kr(n,t)}function Dr(e,t){mt();let n=k(e),r=C.get(n);r||(r=new Set,C.set(n,r)),r.add(t)}function Cr(e,t){let n=k(e),r=C.get(n);r&&(r.delete(t),r.size===0&&C.delete(n),wt())}function bt(e,t){let n=C.get(e);if(n)for(let r of n)r(t)}function kr(e,t){let n=mt();n&&n.postMessage({key:e,fid:t}),wt()}var A=null;function mt(){return!A&&"BroadcastChannel"in self&&(A=new BroadcastChannel("[Firebase] FID Change"),A.onmessage=e=>{bt(e.data.key,e.data.fid)}),A}function wt(){C.size===0&&A&&(A.close(),A=null)}var Or="firebase-installations-database",Rr=1,D="firebase-installations-store",Ee=null;function Ae(){return Ee||(Ee=v(Or,Rr,{upgrade:(e,t)=>{t===0&&e.createObjectStore(D)}})),Ee}async function Q(e,t){let n=k(e),i=(await Ae()).transaction(D,"readwrite"),o=i.objectStore(D),s=await o.get(n);return await o.put(t,n),await i.done,(!s||s.fid!==t.fid)&&gt(e,t.fid),t}async function yt(e){let t=k(e),r=(await Ae()).transaction(D,"readwrite");await r.objectStore(D).delete(t),await r.done}async function Z(e,t){let n=k(e),i=(await Ae()).transaction(D,"readwrite"),o=i.objectStore(D),s=await o.get(n),c=t(s);return c===void 0?await o.delete(n):await o.put(c,n),await i.done,c&&(!s||s.fid!==c.fid)&&gt(e,c.fid),c}async function Te(e){let t,n=await Z(e.appConfig,r=>{let i=Nr(r),o=xr(e,i);return t=o.registrationPromise,o.installationEntry});return n.fid===Se?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}function Nr(e){let t=e||{fid:Ar(),registrationStatus:0};return _t(t)}function xr(e,t){if(t.registrationStatus===0){if(!navigator.onLine){let i=Promise.reject(T.create("app-offline"));return{installationEntry:t,registrationPromise:i}}let n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},r=Mr(e,n);return{installationEntry:n,registrationPromise:r}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:Br(e)}:{installationEntry:t}}async function Mr(e,t){try{let n=await Ir(e,t);return Q(e.appConfig,n)}catch(n){throw ct(n)&&n.customData.serverCode===409?await yt(e.appConfig):await Q(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function Br(e){let t=await nt(e.appConfig);for(;t.registrationStatus===1;)await pt(100),t=await nt(e.appConfig);if(t.registrationStatus===0){let{installationEntry:n,registrationPromise:r}=await Te(e);return r||n}return t}function nt(e){return Z(e,t=>{if(!t)throw T.create("installation-not-found");return _t(t)})}function _t(e){return Pr(e)?{fid:e.fid,registrationStatus:0}:e}function Pr(e){return e.registrationStatus===1&&e.registrationTime+ot<Date.now()}async function Fr({appConfig:e,heartbeatServiceProvider:t},n){let r=Lr(e,n),i=yr(e,n),o=t.getImmediate({optional:!0});if(o){let a=await o.getHeartbeatsHeader();a&&i.append("x-firebase-client",a)}let s={installation:{sdkVersion:st,appId:e.appId}},c={method:"POST",headers:i,body:JSON.stringify(s)},f=await ht(()=>fetch(r,c));if(f.ok){let a=await f.json();return ut(a)}else throw await dt("Generate Auth Token",f)}function Lr(e,{fid:t}){return`${ft(e)}/${t}/authTokens:generate`}async function De(e,t=!1){let n,r=await Z(e.appConfig,o=>{if(!Et(o))throw T.create("not-registered");let s=o.authToken;if(!t&&jr(s))return o;if(s.requestStatus===1)return n=$r(e,t),o;{if(!navigator.onLine)throw T.create("app-offline");let c=Vr(o);return n=Hr(e,c),c}});return n?await n:r.authToken}async function $r(e,t){let n=await rt(e.appConfig);for(;n.authToken.requestStatus===1;)await pt(100),n=await rt(e.appConfig);let r=n.authToken;return r.requestStatus===0?De(e,t):r}function rt(e){return Z(e,t=>{if(!Et(t))throw T.create("not-registered");let n=t.authToken;return Wr(n)?{...t,authToken:{requestStatus:0}}:t})}async function Hr(e,t){try{let n=await Fr(e,t),r={...t,authToken:n};return await Q(e.appConfig,r),n}catch(n){if(ct(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await yt(e.appConfig);else{let r={...t,authToken:{requestStatus:0}};await Q(e.appConfig,r)}throw n}}function Et(e){return e!==void 0&&e.registrationStatus===2}function jr(e){return e.requestStatus===2&&!Ur(e)}function Ur(e){let t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+gr}function Vr(e){let t={requestStatus:1,requestTime:Date.now()};return{...e,authToken:t}}function Wr(e){return e.requestStatus===1&&e.requestTime+ot<Date.now()}async function Kr(e){let t=e,{installationEntry:n,registrationPromise:r}=await Te(t);return r?r.catch(console.error):De(t).catch(console.error),n.fid}async function zr(e,t=!1){let n=e;return await qr(n),(await De(n,t)).token}async function qr(e){let{registrationPromise:t}=await Te(e);t&&await t}function It(e,t){let{appConfig:n}=e;return Dr(n,t),()=>{Cr(n,t)}}function Gr(e){if(!e||!e.options)throw Ie("App Configuration");if(!e.name)throw Ie("App Name");let t=["projectId","apiKey","appId"];for(let n of t)if(!e.options[n])throw Ie(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}function Ie(e){return T.create("missing-app-config-values",{valueName:e})}var St="installations",Jr="installations-internal",Yr=e=>{let t=e.getProvider("app").getImmediate(),n=Gr(t),r=L(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},Xr=e=>{let t=e.getProvider("app").getImmediate(),n=L(t,St).getImmediate();return{getId:()=>Kr(n),getToken:i=>zr(n,i)}};function Qr(){E(new l(St,Yr,"PUBLIC")),E(new l(Jr,Xr,"PRIVATE"))}Qr();p(it,ve);p(it,ve,"esm2020");var Zr="/firebase-messaging-sw.js",ei="/firebase-cloud-messaging-push-scope",Pt="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",ti="https://fcmregistrations.googleapis.com/v1",Ft="google.c.a.c_id",ni="google.c.a.c_l",ri="google.c.a.ts",ii="google.c.a.e",vt=1e4,At;(function(e){e[e.DATA_MESSAGE=1]="DATA_MESSAGE",e[e.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(At||(At={}));var O;(function(e){e.PUSH_RECEIVED="push-received",e.NOTIFICATION_CLICKED="notification-clicked",e.FID_REGISTERED="fid-registered"})(O||(O={}));function g(e){let t=new Uint8Array(e);return btoa(String.fromCharCode(...t)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function Lt(e){let t="=".repeat((4-e.length%4)%4),n=(e+t).replace(/\-/g,"+").replace(/_/g,"/"),r=atob(n),i=new Uint8Array(r.length);for(let o=0;o<r.length;++o)i[o]=r.charCodeAt(o);return i}var Ce="fcm_token_details_db",oi=5,Tt="fcm_token_object_Store";async function si(e){if("databases"in indexedDB&&!(await indexedDB.databases()).map(o=>o.name).includes(Ce))return null;let t=null;return(await v(Ce,oi,{upgrade:async(r,i,o,s)=>{if(i<2||!r.objectStoreNames.contains(Tt))return;let c=s.objectStore(Tt),f=await c.index("fcmSenderId").get(e);if(await c.clear(),!!f){if(i===2){let a=f;if(!a.auth||!a.p256dh||!a.endpoint)return;t={token:a.fcmToken,createTime:a.createTime??Date.now(),subscriptionOptions:{auth:a.auth,p256dh:a.p256dh,endpoint:a.endpoint,swScope:a.swScope,vapidKey:typeof a.vapidKey=="string"?a.vapidKey:g(a.vapidKey)}}}else if(i===3){let a=f;t={token:a.fcmToken,createTime:a.createTime,subscriptionOptions:{auth:g(a.auth),p256dh:g(a.p256dh),endpoint:a.endpoint,swScope:a.swScope,vapidKey:g(a.vapidKey)}}}else if(i===4){let a=f;t={token:a.fcmToken,createTime:a.createTime,subscriptionOptions:{auth:g(a.auth),p256dh:g(a.p256dh),endpoint:a.endpoint,swScope:a.swScope,vapidKey:g(a.vapidKey)}}}}}})).close(),await B(Ce),await B("fcm_vapid_details_db"),await B("undefined"),ai(t)?t:null}function ai(e){if(!e||!e.subscriptionOptions)return!1;let{subscriptionOptions:t}=e;return typeof e.createTime=="number"&&e.createTime>0&&typeof e.token=="string"&&e.token.length>0&&typeof t.auth=="string"&&t.auth.length>0&&typeof t.p256dh=="string"&&t.p256dh.length>0&&typeof t.endpoint=="string"&&t.endpoint.length>0&&typeof t.swScope=="string"&&t.swScope.length>0&&typeof t.vapidKey=="string"&&t.vapidKey.length>0}var ci={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","fid-registration-failed":"A problem occurred while creating an FCM registration via FID: {$errorInfo}","fid-unregister-failed":"A problem occurred while unregistering the FCM registration via FID: {$errorInfo}","fid-registration-idb-schema-unavailable":"Unable to read or persist FID registration metadata because the messaging IndexedDB schema is unavailable (for example, the database could not be upgraded to the latest version).","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used.","invalid-on-registered-handler":"No onRegistered callback handler was provided or registered. Implement onRegistered() before register()."},u=new w("messaging","Messaging",ci);var Dt="firebase-messaging-database",Ct=2,I="firebase-messaging-store",b="firebase-messaging-fid-registration-store",fi={openDB:v,deleteDB:B},kt=fi,$=null;function ui(e,t,n){switch(t){case 0:if(e.createObjectStore(I),n===1)break;case 1:n===2&&e.createObjectStore(b)}}function Ot(e){return{upgrade:(t,n)=>{ui(t,n,e)},blocked:()=>{},blocking:(t,n,r)=>{$=null,r.target?.close()},terminated:()=>{$=null}}}function R(){return $||($=kt.openDB(Dt,Ct,Ot(2)).catch(()=>kt.openDB(Dt,Ct-1,Ot(1)))),$}function $t(e,t){return e.objectStoreNames.contains(t)}function Ne(e){if(!$t(e,b))throw u.create("fid-registration-idb-schema-unavailable")}async function Ht(e){let t=N(e),r=await(await R()).transaction(I).objectStore(I).get(t);if(r)return r;{let i=await si(e.appConfig.senderId);if(i)return await xe(e,i),i}}async function xe(e,t){let n=N(e),r=await R(),i=[I],o=$t(r,b);o&&i.push(b);let s=r.transaction(i,"readwrite");return await s.objectStore(I).put(t,n),o&&await s.objectStore(b).delete(n),await s.done,t}async function di(e){let t=N(e),r=(await R()).transaction(I,"readwrite");await r.objectStore(I).delete(t),await r.done}async function Me(e){let t=N(e),n=await R();return Ne(n),await n.transaction(b).objectStore(b).get(t)}async function li(e,t){let n=N(e),r=await R();Ne(r);let i=r.transaction([I,b],"readwrite");return await i.objectStore(b).put(t,n),await i.objectStore(I).delete(n),await i.done,t}async function hi(e){let t=N(e),n=await R();Ne(n);let r=n.transaction(b,"readwrite");await r.objectStore(b).delete(t),await r.done}function N({appConfig:e}){return e.appId}var Rt="@firebase/messaging",Oe="0.13.3";var pi=3,gi=1e3;async function bi(e,t){let n=await j(e),r=Be(t,e.appConfig.appName,!1),i={method:"POST",headers:n,body:JSON.stringify(r)},o;try{o=await(await fetch(H(e.appConfig),i)).json()}catch(s){throw u.create("token-subscribe-failed",{errorInfo:s?.toString()})}if(o.error){let s=o.error.message;throw u.create("token-subscribe-failed",{errorInfo:s})}if(!o.token)throw u.create("token-subscribe-no-token");return o.token}async function mi(e,t){let n=await j(e),r=Be(t,e.appConfig.appName,!0),i={method:"POST",headers:n,body:JSON.stringify(r)},o;try{o=await Ii(()=>fetch(H(e.appConfig),i),pi,gi)}catch(f){throw u.create("fid-registration-failed",{errorInfo:f?.toString()})}if(o.ok)return{responseFid:await yi(o)};let s;try{s=await o.json()}catch{throw u.create("fid-registration-failed",{errorInfo:o.statusText})}let c=s.error?.message??o.statusText;throw u.create("fid-registration-failed",{errorInfo:c})}async function wi(e,t){let r={method:"DELETE",headers:await j(e)},i;try{i=await fetch(`${H(e.appConfig)}/${t}`,r)}catch(o){throw u.create("fid-unregister-failed",{errorInfo:o?.toString()})}if(!i.ok)try{throw(await i.json()).error?.message??i.statusText}catch(o){throw u.create("fid-unregister-failed",{errorInfo:typeof o=="string"&&o||i.statusText||o?.toString()})}}async function yi(e){let t=await e.text();if(!t.trim())throw u.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response body is empty"});let n;try{n=JSON.parse(t)}catch{throw u.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response body is not valid JSON"})}let r=n.name;if(typeof r!="string"||r.length===0)throw u.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response did not include a non-empty name"});return _i(r)}var Nt="/registrations/";function _i(e){let t=e.indexOf(Nt);if(t!==-1){let n=e.slice(t+Nt.length);if(n.length>0)return n}throw u.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response name is not a valid registration resource name"})}async function Ei(e,t){let n=await j(e),r=Be(t.subscriptionOptions,e.appConfig.appName,!1),i={method:"PATCH",headers:n,body:JSON.stringify(r)},o;try{o=await(await fetch(`${H(e.appConfig)}/${t.token}`,i)).json()}catch(s){throw u.create("token-update-failed",{errorInfo:s?.toString()})}if(o.error){let s=o.error.message;throw u.create("token-update-failed",{errorInfo:s})}if(!o.token)throw u.create("token-update-no-token");return o.token}async function jt(e,t){let r={method:"DELETE",headers:await j(e)};try{let o=await(await fetch(`${H(e.appConfig)}/${t}`,r)).json();if(o.error){let s=o.error.message;throw u.create("token-unsubscribe-failed",{errorInfo:s})}}catch(i){throw u.create("token-unsubscribe-failed",{errorInfo:i?.toString()})}}async function Ii(e,t,n){let r;for(let i=0;i<t;i++)try{return await e()}catch(o){if(r=o,i<t-1){let s=n*Math.pow(2,i);await new Promise(c=>setTimeout(c,s))}}throw r}function H({projectId:e}){return`${ti}/projects/${e}/registrations`}async function j({appConfig:e,installations:t}){let n=await t.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e.apiKey,"x-goog-firebase-installations-auth":`FIS ${n}`})}function Si(e,t){try{if(/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(e))return new URL(e).host}catch{}try{if(typeof self<"u"&&self.location?.href)return new URL(e,self.location.origin).host}catch{}return typeof self<"u"&&self.location?.host?self.location.host:t}function Be({p256dh:e,auth:t,endpoint:n,vapidKey:r,swScope:i},o,s){let c={web:{origin:Si(i,o),endpoint:n,auth:t,p256dh:e}};return s&&(c.fcm_sdk_version=Oe),r!==Pt&&(c.web.applicationPubKey=r),c}var vi=10080*60*1e3;async function Ai(e){let t=await Oi(e.swRegistration,e.vapidKey),n={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:t.endpoint,auth:g(t.getKey("auth")),p256dh:g(t.getKey("p256dh"))},r=await Ht(e.firebaseDependencies);if(r){if(Ri(r.subscriptionOptions,n))return Date.now()>=r.createTime+vi?ki(e,{token:r.token,createTime:Date.now(),subscriptionOptions:n}):r.token;try{await jt(e.firebaseDependencies,r.token)}catch(i){console.warn(i)}return xt(e.firebaseDependencies,n)}else return xt(e.firebaseDependencies,n)}async function Ti(e,t){await jt(e.firebaseDependencies,t.token),await di(e.firebaseDependencies),await Ut(e.firebaseDependencies)}async function Di(e){let n=(await Me(e.firebaseDependencies).catch(()=>{}))?.fid;n&&await wi(e.firebaseDependencies,n),await Ut(e.firebaseDependencies),n&&xi(e,n)}async function Ci(e){let t=await Ht(e.firebaseDependencies);t?await Ti(e,t):await Di(e);let n=await e.swRegistration.pushManager.getSubscription();return n?n.unsubscribe():!0}async function ki(e,t){try{let n=await Ei(e.firebaseDependencies,t),r={...t,token:n,createTime:Date.now()};return await xe(e.firebaseDependencies,r),n}catch(n){throw n}}async function xt(e,t){let r={token:await bi(e,t),createTime:Date.now(),subscriptionOptions:t};return await xe(e,r),r.token}async function Oi(e,t){let n=await e.pushManager.getSubscription();return n||e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Lt(t)})}function Ri(e,t){let n=t.vapidKey===e.vapidKey,r=t.endpoint===e.endpoint,i=t.auth===e.auth,o=t.p256dh===e.p256dh;return n&&r&&i&&o}async function Ut(e){try{await hi(e)}catch{}}function Ni(e,t){let n=e.onRegisteredHandler;n&&(typeof n=="function"?n(t):n.next(t))}function xi(e,t){let n=e.onUnregisteredHandler;n&&(typeof n=="function"?n(t):n.next(t))}async function Vt(e){try{e.swRegistration=await navigator.serviceWorker.register(Zr,{scope:ei}),e.swRegistration.update().catch(()=>{}),await Mi(e.swRegistration)}catch(t){throw u.create("failed-service-worker-registration",{browserErrorMessage:t?.message})}}async function Mi(e){return new Promise((t,n)=>{let r=setTimeout(()=>n(new Error(`Service worker not registered after ${vt} ms`)),vt),i=e.installing||e.waiting;e.active?(clearTimeout(r),t()):i?i.onstatechange=o=>{o.target?.state==="activated"&&(i.onstatechange=null,clearTimeout(r),t())}:(clearTimeout(r),n(new Error("No incoming service worker found.")))})}async function Wt(e,t){if(!t&&!e.swRegistration&&await Vt(e),!(!t&&e.swRegistration)){if(!(t instanceof ServiceWorkerRegistration))throw u.create("invalid-sw-registration");e.swRegistration=t}}async function Kt(e,t){t?e.vapidKey=t:e.vapidKey||(e.vapidKey=Pt)}var Mt=3;async function Bi(e,t){let n=await Pi(e.swRegistration,e.vapidKey),r={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:n.endpoint,auth:g(n.getKey("auth")),p256dh:g(n.getKey("p256dh"))},i=e.firebaseDependencies.installations;for(let o=0;o<Mt;o++){let{responseFid:s}=await mi(e.firebaseDependencies,r);if(s===t)return;o<Mt-1&&await i.getToken(!0)}throw u.create("fid-registration-failed",{errorInfo:"CreateRegistration response FID does not match Firebase Installation ID"})}async function Pi(e,t){let n=await e.pushManager.getSubscription();return n||e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Lt(t)})}var Fi=10080*60*1e3;async function zt(e,t){if(!navigator)throw u.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw u.create("permission-blocked");if(!e.onRegisteredHandler)throw u.create("invalid-on-registered-handler");await Kt(e,t?.vapidKey),await Wt(e,t?.serviceWorkerRegistration);let n=e._registerNotifyChain.catch(()=>{});return e._registerNotifyChain=n.then(async()=>{let r=await e.firebaseDependencies.installations.getId(),i=await Me(e.firebaseDependencies),o=Date.now();if((!i||i.fid!==r||o>=i.lastRegisterTime+Fi)&&(await Bi(e,r),await li(e.firebaseDependencies,{fid:r,lastRegisterTime:o,vapidKey:e.vapidKey})),!e.onRegisteredHandler)throw u.create("invalid-on-registered-handler");Ni(e,r)}),e._registerNotifyChain}function Li(e,t){return It(t,()=>{(async()=>!e.onRegisteredHandler||!await Me(e.firebaseDependencies)||await zt(e).catch(()=>{}))()})}function Bt(e){let t={from:e.from,collapseKey:e.collapse_key,messageId:e.fcmMessageId};return $i(t,e),Hi(t,e),ji(t,e),t}function $i(e,t){if(!t.notification)return;e.notification={};let n=t.notification.title;n&&(e.notification.title=n);let r=t.notification.body;r&&(e.notification.body=r);let i=t.notification.image;i&&(e.notification.image=i);let o=t.notification.icon;o&&(e.notification.icon=o)}function Hi(e,t){t.data&&(e.data=t.data)}function ji(e,t){if(!t.fcmOptions&&!t.notification?.click_action)return;e.fcmOptions={};let n=t.fcmOptions?.link??t.notification?.click_action;n&&(e.fcmOptions.link=n);let r=t.fcmOptions?.analytics_label;r&&(e.fcmOptions.analyticsLabel=r)}function Ui(e){return typeof e=="object"&&!!e&&Ft in e}function Vi(e){if(!e||!e.options)throw ke("App Configuration Object");if(!e.name)throw ke("App Name");let t=["projectId","apiKey","appId","messagingSenderId"],{options:n}=e;for(let r of t)if(!n[r])throw ke(r);return{appName:e.name,projectId:n.projectId,apiKey:n.apiKey,appId:n.appId,senderId:n.messagingSenderId}}function ke(e){return u.create("missing-app-config-values",{valueName:e})}var Re=class{constructor(t,n,r){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.onRegisteredHandler=null,this.onUnregisteredHandler=null,this._registerNotifyChain=Promise.resolve(),this._fidChangeUnsubscribe=null,this.logEvents=[],this.logQueue={state:"stopped"};let i=Vi(t);this.firebaseDependencies={app:t,appConfig:i,installations:n,analyticsProvider:r}}_delete(){return this._fidChangeUnsubscribe&&(this._fidChangeUnsubscribe(),this._fidChangeUnsubscribe=null),this.logQueue.state==="scheduled"&&clearTimeout(this.logQueue.timerId),this.logQueue={state:"stopped"},Promise.resolve()}};async function qt(e,t){if(!navigator)throw u.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw u.create("permission-blocked");return await Kt(e,t?.vapidKey),await Wt(e,t?.serviceWorkerRegistration),Ai(e)}async function Wi(e,t,n){let r=Ki(t);(await e.firebaseDependencies.analyticsProvider.get()).logEvent(r,{message_id:n[Ft],message_name:n[ni],message_time:n[ri],message_device_time:Math.floor(Date.now()/1e3)})}function Ki(e){switch(e){case O.NOTIFICATION_CLICKED:return"notification_open";case O.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}async function zi(e,t){let n=t.data;if(!n.isFirebaseMessaging)return;if(e.onMessageHandler&&n.messageType===O.PUSH_RECEIVED&&(typeof e.onMessageHandler=="function"?e.onMessageHandler(Bt(n)):e.onMessageHandler.next(Bt(n))),e.onRegisteredHandler&&n.messageType===O.FID_REGISTERED){let i=n.fid;typeof e.onRegisteredHandler=="function"?e.onRegisteredHandler(i):e.onRegisteredHandler.next(i)}let r=n.data;Ui(r)&&r[ii]==="1"&&await Wi(e,n.messageType,r)}var qi=e=>{let t=new Re(e.getProvider("app").getImmediate(),e.getProvider("installations-internal").getImmediate(),e.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",n=>zi(t,n)),t._fidChangeUnsubscribe=Li(t,e.getProvider("installations").getImmediate()),t},Gi=e=>{let t=e.getProvider("messaging").getImmediate();return{getToken:r=>qt(t,r),register:r=>zt(t,r)}};function Ji(){E(new l("messaging",qi,"PUBLIC")),E(new l("messaging-internal",Gi,"PRIVATE")),p(Rt,Oe),p(Rt,Oe,"esm2020")}async function ee(){try{await q()}catch{return!1}return typeof window<"u"&&z()&&je()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}async function Yi(e){if(!navigator)throw u.create("only-available-in-window");return e.swRegistration||await Vt(e),Ci(e)}function Xi(e,t){if(!navigator)throw u.create("only-available-in-window");return e.onMessageHandler=t,()=>{e.onMessageHandler=null}}function Gt(e=_e()){return ee().then(t=>{if(!t)throw u.create("unsupported-browser")},t=>{throw u.create("indexed-db-unsupported")}),L(M(e),"messaging").getImmediate()}async function Jt(e,t){return e=M(e),qt(e,t)}function Yt(e){return e=M(e),Yi(e)}function Xt(e,t){return e=M(e),Xi(e,t)}Ji();var te;function Zt(e){let t=Ze().find(n=>n.name==="finance-push")||ye(e,"finance-push");return Gt(t)}async function Qt(e,t){if(!await ee())throw Error("\u10D0\u10DB \u10D1\u10E0\u10D0\u10E3\u10D6\u10D4\u10E0\u10E1 Push \u10E8\u10D4\u10E2\u10E7\u10DD\u10D1\u10D8\u10DC\u10D4\u10D1\u10D4\u10D1\u10D8\u10E1 \u10DB\u10EE\u10D0\u10E0\u10D3\u10D0\u10ED\u10D4\u10E0\u10D0 \u10D0\u10E0 \u10D0\u10E5\u10D5\u10E1.");let n=Zt(e);return te||(te=Xt(n,async r=>{let i=r.data||{};await t.showNotification(i.title||"Finance",{body:i.body||"\u10D2\u10D0\u10D3\u10D0\u10D0\u10DB\u10DD\u10EC\u10DB\u10D4 \u10D2\u10D0\u10D3\u10D0\u10E1\u10D0\u10EE\u10D0\u10D3\u10D4\u10D1\u10D8 \u10D0\u10DE\u10E8\u10D8.",tag:i.tag||"finance-reminder",icon:new URL("icon-192.png",t.scope).href,data:{url:t.scope}})})),n}globalThis.FinancePush={listen:Qt,async connect(e,t,n){let r=await Qt(e,n);return Jt(r,{vapidKey:t,serviceWorkerRegistration:n})},async disconnect(e){e&&await ee()&&await Yt(Zt(e)),te?.(),te=null}};})();
/*! Bundled license information:

@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/logger/dist/esm/index.esm.js:
@firebase/messaging/dist/esm/index.esm.js:
@firebase/messaging/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/component/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/installations/dist/esm/index.esm.js:
@firebase/installations/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/installations/dist/esm/index.esm.js:
@firebase/installations/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
   * in compliance with the License. You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under the License
   * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
   * or implied. See the License for the specific language governing permissions and limitations under
   * the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2026 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.esm.js:
@firebase/messaging/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2026 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
