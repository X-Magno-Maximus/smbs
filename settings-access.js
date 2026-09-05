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
document.querySelector('#addEmployeeButton').addEventListener('click',()=>employeeDialog.showModal());
document.querySelectorAll('[data-close-dialog]').forEach(control=>control.addEventListener('click',()=>control.closest('dialog').close()));
document.querySelector('#employeeForm').addEventListener('submit',event=>{
  event.preventDefault();
  if(!event.currentTarget.reportValidity()) return;
  employeeDialog.close();
  event.currentTarget.reset();
  showToast('Employee submitted for owner review. Access has not been granted.');
});
document.querySelectorAll('.settings-form').forEach(form=>form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity()) return;
  showToast(form.dataset.formName+' saved.');
}));

const ownerAuthPassword=document.querySelector('#ownerAuthPassword');
document.querySelector('#privilegedRoleForm').addEventListener('submit',event=>{
  event.preventDefault();
  if(!event.currentTarget.reportValidity()) return;
  ownerAuthPassword.value='';
  showToast('Privileged-role request sent for SMB Owner approval.');
  event.currentTarget.reset();
});
document.querySelectorAll('[data-decision]').forEach(control=>control.addEventListener('click',()=>{
  const item=control.closest('article');
  item.hidden=true;
  showToast('Request '+control.dataset.decision+'. The owner and audit record will be notified.');
}));

const deleteDialog=document.querySelector('#deleteDialog');
const deleteIdentity=document.querySelector('#deleteUserIdentity');
let pendingDeleteUser='';
document.querySelectorAll('[data-delete-user]').forEach(control=>control.addEventListener('click',()=>{
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
