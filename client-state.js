"use strict";
(()=>{
const prefix="marxia-smb.";
const legacy={language:"marxia-language",theme:"marxia-theme",brand:"marxia-smb-brand",parties:"marxia-party-records","cli-sequence":"marxia-cli-sequence","pro-sequence":"marxia-pro-sequence"};
const parse=(value,fallback)=>{try{return value===null?fallback:JSON.parse(value)}catch{return fallback}};
const key=name=>prefix+name;
const get=(name,fallback=null)=>{
 try{
  const current=localStorage.getItem(key(name));
  if(current!==null)return parse(current,fallback);
  const old=legacy[name]&&localStorage.getItem(legacy[name]);
  return old===null||old===undefined?fallback:parse(old,old);
 }catch{return fallback}
};
const set=(name,value)=>{
 try{
  localStorage.setItem(key(name),JSON.stringify(value));
  if(legacy[name])localStorage.setItem(legacy[name],typeof value==="string"?value:JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("marxia:state",{detail:{name,value}}));
  return true;
 }catch{return false}
};
const remove=name=>{try{localStorage.removeItem(key(name));if(legacy[name])localStorage.removeItem(legacy[name]);return true}catch{return false}};
const validChoice=(name,allowed,fallback)=>{const value=get(name,fallback);return allowed.includes(value)?value:fallback};
window.addEventListener("storage",event=>{
 if(!event.key?.startsWith(prefix))return;
 const name=event.key.slice(prefix.length);
 window.dispatchEvent(new CustomEvent("marxia:state",{detail:{name,value:parse(event.newValue,null),external:true}}));
});
window.MarxiaUIState=Object.freeze({get,set,remove,validChoice,key});
})();