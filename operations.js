const toast=document.querySelector('#toast');let toastTimer;function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2800)}
const appShell=document.querySelector('.app-shell'),sidebar=document.querySelector('#sidebar'),menuToggle=document.querySelector('#menuToggle'),slideToggle=document.querySelector('#sidebarSlideToggle');
function sidebarOpen(){return matchMedia('(max-width:900px)').matches?sidebar.classList.contains('open'):!appShell.classList.contains('sidebar-collapsed')}
function setSidebar(open,persist=true){const compact=matchMedia('(max-width:900px)').matches;sidebar.classList.toggle('open',compact&&open);appShell.classList.toggle('sidebar-collapsed',!compact&&!open);menuToggle.setAttribute('aria-expanded',String(open));slideToggle.setAttribute('aria-expanded',String(open));slideToggle.textContent=open?'<':'>';slideToggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');if(persist&&!compact)try{localStorage.setItem('marxia-sidebar-open',String(open))}catch(error){}}
menuToggle.addEventListener('click',()=>setSidebar(!sidebarOpen()));slideToggle.addEventListener('click',()=>setSidebar(!sidebarOpen()));try{if(!matchMedia('(max-width:900px)').matches&&localStorage.getItem('marxia-sidebar-open')==='false')setSidebar(false,false)}catch(error){}
const utilityToggle=document.querySelector('#utilityMenuToggle'),utilityMenu=document.querySelector('#utilityMenu');function closeUtility(){utilityMenu.hidden=true;utilityToggle.setAttribute('aria-expanded','false')}utilityToggle.addEventListener('click',()=>{const open=utilityMenu.hidden;utilityMenu.hidden=!open;utilityToggle.setAttribute('aria-expanded',String(open))});document.addEventListener('click',event=>{if(!event.target.closest('.utility-nav'))closeUtility()});
document.querySelectorAll('[data-theme-choice]').forEach(button=>button.addEventListener('click',()=>setTheme(button.dataset.themeChoice)));function setTheme(theme,announce=true){document.body.classList.toggle('dark',theme==='dark');document.documentElement.dataset.theme=theme;document.querySelectorAll('[data-theme-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.themeChoice===theme)));try{localStorage.setItem('marxia-theme',theme)}catch(error){}if(announce)showToast(theme==='dark'?'Dark appearance enabled.':'Light appearance enabled.')}
document.querySelectorAll('[data-language-choice]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.languageChoice)));function setLanguage(language,announce=true){document.documentElement.lang=language;window.MarxiaI18n?.apply(language);document.querySelectorAll('[data-language-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.languageChoice===language)));try{localStorage.setItem('marxia-language',language)}catch(error){}if(announce)showToast(language==='es'?'Español seleccionado.':'English selected.')}
try{const theme=localStorage.getItem('marxia-theme'),language=localStorage.getItem('marxia-language');if(theme==='dark'||theme==='light')setTheme(theme,false);if(language==='en'||language==='es')setLanguage(language,false)}catch(error){}
const operationsThemeToggle=document.querySelector('[data-theme-toggle]'),operationsLanguageToggle=document.querySelector('[data-language-toggle]');
function syncOperationsTheme(theme){const dark=theme==='dark';operationsThemeToggle.setAttribute('aria-checked',String(dark));document.querySelectorAll('[data-theme-label]').forEach(label=>label.classList.toggle('active',label.dataset.themeLabel===theme))}
function syncOperationsLanguage(language){const spanish=language==='es';operationsLanguageToggle.setAttribute('aria-checked',String(spanish));document.querySelectorAll('[data-language-label]').forEach(label=>label.classList.toggle('active',label.dataset.languageLabel===language))}
operationsThemeToggle.addEventListener('click',()=>{const theme=operationsThemeToggle.getAttribute('aria-checked')==='true'?'light':'dark';setTheme(theme);syncOperationsTheme(theme)});
operationsLanguageToggle.addEventListener('click',()=>{const language=operationsLanguageToggle.getAttribute('aria-checked')==='true'?'en':'es';setLanguage(language);syncOperationsLanguage(language)});
try{syncOperationsTheme(localStorage.getItem('marxia-theme')==='dark'?'dark':'light');syncOperationsLanguage(localStorage.getItem('marxia-language')==='es'?'es':'en')}catch(error){syncOperationsTheme('light');syncOperationsLanguage('en')}
const search=document.querySelector('#operationsSearch');if(search)search.addEventListener('input',()=>{const query=search.value.trim().toLowerCase();document.querySelectorAll('[data-search-row]').forEach(row=>row.hidden=query&&!row.textContent.toLowerCase().includes(query))});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));document.querySelectorAll('[data-status]').forEach(row=>row.hidden=filter!=='all'&&row.dataset.status!==filter)}));
document.querySelectorAll('[data-toast]').forEach(button=>button.addEventListener('click',()=>showToast(button.dataset.toast)));
document.querySelectorAll('[data-open-dialog]').forEach(button=>button.addEventListener('click',()=>document.querySelector('#'+button.dataset.openDialog)?.showModal()));document.querySelectorAll('[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));document.querySelectorAll('dialog form').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;form.closest('dialog').close();form.reset();showToast(form.dataset.success||'Saved successfully.')}));document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();search?.focus()}if(event.key==='Escape'){closeUtility();document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close())}});
if(location.hash){const target=document.querySelector(location.hash);if(target)setTimeout(()=>target.scrollIntoView({behavior:'smooth',block:'start'}),100)}

// Accounting workspace view controller
const accountingViews=[...document.querySelectorAll('[data-accounting-view]')];
const accountingTriggers=[...document.querySelectorAll('[data-accounting-open]')];
function openAccountingView(viewName,{updateHash=true,focus=false}={}){
  const next=accountingViews.find(view=>view.dataset.accountingView===viewName);
  if(!next)return;
  accountingViews.forEach(view=>{const active=view===next;view.hidden=!active;view.classList.toggle('is-active',active)});
  accountingTriggers.forEach(trigger=>{
    const active=trigger.dataset.accountingOpen===viewName;
    trigger.classList.toggle('active',active);
    if(trigger.closest('.accounting-rail')){
      if(active)trigger.setAttribute('aria-current','page');else trigger.removeAttribute('aria-current');
    }
  });
  if(updateHash)history.replaceState(null,'','#'+viewName);
  if(focus){next.querySelector('h2')?.setAttribute('tabindex','-1');next.querySelector('h2')?.focus({preventScroll:true});next.scrollIntoView({behavior:'smooth',block:'start'})}
}
accountingTriggers.forEach(trigger=>trigger.addEventListener('click',()=>openAccountingView(trigger.dataset.accountingOpen,{focus:true})));
if(accountingViews.length){
  const requested=location.hash.slice(1);
  const valid=accountingViews.some(view=>view.dataset.accountingView===requested);
  openAccountingView(valid?requested:'overview',{updateHash:false});
}
const trendPeriod=document.querySelector('[data-trend-period]');
trendPeriod?.addEventListener('change',()=>{
  const months=trendPeriod.value;
  const description=document.querySelector('.trend-panel .panel-title-row p');
  if(description)description.textContent=months==='24'?'Monthly history with two-year comparison.':'Monthly history with one-year comparison.';
  showToast(months==='24'?'Showing the last 24 months.':'Showing the last 12 months.');
});
