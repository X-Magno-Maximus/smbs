const toast=document.querySelector('#toast');
let toastTimer;
function showToast(message){
  toast.textContent=message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('show'),2800);
}
document.querySelectorAll('[data-toast]').forEach(control=>control.addEventListener('click',()=>showToast(control.dataset.toast)));
document.querySelectorAll('[data-future-page]').forEach(control=>control.addEventListener('click',()=>showToast(control.dataset.futurePage+' will be created in its approved page stage.')));

const appShell=document.querySelector('.app-shell');
const sidebar=document.querySelector('#sidebar');
const menuToggle=document.querySelector('#menuToggle');
const sidebarSlideToggle=document.querySelector('#sidebarSlideToggle');
function sidebarIsOpen(){
  return window.matchMedia('(max-width:900px)').matches?sidebar.classList.contains('open'):!appShell.classList.contains('sidebar-collapsed');
}
function setSidebarOpen(open,persist=true){
  const compact=window.matchMedia('(max-width:900px)').matches;
  sidebar.classList.toggle('open',compact&&open);
  appShell.classList.toggle('sidebar-collapsed',!compact&&!open);
  menuToggle.setAttribute('aria-expanded',String(open));
  sidebarSlideToggle.setAttribute('aria-expanded',String(open));
  sidebarSlideToggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');
  sidebarSlideToggle.textContent=open?'<':'>';
  if(persist&&!compact){try{localStorage.setItem('marxia-sidebar-open',String(open))}catch(error){}}
}
menuToggle.addEventListener('click',()=>setSidebarOpen(!sidebarIsOpen()));
sidebarSlideToggle.addEventListener('click',()=>setSidebarOpen(!sidebarIsOpen()));
try{
  if(!window.matchMedia('(max-width:900px)').matches&&localStorage.getItem('marxia-sidebar-open')==='false') setSidebarOpen(false,false);
}catch(error){}

const utilityMenuToggle=document.querySelector('#utilityMenuToggle');
const utilityMenu=document.querySelector('#utilityMenu');
function closeUtilityMenu(){utilityMenu.hidden=true;utilityMenuToggle.setAttribute('aria-expanded','false');}
utilityMenuToggle.addEventListener('click',()=>{
  const open=utilityMenu.hidden;
  utilityMenu.hidden=!open;
  utilityMenuToggle.setAttribute('aria-expanded',String(open));
});
document.addEventListener('click',event=>{if(!event.target.closest('.utility-nav')) closeUtilityMenu();});

const languageButtons=document.querySelectorAll('[data-language-choice]');
function setLanguage(language,announce=true){
  document.documentElement.lang=language;
  languageButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.languageChoice===language)));
  try{localStorage.setItem('marxia-language',language)}catch(error){}
  if(announce) showToast(language==='es'?'Español seleccionado. La traducción se completará página por página.':'English selected.');
}
languageButtons.forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.languageChoice)));
const themeButtons=document.querySelectorAll('[data-theme-choice]');
function setTheme(theme,announce=true){
  const dark=theme==='dark';
  document.body.classList.toggle('dark',dark);
  themeButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.themeChoice===theme)));
  try{localStorage.setItem('marxia-theme',theme)}catch(error){}
  if(announce) showToast(dark?'Dark appearance enabled.':'Light appearance enabled.');
}
themeButtons.forEach(button=>button.addEventListener('click',()=>setTheme(button.dataset.themeChoice)));
try{
  const theme=localStorage.getItem('marxia-theme');
  const language=localStorage.getItem('marxia-language');
  if(theme==='dark'||theme==='light') setTheme(theme,false);
  if(language==='en'||language==='es') setLanguage(language,false);
}catch(error){}

const settingsSearch=document.querySelector('#settingsSearch');
settingsSearch.addEventListener('input',()=>{
  const query=settingsSearch.value.trim().toLowerCase();
  document.querySelectorAll('.settings-section').forEach(section=>{
    const matches=!query||(section.dataset.searchTerms+' '+section.textContent).toLowerCase().includes(query);
    section.hidden=!matches;
    if(query&&matches) section.open=true;
  });
});
document.addEventListener('keydown',event=>{
  if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();settingsSearch.focus();}
  if(event.key==='Escape'){setSidebarOpen(false,false);closeUtilityMenu();document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());}
});

const employeeDialog=document.querySelector('#employeeDialog');
const employeeForm=document.querySelector('#employeeForm');
const employeePosition=document.querySelector('#employeePosition');
const employeeStatus=document.querySelector('#employeeStatus');
const employeeApprovalDialog=document.querySelector('#employeeApprovalDialog');
const employeeApprovalForm=document.querySelector('#employeeApprovalForm');
const approvalPositionConfirmation=document.querySelector('#approvalPositionConfirmation');
const approvalPositionError=document.querySelector('#approvalPositionError');
const employeeRequestApproval=document.querySelector('#employeeRequestApproval');
const employeeApprove=document.querySelector('#employeeApprove');
const employeePromote=document.querySelector('#employeePromote');
const employeeToggleActive=document.querySelector('#employeeToggleActive');
const employeeDelete=document.querySelector('#employeeDelete');
const employeeActionButtons=document.querySelectorAll('.employee-action-buttons button');
const existingEmployeeSearch=document.querySelector('#existingEmployeeSearch');
const employeeSearchStatus=document.querySelector('#employeeSearchStatus');
const existingEmployees=[
  {firstName:'Ana',lastName:'Pérez',email:'ana.perez@cacaoymas.com',phone:'+593 99 000 0101',address:'Employee address on file',position:'Manager',active:true},
  {firstName:'Isaac',lastName:'Silva',email:'isaac.silva@cacaoymas.com',phone:'+593 99 000 0102',address:'Employee address on file',position:'Supervisor',active:true},
  {firstName:'Luis',lastName:'Mora',email:'luis.mora@cacaoymas.com',phone:'+593 99 000 0103',address:'Employee address on file',position:'Employee / Staff',active:true}
];
const roleProgression={'Employee / Staff':'Supervisor','Independent contractor':'Employee / Staff','Supervisor':'Manager','Manager':'Management Admin','Management Admin':'Director','IT SuperUser':'Director','Director':'Vice President','Vice President':'Vice President'};
let selectedExistingEmployee=null;
let pendingEmployeeAction='New employee access';
let employeeActive=true;
let employeeApproved=false;
function chooseEmployeePosition(position){
  employeePosition.value=position;
  document.querySelectorAll('[data-position]').forEach(choice=>{
    const selected=choice.dataset.position===position;
    choice.classList.toggle('selected',selected);
    choice.setAttribute('aria-checked',String(selected));
  });
}
function setEmployeeActionAvailability(enabled){
  employeeActionButtons.forEach(action=>{if(action!==employeeApprove)action.disabled=!enabled;});
}
function resetEmployeeMode(){
  selectedExistingEmployee=null;
  pendingEmployeeAction='New employee access';
  employeeActive=true;
  employeeApproved=false;
  employeePromote.hidden=true;
  employeeApprove.textContent='Approve';
  employeeApprove.disabled=true;
  employeeRequestApproval.textContent='Request Approval';
  employeeRequestApproval.disabled=!employeePosition.value;
  employeeToggleActive.textContent='Deactivate';
  employeeDelete.textContent='Delete';
  employeeSearchStatus.textContent='Search to update, promote, deactivate, or request deletion of an existing employee.';
}
function findExistingEmployee(){
  const query=existingEmployeeSearch.value.trim().toLocaleLowerCase();
  const employee=existingEmployees.find(person=>(person.firstName+' '+person.lastName).toLocaleLowerCase()===query||person.email.toLocaleLowerCase()===query);
  if(!employee){
    selectedExistingEmployee=null;
    employeeSearchStatus.textContent=query?'No exact employee match was found. Enter a full name or email.':'Enter an employee name or email.';
    return;
  }
  selectedExistingEmployee=employee;
  pendingEmployeeAction='Existing employee record update';
  employeeForm.elements.firstName.value=employee.firstName;
  employeeForm.elements.lastName.value=employee.lastName;
  employeeForm.elements.address.value=employee.address;
  employeeForm.elements.email.value=employee.email;
  employeeForm.elements.phone.value=employee.phone;
  chooseEmployeePosition(employee.position);
  employeeActive=employee.active;
  employeeApproved=true;
  setEmployeeActionAvailability(true);
  employeeApprove.textContent='Approved';
  employeeApprove.disabled=true;
  employeeApprove.dataset.completed='true';
  employeePromote.hidden=false;
  employeeRequestApproval.textContent='Request Approval';
  employeeRequestApproval.disabled=false;
  employeeToggleActive.textContent='Deactivate';
  employeeDelete.textContent='Delete';
  employeeStatus.textContent=employee.position+' · Approved by Supervisor or Manager · Owner authorization required for changes';
  employeeSearchStatus.textContent='Found '+employee.firstName+' '+employee.lastName+'. Review the record or select an action.';
}
document.querySelector('#addEmployeeButton').addEventListener('click',()=>employeeDialog.showModal());
document.querySelectorAll('[data-close-dialog]').forEach(control=>control.addEventListener('click',()=>control.closest('dialog').close()));
document.querySelector('#findEmployeeButton').addEventListener('click',findExistingEmployee);
existingEmployeeSearch.addEventListener('change',findExistingEmployee);
existingEmployeeSearch.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();findExistingEmployee();}});
document.querySelectorAll('[data-position]').forEach(button=>button.addEventListener('click',()=>{
  chooseEmployeePosition(button.dataset.position);
  setEmployeeActionAvailability(true);
  if(selectedExistingEmployee){
    pendingEmployeeAction='Role change to '+button.dataset.position;
    employeeStatus.textContent=button.dataset.position+' selected · Request SMB Owner approval to apply this role change';
  }else{
    employeeStatus.textContent=button.dataset.position+' selected · Owner approval not requested';
  }
}));
employeePromote.addEventListener('click',()=>{
  if(!selectedExistingEmployee)return;
  const nextRole=roleProgression[employeePosition.value]||employeePosition.value;
  chooseEmployeePosition(nextRole);
  pendingEmployeeAction='Promotion to '+nextRole;
  employeeStatus.textContent='Promotion to '+nextRole+' selected · Request SMB Owner approval';
  showToast('Promotion selected. Use Request Approval to send it to the SMB Owner.');
});
employeeRequestApproval.addEventListener('click',()=>{
  if(!employeeForm.reportValidity()||!employeePosition.value){showToast('Complete the employee record and choose a position first.');return;}
  document.querySelector('#selectedEmployeePosition').textContent='Requested change: '+pendingEmployeeAction+' · Position: '+employeePosition.value;
  approvalPositionConfirmation.value='';
  approvalPositionError.hidden=true;
  employeeApprovalDialog.showModal();
});
employeeApprovalForm.addEventListener('submit',event=>{
  event.preventDefault();
  const typed=approvalPositionConfirmation.value.trim();
  if(typed.localeCompare(employeePosition.value,undefined,{sensitivity:'accent'})!==0){
    approvalPositionError.hidden=false;
    approvalPositionConfirmation.setAttribute('aria-invalid','true');
    approvalPositionConfirmation.focus();
    return;
  }
  approvalPositionError.hidden=true;
  approvalPositionConfirmation.removeAttribute('aria-invalid');
  const employeeName=(document.querySelector('#employeeFirstName').value+' '+document.querySelector('#employeeLastName').value).trim();
  const requestedAt=new Date();
  const formatted=requestedAt.toLocaleString([], {dateStyle:'medium',timeStyle:'short'});
  employeeStatus.textContent=pendingEmployeeAction+' · Awaiting SMB Owner approval · Requested '+formatted;
  employeeRequestApproval.textContent='Approval Requested';
  employeeRequestApproval.disabled=true;
  employeeRequestApproval.dataset.completed='true';
  const auditBody=document.querySelector('.audit-history-table tbody');
  if(auditBody){
    const row=document.createElement('tr');
    row.dataset.auditDate=requestedAt.toISOString().slice(0,10);
    row.innerHTML='<td>'+formatted+'</td><td></td><td></td><td>Queued to owner@cacaoymas.com</td><td><em class="medium">Pending</em></td>';
    row.children[1].textContent=employeeName+' — '+pendingEmployeeAction+' — '+employeePosition.value;
    row.children[2].textContent='Current authenticated Supervisor or Manager';
    auditBody.prepend(row);
    applyAuditRange();
  }
  employeeApprovalDialog.close();
  approvalPositionConfirmation.value='';
  showToast('Approval request recorded and sent to the SMB Owner.');
});
employeeApprove.addEventListener('click',()=>{
  if(!employeePosition.value||selectedExistingEmployee)return;
  employeeApproved=true;
  employeeStatus.textContent=employeePosition.value+' · Approved by Supervisor or Manager · Awaiting Owner authorization';
  employeeApprove.textContent='Approved';
  employeeApprove.disabled=true;
  employeeApprove.dataset.completed='true';
  showToast('Management approval recorded. Final Owner authorization is still required.');
});
employeeToggleActive.addEventListener('click',()=>{
  if(selectedExistingEmployee){
    pendingEmployeeAction='Deactivation request';
    employeeStatus.textContent='Deactivation selected · Request SMB Owner approval before access changes';
    showToast('Deactivation selected. Use Request Approval to continue.');
    return;
  }
  employeeActive=!employeeActive;
  employeeToggleActive.textContent=employeeActive?'Deactivate':'Activate';
  employeeStatus.textContent=employeePosition.value+' · '+(employeeActive?'Active':'Inactive')+(employeeApproved?' · Management approved':' · Owner approval pending');
});
employeeDelete.addEventListener('click',()=>{
  if(selectedExistingEmployee){
    pendingEmployeeAction='Access deletion request';
    employeeStatus.textContent='Access deletion selected · Employee account and history will be preserved · Request SMB Owner approval';
    showToast('Access deletion selected. Use Request Approval to continue.');
    return;
  }
  const employeeName=(document.querySelector('#employeeFirstName').value+' '+document.querySelector('#employeeLastName').value).trim()||'New employee record';
  pendingDeleteUser=employeeName;
  deleteIdentity.textContent=employeeName;
  deleteDialog.showModal();
});
employeeForm.addEventListener('submit',event=>{
  event.preventDefault();
  if(!event.currentTarget.reportValidity()||!employeePosition.value){showToast('Choose an available position before saving.');return;}
  const mode=selectedExistingEmployee?'updated':'created';
  employeeDialog.close();
  showToast('Employee record '+mode+'. Use Request Approval before applying access changes.');
});
employeeDialog.addEventListener('close',()=>{
  if(employeeApprovalDialog.open)employeeApprovalDialog.close();
  employeeForm.reset();
  existingEmployeeSearch.value='';
  chooseEmployeePosition('');
  resetEmployeeMode();
});
document.querySelectorAll('.settings-form').forEach(form=>form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity()) return;
  showToast(form.dataset.formName+' saved.');
}));

const employeeAccessDeleteDialog=document.querySelector('#employeeAccessDeleteDialog');
const employeeAccessDeleteIdentity=document.querySelector('#employeeAccessDeleteIdentity');
let pendingEmployeeAccessRow=null;
document.querySelectorAll('[data-employee-access]').forEach(row=>{
  const employee=row.dataset.employee;
  const status=row.querySelector('[data-employee-status]');
  const suspendButton=row.querySelector('[data-suspend-access]');
  row.querySelector('[data-reset-password]').addEventListener('click',event=>{
    event.currentTarget.disabled=true;
    event.currentTarget.textContent='Reset Requested';
    status.textContent='Password reset requested';
    status.className='medium';
    showToast('A secure password-reset link was requested for '+employee+'. No password was emailed or exposed.');
  });
  suspendButton.addEventListener('click',()=>{
    const suspended=row.dataset.suspended==='true';
    row.dataset.suspended=String(!suspended);
    suspendButton.textContent=suspended?'Suspend':'Restore Access';
    suspendButton.dataset.tooltip=suspended?'Immediately suspend application access and revoke active sessions for a lost or stolen device.':'Restore application access after the device and employee identity have been verified.';
    status.textContent=suspended?'Active':'Suspended — sessions revoked';
    status.className=suspended?'paid':'low';
    showToast(suspended?employee+' access restored.':employee+' access suspended for device protection.');
  });
  row.querySelector('[data-delete-employee-access]').addEventListener('click',()=>{
    pendingEmployeeAccessRow=row;
    employeeAccessDeleteIdentity.textContent=employee;
    employeeAccessDeleteDialog.showModal();
  });
});
document.querySelector('#employeeAccessDeleteForm').addEventListener('submit',event=>{
  event.preventDefault();
  if(!pendingEmployeeAccessRow)return;
  const employee=pendingEmployeeAccessRow.dataset.employee;
  const status=pendingEmployeeAccessRow.querySelector('[data-employee-status]');
  status.textContent='Application access deleted';
  status.className='low';
  pendingEmployeeAccessRow.dataset.suspended='true';
  pendingEmployeeAccessRow.querySelectorAll('.employee-row-actions button:not([data-toast])').forEach(button=>button.disabled=true);
  employeeAccessDeleteDialog.close();
  pendingEmployeeAccessRow=null;
  showToast(employee+' application access deleted. The account and employee record were preserved.');
});

const governanceOwnerPassword=document.querySelector('#governanceOwnerPassword');
function ownerIsVerified(){
  if(governanceOwnerPassword?.value) return true;
  showToast('Enter the Business Owner password before completing this action.');
  governanceOwnerPassword?.focus();
  return false;
}
document.querySelectorAll('[data-governed-item]').forEach(item=>{
  const status=item.querySelector('[data-governed-status]');
  const requestButton=item.querySelector('[data-request-governance]');
  const approveButton=item.querySelector('[data-approve-governance]');
  const toggleButton=item.querySelector('[data-toggle-governance]');
  function updateGovernedStatus(message){
    status.textContent=(item.dataset.active==='true'?'Active':'Inactive')+' · '+message;
  }
  requestButton.addEventListener('click',()=>{
    item.dataset.approved='pending';
    requestButton.textContent='Approval Requested';
    requestButton.disabled=true;
    updateGovernedStatus('Awaiting Business Owner approval');
    showToast('Owner approval requested and email notification queued.');
  });
  approveButton.addEventListener('click',()=>{
    if(!ownerIsVerified()) return;
    item.dataset.approved='true';
    requestButton.textContent='Owner Approval Recorded';
    requestButton.disabled=true;
    approveButton.disabled=true;
    updateGovernedStatus('Approved by Business Owner');
    governanceOwnerPassword.value='';
    showToast('Approved. The owner email and audit history were updated.');
  });
  toggleButton.addEventListener('click',()=>{
    if(!ownerIsVerified()) return;
    const active=item.dataset.active==='true';
    item.dataset.active=String(!active);
    toggleButton.textContent=active?'Activate':'Deactivate';
    const approval=item.dataset.approved==='true'?'Approved by Business Owner':item.dataset.approved==='pending'?'Awaiting Business Owner approval':'Owner approval not requested';
    updateGovernedStatus(approval);
    governanceOwnerPassword.value='';
    showToast(active?'Access deactivated.':'Access activated.');
  });
});

const deleteDialog=document.querySelector('#deleteDialog');
const deleteIdentity=document.querySelector('#deleteUserIdentity');
let pendingDeleteUser='';
document.querySelectorAll('[data-delete-user]').forEach(control=>control.addEventListener('click',()=>{
  if(control.closest('[data-governed-item]')&&!ownerIsVerified()) return;
  pendingDeleteUser=control.dataset.deleteUser;
  deleteIdentity.textContent=pendingDeleteUser;
  deleteDialog.showModal();
}));
document.querySelector('#deleteForm').addEventListener('submit',event=>{
  event.preventDefault();
  const row=document.querySelector('[data-delete-user="'+CSS.escape(pendingDeleteUser)+'"]')?.closest('article');
  if(row) row.hidden=true;
  deleteDialog.close();
  showToast('Protected deletion queued for '+pendingDeleteUser+'.');
  pendingDeleteUser='';
});
const endUserSearch=document.querySelector('#endUserSearch');
const endUserRows=document.querySelectorAll('[data-end-user]');
const endUserSearchEmpty=document.querySelector('#endUserSearchEmpty');
function addAuditRecord(eventName,endUser,result){
  const requestedAt=new Date();
  const row=document.createElement('tr');
  row.dataset.auditDate=requestedAt.toISOString().slice(0,10);
  const formatted=requestedAt.toLocaleString([], {dateStyle:'medium',timeStyle:'short'});
  row.innerHTML='<td></td><td></td><td>Current authenticated end user</td><td>Queued to owner@cacaoymas.com</td><td></td>';
  row.children[0].textContent=formatted;
  row.children[1].textContent=eventName+' — '+endUser;
  const resultBadge=document.createElement('em');
  resultBadge.className=result==='Deleted'||result==='Deactivated'?'low':result==='Requested'?'medium':'paid';
  resultBadge.textContent=result;
  row.children[4].append(resultBadge);
  document.querySelector('.audit-history-table tbody')?.prepend(row);
  applyAuditRange();
}
function applyEndUserSearch(){
  const query=endUserSearch.value.trim().toLocaleLowerCase();
  let visible=0;
  endUserRows.forEach(row=>{
    const searchable=(row.dataset.firstName+' '+row.dataset.lastName+' '+row.dataset.email).toLocaleLowerCase();
    row.hidden=Boolean(query&&!searchable.includes(query));
    if(!row.hidden)visible+=1;
  });
  endUserSearchEmpty.hidden=visible!==0;
}
endUserSearch.addEventListener('input',applyEndUserSearch);
document.querySelectorAll('[data-end-user-action]').forEach(button=>button.addEventListener('click',()=>{
  const row=button.closest('[data-end-user]');
  const identity=row.dataset.firstName+' '+row.dataset.lastName+' · '+row.dataset.email;
  const status=row.querySelector('[data-access-status]');
  const action=button.dataset.endUserAction;
  if(action==='password-reset'){
    status.textContent='Secure password reset requested';
    addAuditRecord('Password reset requested',identity,'Requested');
    showToast('A secure password-reset link was requested for '+row.dataset.email+'.');
    return;
  }
  const completed={approve:'Approved',deactivate:'Deactivated',delete:'Deleted',request:'Requested'}[action];
  button.textContent=completed;
  button.disabled=true;
  button.dataset.completed='true';
  if(action==='approve')status.textContent='Approved by Business Owner';
  if(action==='deactivate')status.textContent='Application access deactivated';
  if(action==='request')status.textContent='Awaiting Business Owner approval';
  if(action==='delete'){
    status.textContent='Application access deleted · Identity and history preserved';
    row.dataset.accessDeleted='true';
    row.querySelectorAll('[data-end-user-action]:not([data-end-user-action="delete"])').forEach(control=>control.disabled=true);
  }
  addAuditRecord('End-user access '+completed.toLocaleLowerCase(),identity,completed);
  showToast(identity+' — '+completed+'. Audit history updated.');
}));

const auditRange=document.querySelector('#auditRange');
const auditFrom=document.querySelector('#auditDateFrom');
const auditTo=document.querySelector('#auditDateTo');
const auditCustomDates=document.querySelectorAll('.audit-custom-date');
function auditRows(){return document.querySelectorAll('[data-audit-date]');}
const auditStatus=document.querySelector('#auditStatus');
const auditEmpty=document.querySelector('#auditEmpty');
function isoDate(date){return date.toISOString().slice(0,10);}
function applyAuditRange(){
  if(!auditRange) return;
  const today=new Date();
  today.setHours(23,59,59,999);
  const oldestAllowed=new Date(today);
  oldestAllowed.setDate(oldestAllowed.getDate()-365);
  let fromDate;
  let toDate=today;
  const custom=auditRange.value==='custom';
  auditCustomDates.forEach(field=>field.hidden=!custom);
  if(custom){
    fromDate=auditFrom.value?new Date(auditFrom.value+'T00:00:00'):oldestAllowed;
    toDate=auditTo.value?new Date(auditTo.value+'T23:59:59'):today;
    if(fromDate<oldestAllowed){fromDate=oldestAllowed;auditFrom.value=isoDate(oldestAllowed);}
    if(toDate>today){toDate=today;auditTo.value=isoDate(today);}
    if(fromDate>toDate){auditStatus.textContent='The From date must be before the To date.';auditEmpty.hidden=false;auditRows().forEach(row=>row.hidden=true);return;}
  }else{
    fromDate=new Date(today);
    fromDate.setDate(fromDate.getDate()-Number(auditRange.value));
  }
  let visible=0;
  auditRows().forEach(row=>{
    const rowDate=new Date(row.dataset.auditDate+'T12:00:00');
    const show=rowDate>=fromDate&&rowDate<=toDate;
    row.hidden=!show;
    if(show) visible+=1;
  });
  auditEmpty.hidden=visible!==0;
  const label=custom?`${isoDate(fromDate)} through ${isoDate(toDate)}`:auditRange.options[auditRange.selectedIndex].text;
  auditStatus.textContent=`Showing ${visible} approval record${visible===1?'':'s'} for ${label.toLowerCase()}.`;
}
if(auditRange){
  const today=new Date(),oldest=new Date();
  oldest.setDate(today.getDate()-365);
  auditFrom.min=isoDate(oldest);auditFrom.max=isoDate(today);auditTo.min=isoDate(oldest);auditTo.max=isoDate(today);
  auditFrom.value=isoDate(oldest);auditTo.value=isoDate(today);
  auditRange.addEventListener('change',applyAuditRange);
  auditFrom.addEventListener('change',applyAuditRange);
  auditTo.addEventListener('change',applyAuditRange);
  applyAuditRange();
}
