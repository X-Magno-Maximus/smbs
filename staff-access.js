// Shared staff directory: proposals and activity never authorize access.
(function(){
 const directory=document.getElementById('staffDirectory');
 const search=document.getElementById('staffDirectorySearch');
 const empty=document.getElementById('staffDirectoryEmpty');
 const messages=document.getElementById('staffRequestStatus');
 const scopes=['Orders','Products','Inventory','Accounting','Logistics','Reports','Marketplace','Overview'];
 const actions=['Read','Write','Approve','Audit'];
 // Keep the existing staff objects as the source for employee identity and job.
 const people=existingEmployees.map((person,index)=>({id:'staff-'+index,person}));
 people.push(...[
 ['account-maria','María','López','maria.lopez@example.com'],
 ['account-carlos','Carlos','Vega','carlos.vega@example.com'],
 ['account-elena','Elena','Ruiz','elena.ruiz@example.com']
 ].map(([id,firstName,lastName,email])=>({id,person:{firstName,lastName,email,position:'Unassigned'}})));
 people.push({id:'staff-mateo',person:{firstName:'Mateo',lastName:'Ruiz',email:'',position:'IT SuperUser'}},{id:'staff-sofia',person:{firstName:'Sofía',lastName:'León',email:'',position:'Management Admin'}});
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
   const header=element('header');
   header.append(element('h3',person.firstName+' '+person.lastName),element('p',person.email),element('p',person.position));
   row.append(header);
   const columns=element('div',undefined,'staff-columns');
   const permissions=element('section',undefined,'staff-permissions');
   permissions.append(element('h4','Roles & Access Permissions'),element('p','Current permissions: Not available'));
   const draft={enabled:false,permissions:{},prepared:false};
   drafts.set(id,draft);
   const editor=element('details',undefined,'staff-permission-editor');
   editor.append(element('summary','Prepare permission changes'));
   const master=element('label','Proposed application access ');
   const toggle=element('input');toggle.type='checkbox';
   toggle.setAttribute('aria-label',person.firstName+' '+person.lastName+' — Proposed application access');
   master.append(toggle);editor.append(master);
   const grid=element('div',undefined,'staff-permission-grid');
   scopes.forEach(scope=>{
     const field=element('fieldset');field.append(element('legend',scope));
     draft.permissions[scope]={};
     actions.forEach(action=>{
       const label=element('label',action+' ');
       const input=element('input');input.type='checkbox';input.disabled=true;
       input.setAttribute('aria-label',person.firstName+' '+person.lastName+' — '+scope+' — '+action);
       draft.permissions[scope][action]=false;
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
   ['Last login date / time / timezone','Branch','Device / browser','Approximate location','Session status'].forEach(label=>{
     const item=element('div');item.append(element('dt',label),element('dd','Not available'));facts.append(item);
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
 if(location.hash==='#staff-access')openPermissions();
 view('permissions');
})();