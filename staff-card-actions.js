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
})();