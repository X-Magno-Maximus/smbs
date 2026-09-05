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
const employeeActionButtons=document.querySelectorAll('.employee-action-buttons button');
let employeeActive=true;
let employeeApproved=false;
document.querySelector('#addEmployeeButton').addEventListener('click',()=>employeeDialog.showModal());
document.querySelectorAll('[data-close-dialog]').forEach(control=>control.addEventListener('click',()=>control.closest('dialog').close()));
document.querySelectorAll('[data-position]').forEach(button=>button.addEventListener('click',()=>{
  employeePosition.value=button.dataset.position;
  document.querySelectorAll('[data-position]').forEach(choice=>{
    const selected=choice===button;
    choice.classList.toggle('selected',selected);
    choice.setAttribute('aria-checked',String(selected));
  });
  employeeActionButtons.forEach(action=>action.disabled=false);
  employeeStatus.textContent=button.dataset.position+' selected · Owner approval not requested';
}));
document.querySelector('#employeeRequestApproval').addEventListener('click',()=>{
  if(!employeeForm.reportValidity()||!employeePosition.value){showToast('Complete the employee record and choose a position first.');return;}
  document.querySelector('#selectedEmployeePosition').textContent='Selected position: '+employeePosition.value;
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
  employeeStatus.textContent=employeePosition.value+' · Awaiting SMB Owner approval · Requested '+formatted;
  const requestButton=document.querySelector('#employeeRequestApproval');
  requestButton.textContent='Approval Requested';
  requestButton.disabled=true;
  const auditBody=document.querySelector('.audit-history-table tbody');
  if(auditBody){
    const row=document.createElement('tr');
    row.dataset.auditDate=requestedAt.toISOString().slice(0,10);
    row.innerHTML='<td>'+formatted+'</td><td></td><td></td><td>Queued to owner@cacaoymas.com</td><td><em class="medium">Pending</em></td>';
    row.children[1].textContent=employeeName+' — '+employeePosition.value;
    row.children[2].textContent='Current authenticated end user';
    auditBody.prepend(row);
    applyAuditRange();
  }
  employeeApprovalDialog.close();
  approvalPositionConfirmation.value='';
  showToast('Owner approval request recorded and sent to the SMB Owner.');
});
document.querySelector('#employeeApprove').addEventListener('click',()=>{
  if(!employeePosition.value)return;
  employeeApproved=true;
  employeeStatus.textContent=employeePosition.value+' · Approved by SMB Owner';
  document.querySelector('#employeeApprove').disabled=true;
  showToast('Employee position approved and recorded.');
});
document.querySelector('#employeeToggleActive').addEventListener('click',event=>{
  employeeActive=!employeeActive;
  event.currentTarget.textContent=employeeActive?'Deactivate':'Activate';
  employeeStatus.textContent=employeePosition.value+' · '+(employeeActive?'Active':'Inactive')+(employeeApproved?' · Owner approved':' · Owner approval pending');
  showToast(employeeActive?'Employee activated.':'Employee deactivated.');
});
document.querySelector('#employeeDelete').addEventListener('click',()=>{
  const employeeName=(document.querySelector('#employeeFirstName').value+' '+document.querySelector('#employeeLastName').value).trim()||'New employee record';
  pendingDeleteUser=employeeName;
  deleteIdentity.textContent=employeeName;
  deleteDialog.showModal();
});
employeeForm.addEventListener('submit',event=>{
  event.preventDefault();
  if(!event.currentTarget.reportValidity()||!employeePosition.value){showToast('Choose an available position before saving.');return;}
  employeeDialog.close();
  showToast('Employee record saved with status: '+employeeStatus.textContent+'.');
});
employeeDialog.addEventListener('close',()=>{
  if(employeeApprovalDialog.open)employeeApprovalDialog.close();
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
document.querySelectorAll('[data-access-item]').forEach(item=>{
  const status=item.querySelector('[data-access-status]');
  const requestButton=item.querySelector('[data-request-approval]');
  const approveButton=item.querySelector('[data-approve-access]');
  const toggleButton=item.querySelector('[data-toggle-access]');
  function updateAccessStatus(message){
    const active=item.dataset.active==='true';
    status.textContent=(active?'Active':'Inactive')+' · '+message;
  }
  requestButton.addEventListener('click',()=>{
    item.dataset.approved='pending';
    requestButton.textContent='Approval Requested';
    requestButton.disabled=true;
    updateAccessStatus('Awaiting Business Owner approval');
    showToast('Owner approval requested and email notification queued.');
  });
  approveButton.addEventListener('click',()=>{
    item.dataset.approved='true';
    requestButton.textContent='Owner Approval Recorded';
    requestButton.disabled=true;
    approveButton.disabled=true;
    updateAccessStatus('Approved by Business Owner');
    showToast('Access approved. The owner email and audit history were updated.');
  });
  toggleButton.addEventListener('click',()=>{
    const active=item.dataset.active==='true';
    item.dataset.active=String(!active);
    toggleButton.textContent=active?'Activate':'Deactivate';
    updateAccessStatus(item.dataset.approved==='true'?'Approved by Business Owner':item.dataset.approved==='pending'?'Awaiting Business Owner approval':'Owner approval not requested');
    showToast(active?'End-user access deactivated.':'End-user access activated.');
  });
});

const auditRange=document.querySelector('#auditRange');
const auditFrom=document.querySelector('#auditDateFrom');
const auditTo=document.querySelector('#auditDateTo');
const auditCustomDates=document.querySelectorAll('.audit-custom-date');
const auditRows=document.querySelectorAll('[data-audit-date]');
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
    if(fromDate>toDate){auditStatus.textContent='The From date must be before the To date.';auditEmpty.hidden=false;auditRows.forEach(row=>row.hidden=true);return;}
  }else{
    fromDate=new Date(today);
    fromDate.setDate(fromDate.getDate()-Number(auditRange.value));
  }
  let visible=0;
  auditRows.forEach(row=>{
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
