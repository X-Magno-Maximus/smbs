// Employee access cards: keep the primary card focused on identity and status.
(function(){
  function moreLabel(){ return document.documentElement.lang.toLowerCase().startsWith('es') ? 'Más' : 'More'; }
  function enhance(){
    document.querySelectorAll('.employee-access-table tbody tr[data-employee-access]').forEach(function(row){
      const actions=row.querySelector('.employee-row-actions');
      if(!actions) return;
      if(row.dataset.cardActionsEnhanced!=='true'){
        row.dataset.cardActionsEnhanced='true';
        const employee=row.dataset.employee || 'staff member';
        const note=row.querySelector('.employee-access-note');
        if(note) note.remove();
        const menu=document.createElement('details');
        menu.className='employee-more employee-more-all';
        const summary=document.createElement('summary');
        summary.setAttribute('aria-label','More actions for '+employee);
        const panel=document.createElement('div');
        panel.className='employee-more-menu';
        Array.from(actions.querySelectorAll('button')).forEach(function(button){
          button.classList.remove('has-tooltip');
          panel.appendChild(button);
        });
        menu.append(summary,panel);
        actions.replaceChildren(menu);
        menu.addEventListener('toggle',function(){
          if(!menu.open) return;
          document.querySelectorAll('.employee-more-all[open]').forEach(function(other){
            if(other!==menu) other.removeAttribute('open');
          });
        });
      }
      const summary=row.querySelector('.employee-more-all summary');
      if(summary) summary.textContent=moreLabel();
    });
  }
  function closeOutside(event){
    document.querySelectorAll('.employee-more-all[open]').forEach(function(menu){
      if(!menu.contains(event.target)) menu.removeAttribute('open');
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',enhance);
  else enhance();
  document.addEventListener('click',closeOutside);
  window.setTimeout(enhance,250);
  new MutationObserver(enhance).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

  function enhanceAuditHistory(){
    const section=document.querySelector('.audit-history-table')?.closest('.section-body');
    const heading=section?.querySelector('.audit-view-heading');
    const range=document.querySelector('#auditRange');
    const from=document.querySelector('#auditDateFrom');
    const to=document.querySelector('#auditDateTo');
    const status=document.querySelector('#auditStatus');
    if(!section||!heading||!range||!from||!to)return;
    if(section.dataset.auditLayoutEnhanced!=='true'){
      section.dataset.auditLayoutEnhanced='true';
      const style=document.createElement('style');
      style.textContent=`
.audit-view-heading{display:grid!important;grid-template-columns:minmax(210px,1fr) minmax(150px,auto) minmax(150px,auto) minmax(170px,auto);align-items:end;gap:12px 14px;margin-bottom:14px}
.audit-view-heading>div:first-child{display:block;grid-column:1;grid-row:1;order:1}
.audit-view-heading>div:first-child small{display:none}
.audit-filters{display:contents!important}
.audit-filters>label{margin:0;min-width:0}
.audit-filters>label:first-child{grid-column:4;grid-row:1;order:4}
.audit-filters>.audit-custom-date:nth-child(2){grid-column:2;grid-row:1;order:2}
.audit-filters>.audit-custom-date:nth-child(3){grid-column:3;grid-row:1;order:3}
.audit-filters label{font-size:var(--font-body);font-weight:750;color:var(--ink)}
.audit-filters input,.audit-filters select{width:100%;box-sizing:border-box;margin-top:5px;min-height:38px;padding:7px 10px;border:1px solid var(--line);border-radius:7px;background:var(--surface);color:var(--ink);font-size:var(--font-body);font-weight:650}
.audit-filters .audit-custom-date{display:block!important}
.audit-status{display:none!important}
.audit-history-table{margin-top:4px}
@media(max-width:900px){.audit-view-heading{grid-template-columns:1fr 1fr}.audit-view-heading>div:first-child{grid-column:1/-1;grid-row:1}.audit-filters>label:first-child{grid-column:1/-1;grid-row:4}.audit-filters>.audit-custom-date:nth-child(2){grid-column:1;grid-row:2}.audit-filters>.audit-custom-date:nth-child(3){grid-column:2;grid-row:2}}
@media(max-width:560px){.audit-view-heading{grid-template-columns:1fr}.audit-view-heading>div:first-child{grid-column:1}.audit-filters>label:first-child,.audit-filters>.audit-custom-date:nth-child(2),.audit-filters>.audit-custom-date:nth-child(3){grid-column:1;grid-row:auto}}
.dark .audit-filters input,.dark .audit-filters select{background:var(--surface);color:var(--ink);border-color:var(--line)}
`;
      document.head.appendChild(style);
    }
    if(status)status.hidden=true;
    from.closest('.audit-custom-date')?.removeAttribute('hidden');
    to.closest('.audit-custom-date')?.removeAttribute('hidden');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',enhanceAuditHistory);
  else enhanceAuditHistory();
  window.setTimeout(enhanceAuditHistory,250);
})();