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
   const header=element('header',undefined,'staff-record-header');
   const name=element('h3',person.firstName+' '+person.lastName);
   name.id=id+'-name';
   const occupation=element('p',person.position,'staff-record-occupation');
   const email=element('p',person.email || 'Not available','staff-record-email');
   const expand=element('button',undefined,'staff-record-toggle');
   expand.type='button';
   const toggleLabel=element('span','Show staff details','staff-toggle-label');
   toggleLabel.id=id+'-toggle-label';
   const arrow=element('span',undefined,'staff-record-chevron');
   arrow.setAttribute('aria-hidden','true');
   expand.append(toggleLabel,arrow);
   expand.setAttribute('aria-labelledby',toggleLabel.id+' '+name.id);
   expand.setAttribute('aria-expanded','false');
   expand.setAttribute('aria-controls',id+'-details');
   header.append(name,occupation,email,expand);
   row.append(header);
   const columns=element('div',undefined,'staff-columns');
   columns.id=id+'-details';
   columns.hidden=true;
   expand.addEventListener('click',()=>{
     const open=expand.getAttribute('aria-expanded')!=='true';
     expand.setAttribute('aria-expanded',String(open));
     columns.hidden=!open;
     toggleLabel.textContent=open?'Hide staff details':'Show staff details';
     translated();
   });
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
   activity.append(element('h4','Activity'));
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
   const disclosure=target.querySelector('.staff-record-toggle');
   if(disclosure?.getAttribute('aria-expanded')==='false')disclosure.click();
   requestAnimationFrame(()=>{target.scrollIntoView({block:'start'});target.tabIndex=-1;target.focus({preventScroll:true});});
 }
 document.querySelectorAll('[data-sample-staff]').forEach(link=>link.addEventListener('click',()=>openRecord(link.dataset.sampleStaff)));
 function followHash(){if(location.hash.startsWith('#staff-')&&location.hash!=='#staff-access')openRecord(location.hash.slice(7));}
 window.addEventListener('hashchange',followHash);
 followHash();
 if(location.hash==='#staff-access')openPermissions();
 view('permissions');

 function enhanceEmployeeAccessPanel(){
   const table=document.querySelector('.employee-access-table');
   if(!table||table.dataset.enhanced==='true')return;
   table.dataset.enhanced='true';
   const section=table.closest('.section-body');
   if(!section)return;
   const style=document.createElement('style');
   style.textContent=`
.employee-access-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 12px;padding:10px 12px;border:1px solid var(--line);border-radius:9px;background:var(--surface)}
.employee-access-toolbar .employee-select-all{display:flex;align-items:center;gap:8px;font-size:var(--font-body);font-weight:750;color:var(--ink)}
.employee-access-toolbar input{width:19px;height:19px;accent-color:var(--green);cursor:pointer}
.employee-access-toolbar .employee-bulk-actions{display:none;align-items:center;gap:7px;flex-wrap:wrap}
.employee-access-toolbar.has-selection .employee-bulk-actions{display:flex}
.employee-access-toolbar .employee-selected-count{color:var(--muted);font-size:var(--font-support);font-weight:700;margin-right:2px}
.employee-access-toolbar button{min-height:36px;padding:0 11px;border:1px solid var(--green);border-radius:7px;background:var(--surface);color:var(--green);font-size:var(--font-body);font-weight:750;cursor:pointer}
.employee-access-toolbar button:hover{background:var(--green);color:#fff}
.employee-access-toolbar button:active{transform:translateY(1px)}
.employee-access-table{display:block;width:100%}
.employee-access-table thead{display:none}
.employee-access-table tbody{display:grid;gap:12px}
.employee-access-table tr{display:grid;grid-template-columns:minmax(260px,1.6fr) minmax(150px,.8fr) minmax(120px,.65fr) minmax(150px,.85fr);grid-template-areas:"employee position status access" "actions actions actions actions";gap:0 18px;padding:17px 18px;border:1px solid var(--line);border-radius:10px;background:var(--surface);box-shadow:var(--shadow)}
.employee-access-table td{display:block;padding:0;border:0;min-width:0}
.employee-access-table td:nth-child(1){grid-area:employee}
.employee-access-table td:nth-child(2){grid-area:position}
.employee-access-table td:nth-child(3){grid-area:status}
.employee-access-table td:nth-child(4){grid-area:access}
.employee-access-table td:nth-child(5){grid-area:actions;margin-top:15px;padding-top:14px;border-top:1px solid var(--line)}
.employee-access-table td:not(:first-child)::before{display:block;margin-bottom:4px;color:var(--muted);font-size:var(--font-support);font-weight:750;line-height:1.2}
.employee-access-table td:nth-child(2)::before{content:'Position'}
.employee-access-table td:nth-child(3)::before{content:'Status'}
.employee-access-table td:nth-child(4)::before{content:'Last access'}
.employee-access-table td:first-child{position:relative;padding-left:30px}
.employee-access-table td:first-child strong{display:block;font-size:var(--font-body);font-weight:800;line-height:1.3}
.employee-access-table td:first-child .employee-access-note{display:block;margin-top:4px;color:var(--muted);font-size:var(--font-support);line-height:1.35}
.employee-select{position:absolute;left:0;top:1px;width:19px;height:19px;accent-color:var(--green);cursor:pointer}
.employee-row-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap;min-width:0}
.settings-table .employee-row-actions>button,.settings-table .employee-row-actions .employee-more summary{min-height:38px;padding:0 12px;border:1px solid var(--green);border-radius:7px;background:var(--surface);color:var(--green);font-size:var(--font-body);font-weight:750;white-space:nowrap;cursor:pointer}
.settings-table .employee-row-actions>button:hover,.settings-table .employee-row-actions .employee-more summary:hover{background:var(--green);color:#fff}
.settings-table .employee-row-actions>button:active{transform:translateY(1px)}
.settings-table .employee-row-actions>button:focus-visible,.settings-table .employee-row-actions .employee-more summary:focus-visible,.employee-select:focus-visible,.employee-access-toolbar button:focus-visible,.employee-access-toolbar input:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
.employee-row-actions .employee-more{position:relative;margin-left:auto;flex:0 0 auto;max-width:100%}
.employee-row-actions .employee-more summary{display:flex;align-items:center;list-style:none;width:max-content;margin-left:auto}
.employee-row-actions .employee-more summary::-webkit-details-marker{display:none}
.employee-row-actions .employee-more summary::after{content:'▾';margin-left:7px;font-size:12px}
.employee-row-actions .employee-more[open] summary::after{content:'▴'}
.employee-row-actions .employee-more-menu{position:static;display:grid;width:min(240px,calc(100vw - 100px));max-width:100%;min-width:0;margin-top:7px;padding:6px;border:1px solid var(--line);border-radius:8px;background:var(--surface);box-shadow:0 14px 34px rgba(0,30,24,.18)}
.employee-row-actions .employee-more-menu button{width:100%;min-height:38px;padding:0 10px;border:0;border-radius:6px;background:transparent;color:var(--ink);font-size:var(--font-body);font-weight:700;text-align:left;cursor:pointer}
.employee-row-actions .employee-more-menu button:hover{background:var(--green);color:#fff}
.employee-row-actions .employee-more-menu .danger-button-small{color:var(--danger)}
.employee-row-actions .employee-more-menu .danger-button-small:hover{background:var(--danger);color:#fff}
@media(max-width:900px){.employee-access-table tr{grid-template-columns:1fr 1fr;grid-template-areas:"employee employee" "position status" "access access" "actions actions";gap:14px 18px}}
@media(max-width:560px){.employee-access-toolbar{align-items:flex-start;flex-direction:column}.employee-access-toolbar.has-selection .employee-bulk-actions{width:100%}.employee-access-toolbar .employee-bulk-actions button{flex:1}.employee-access-table tr{grid-template-columns:1fr;grid-template-areas:"employee" "position" "status" "access" "actions"}.employee-row-actions>button{flex:1 1 150px}.employee-row-actions .employee-more{flex:0 0 auto;margin-left:auto}.employee-row-actions .employee-more summary{justify-content:center}.employee-row-actions .employee-more-menu button{text-align:center}}
.dark .employee-access-toolbar,.dark .employee-access-table tr{background:var(--surface)}
.dark .employee-row-actions .employee-more-menu{box-shadow:0 18px 40px rgba(0,0,0,.38)}
`;
   document.head.appendChild(style);
   const toolbar=document.createElement('div');
   toolbar.className='employee-access-toolbar';
   toolbar.setAttribute('aria-label','Staff bulk actions');
   const selectLabel=document.createElement('label');
   selectLabel.className='employee-select-all';
   const selectAll=document.createElement('input');
   selectAll.type='checkbox';
   selectAll.setAttribute('aria-label','Select all visible staff');
   const selectText=document.createElement('span');selectText.textContent='Select staff';
   selectLabel.append(selectAll,selectText);
   const bulk=document.createElement('div');bulk.className='employee-bulk-actions';
   const count=document.createElement('span');count.className='employee-selected-count';count.setAttribute('aria-live','polite');
   const bulkReset=document.createElement('button');bulkReset.type='button';bulkReset.textContent='Request Password Reset';
   const bulkSuspend=document.createElement('button');bulkSuspend.type='button';bulkSuspend.textContent='Suspend Access';
   const clear=document.createElement('button');clear.type='button';clear.textContent='Clear selection';
   bulk.append(count,bulkReset,bulkSuspend,clear);
   toolbar.append(selectLabel,bulk);
   section.insertBefore(toolbar,section.querySelector('.table-scroll'));
   const rows=[...table.querySelectorAll('tbody tr[data-employee-access]')];
   const selectedRows=()=>rows.filter(row=>row.querySelector('.employee-select')?.checked);
   function updateSelection(){
     const selected=selectedRows();
     toolbar.classList.toggle('has-selection',selected.length>0);
     count.textContent=selected.length+' selected';
     const visible=rows.filter(row=>!row.hidden);
     selectAll.checked=visible.length>0&&visible.every(row=>row.querySelector('.employee-select')?.checked);
     selectAll.indeterminate=visible.some(row=>row.querySelector('.employee-select')?.checked)&&!selectAll.checked;
   }
   rows.forEach(row=>{
     const employee=row.dataset.employee||'Staff';
     const firstCell=row.cells[0];
     const checkbox=document.createElement('input');
     checkbox.type='checkbox';checkbox.className='employee-select';
     checkbox.setAttribute('aria-label','Select '+employee);
     firstCell.prepend(checkbox);
     const actionsCell=row.cells[4];
     const actionWrap=actionsCell.querySelector('.employee-row-actions');
     if(actionWrap){
       const review=actionWrap.querySelector('button[data-toast]');
       if(review){review.textContent='Review Staff';review.setAttribute('aria-label','Review '+employee+' employee record');}
       const reset=actionWrap.querySelector('[data-reset-password]');
       if(reset)reset.textContent='Request Password Reset';
     }
     checkbox.addEventListener('change',updateSelection);
   });
   selectAll.addEventListener('change',()=>{rows.filter(row=>!row.hidden).forEach(row=>{const checkbox=row.querySelector('.employee-select');if(checkbox)checkbox.checked=selectAll.checked;});updateSelection();});
   clear.addEventListener('click',()=>{rows.forEach(row=>{const checkbox=row.querySelector('.employee-select');if(checkbox)checkbox.checked=false;});updateSelection();});
   bulkReset.addEventListener('click',()=>{const selected=selectedRows();selected.forEach(row=>row.querySelector('[data-reset-password]')?.click());showToast(selected.length+' password reset request'+(selected.length===1?'':'s')+' recorded.');updateSelection();});
   bulkSuspend.addEventListener('click',()=>{const selected=selectedRows();selected.forEach(row=>{const suspend=row.querySelector('[data-suspend-access]');if(suspend&&!suspend.disabled&&suspend.textContent==='Suspend')suspend.click();});showToast(selected.length+' staff access action'+(selected.length===1?'':'s')+' processed.');updateSelection();});
   document.addEventListener('click',event=>{document.querySelectorAll('.employee-more[open]').forEach(menu=>{if(!menu.contains(event.target))menu.removeAttribute('open');});});
   updateSelection();
 }
 enhanceEmployeeAccessPanel();
})();