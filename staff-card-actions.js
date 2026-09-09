// Employee actions expand below the identity row without moving or cloning handlers.
(function(){
  function enhance(){
    document.querySelectorAll('.employee-access-table tbody tr[data-employee-access]').forEach(function(row,index){
      const actions=row.querySelector('.employee-row-actions');
      if(!actions)return;
      let toggle=row.querySelector('.employee-actions-toggle');
      if(!toggle){
        row.classList.add('employee-action-card');
        row.querySelector('.employee-access-note')?.remove();
        const cell=actions.closest('td');
        cell.id='employee-actions-'+index;
        cell.hidden=true;
        const toggleCell=document.createElement('td');
        toggleCell.className='employee-disclosure-cell';
        toggle=document.createElement('button');
        toggle.type='button';
        toggle.className='staff-record-toggle employee-actions-toggle';
        toggle.setAttribute('aria-expanded','false');
        toggle.setAttribute('aria-controls',cell.id);
        const arrow=document.createElement('span');
        arrow.className='staff-record-chevron';
        arrow.setAttribute('aria-hidden','true');
        toggle.append(arrow);
        toggleCell.append(toggle);
        row.append(toggleCell);
        toggle.addEventListener('click',function(){
          const expanded=toggle.getAttribute('aria-expanded')!=='true';
          toggle.setAttribute('aria-expanded',String(expanded));
          cell.hidden=!expanded;
          updateLabel();
        });
        actions.querySelectorAll('button').forEach(function(button){button.classList.remove('has-tooltip');});
      }
      function updateLabel(){
        const es=document.documentElement.lang.toLowerCase().startsWith('es');
        const open=toggle.getAttribute('aria-expanded')==='true';
        toggle.setAttribute('aria-label',(es?(open?'Ocultar acciones de ':'Mostrar acciones de '):(open?'Hide actions for ':'Show actions for '))+(row.dataset.employee||'staff'));
      }
      updateLabel();
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance);
  else enhance();
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