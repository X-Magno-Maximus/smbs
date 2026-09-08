// Shared staff directory: proposals and activity never authorize access.
(function(){
 const directory=document.getElementById('staffDirectory');
 const search=document.getElementById('staffDirectorySearch');
 const empty=document.getElementById('staffDirectoryEmpty');
 const messages=document.getElementById('staffRequestStatus');
 const scopes=['Orders','Products','Inventory','Accounting','Logistics','Reports','Marketplace','Overview'];
 const actions=['Read','Write','Approve','Audit'];
 // Keep the existing staff objects as the source for employee identity and job.
 const people=existingEmployees.map(person=>({id:person.id,person}));
 const drafts=new Map();
 function element(tag,text,className){
   const node=document.createElement(tag);
   if(text!==undefined)node.textContent=text;
   if(className)node.className=className;
   return node;
 }
 function translated(){window.MarxiaI18n?.apply(document.documentElement.lang);}
 people.forEach(({id,person})=>{
   const row=element('article',undefined,'staff-record');
   row.dataset.staffId=id;
   row.id='staff-'+id;
   const header=element('header');
   header.append(element('h3',person.firstName+' '+person.lastName),element('p',person.email),element('p',person.position),element('p',person.job));
   row.append(header);
   const columns=element('div',undefined,'staff-columns');
   const permissions=element('section',undefined,'staff-permissions');
   permissions.append(element('h4','Roles & Access Permissions'),element('p','Sample assigned permissions'));
   const draft={enabled:person.active,permissions:{},prepared:false};
   drafts.set(id,draft);
   const editor=element('details',undefined,'staff-permission-editor');
   editor.append(element('summary','Prepare permission changes'));
   const master=element('label','Proposed application access ');
   const toggle=element('input');toggle.type='checkbox';toggle.checked=draft.enabled;
   toggle.setAttribute('aria-label',person.firstName+' '+person.lastName+' — Proposed application access');
   master.append(toggle);editor.append(master);
   const grid=element('div',undefined,'staff-permission-grid');
   scopes.forEach(scope=>{
     const field=element('fieldset');field.append(element('legend',scope));
     draft.permissions[scope]={};
     actions.forEach(action=>{
       const label=element('label',action+' ');
       const input=element('input');input.type='checkbox';input.disabled=!draft.enabled;input.checked=(person.permissions[scope]||[]).includes(action);
       input.setAttribute('aria-label',person.firstName+' '+person.lastName+' — '+scope+' — '+action);
       draft.permissions[scope][action]=input.checked;
       input.addEventListener('change',()=>{draft.permissions[scope][action]=input.checked;draft.prepared=false;status.textContent='Draft changed — not submitted';translated();});
       label.append(input);field.append(label);
     });grid.append(field);
   });
   editor.append(grid);
   toggle.addEventListener('change',()=>{
     draft.enabled=toggle.checked;draft.prepared=false;
     grid.querySelectorAll('input').forEach(input=>input.disabled=!draft.enabled);
     status.textContent='Draft changed — not submitted';translated();
   });
   const prepare=element('button','Prepare owner review');prepare.type='button';
   const status=element('p','No permission changes prepared');status.setAttribute('role','status');
   prepare.addEventListener('click',()=>{
     draft.prepared=true;
     status.textContent='Owner-review draft prepared — not submitted';
     messages.textContent='No access changed. Owner verification, approval delivery, and audit recording are not connected.';
     translated();
   });
   editor.append(prepare,status);permissions.append(editor);
   const mirror=element('p','No permission changes prepared','staff-permission-reference');
   permissions.append(mirror);
   const activity=element('section',undefined,'staff-activity');
   activity.append(element('h4','End-User Access / Activity'));
   const facts=element('dl');
   Object.entries({'Last login date / time / timezone':person.activity.lastLogin,'Branch':person.activity.branch,'Device / browser':person.activity.device,'Approximate location':person.activity.location,'Session status':person.activity.session}).forEach(([label,value])=>{
     const item=element('div');item.append(element('dt',label),element('dd',value||'No sample login'));facts.append(item);
   });
   activity.append(facts,element('p','Location is approximate. Activity is read-only.'));
   columns.append(permissions,activity);row.append(columns);directory.append(row);
   row.updateReference=()=>{
     mirror.replaceChildren(element('span',status.textContent),element('br'),element('span',draft.enabled?'Proposed application access: ON':'Proposed application access: OFF'));
     scopes.forEach(scope=>{
       const selected=actions.filter(action=>draft.permissions[scope][action]);
       if(!selected.length)return;
       mirror.append(element('br'),element('span',scope),document.createTextNode(': '));
       selected.forEach((action,index)=>{if(index)mirror.append(document.createTextNode(', '));mirror.append(element('span',action));});
     });
   };
 });
 function view(mode){
   directory.dataset.view=mode;
   document.querySelectorAll('[data-staff-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.staffView===mode)));
   directory.querySelectorAll('.staff-record').forEach(row=>{
     row.updateReference();
     const editor=row.querySelector('.staff-permission-editor');
     editor.hidden=mode==='activity';
   });
   translated();
 }
 document.querySelectorAll('[data-staff-view]').forEach(button=>button.addEventListener('click',()=>view(button.dataset.staffView)));
 search.addEventListener('input',()=>{
   const query=search.value.trim().toLocaleLowerCase();
   let visible=0;
   people.forEach(({id,person})=>{
     const row=directory.querySelector('[data-staff-id="'+id+'"]');
     row.hidden=!(person.firstName+' '+person.lastName+' '+person.email+' '+person.position).toLocaleLowerCase().includes(query);
     if(!row.hidden)visible++;
   });empty.hidden=visible!==0;
 });
 function openPermissions(){
   document.getElementById('staff-access').open=true;
   view('permissions');
 }
 document.getElementById('openStaffPermissions').addEventListener('click',openPermissions);
 function openRecord(id){
   const target=document.getElementById('staff-'+id);
   if(!target)return;
   search.value=''; search.dispatchEvent(new Event('input'));
   document.querySelectorAll('.settings-section').forEach(section=>section.hidden=false);
   document.getElementById('staff-access').open=true;
   view('permissions');
   requestAnimationFrame(()=>{target.scrollIntoView({block:'start'});target.tabIndex=-1;target.focus({preventScroll:true});});
 }
 document.querySelectorAll('[data-sample-staff]').forEach(link=>link.addEventListener('click',()=>openRecord(link.dataset.sampleStaff)));
 function followHash(){if(location.hash.startsWith('#staff-')&&location.hash!=='#staff-access')openRecord(location.hash.slice(7));}
 window.addEventListener('hashchange',followHash);
 followHash();
 if(location.hash==='#staff-access')openPermissions();
 view('permissions');
})();