// Shared, on-demand IT Support dialog for every SMB dashboard page.
(function(){
  let dialog,opener;
  const template="<dialog class=\"record-dialog support-dialog\" id=\"supportDialog\" aria-labelledby=\"supportDialogTitle\">\n    <form method=\"dialog\" class=\"record-form\" id=\"supportForm\">\n      <header class=\"dialog-heading\">\n        <div><small>IT TECH SUPPORT</small><h2 id=\"supportDialogTitle\">Request support</h2><p>Describe the issue and securely confirm that you are authorizing this request.</p></div>\n        <button class=\"dialog-close\" type=\"button\" data-support-close aria-label=\"Close support request form\">×</button>\n      </header>\n      <div class=\"form-grid\">\n        <label>Full name<input id=\"supportName\" name=\"supportName\" required autocomplete=\"name\" placeholder=\"Enter your full name\"></label>\n        <label>Account email<input id=\"supportEmail\" name=\"supportEmail\" type=\"email\" required autocomplete=\"email\" placeholder=\"name@business.com\"></label>\n        <label>Support category<select id=\"supportCategory\" name=\"supportCategory\" required><option value=\"\">Choose a category</option><option>Account access</option><option>Orders</option><option>Products or inventory</option><option>Accounting or billing</option><option>Logistics</option><option>Technical issue</option></select></label>\n        <label>Temporary access period<select id=\"supportAccessPeriod\" name=\"supportAccessPeriod\" required><option value=\"15\">15 minutes</option><option value=\"30\">30 minutes</option><option value=\"60\">1 hour</option></select></label>\n        <label class=\"wide\">Issue summary<input id=\"supportSubject\" name=\"supportSubject\" required maxlength=\"120\" placeholder=\"Briefly describe what needs attention\"></label>\n        <label class=\"wide\">Details<textarea id=\"supportDetails\" name=\"supportDetails\" required rows=\"5\" placeholder=\"Explain what happened, what you expected, and any error message\"></textarea></label>\n      </div>\n      <section class=\"support-authorization\" aria-labelledby=\"supportAuthorizationTitle\">\n        <div><strong id=\"supportAuthorizationTitle\">Confirm your identity</strong><small>Your password is used only for secure re-authentication. It must never be included in the support request or shown to support personnel.</small></div>\n        <label>Account password<input id=\"supportPassword\" name=\"supportPassword\" type=\"password\" required autocomplete=\"current-password\" spellcheck=\"false\" placeholder=\"Enter your account password\"></label>\n        <label class=\"support-consent\"><input id=\"supportConsent\" name=\"supportConsent\" type=\"checkbox\" required> I authorize temporary, audited IT Support access for the selected period. I can revoke access at any time.</label>\n      </section>\n      <p class=\"form-note\">Support access starts only after secure identity verification.</p>\n      <footer class=\"dialog-actions\"><button type=\"button\" data-support-close>Cancel</button><button class=\"primary\" type=\"submit\">Authorize and request support</button></footer><p id=\"supportStatus\" role=\"status\" aria-live=\"polite\"></p>\n    </form>\n  </dialog>";
  function openSupport(button){
    if(!dialog){
      const holder=document.createElement('template');
      holder.innerHTML=template;
      document.body.append(holder.content.cloneNode(true));
      dialog=document.getElementById('supportDialog');
      const form=dialog.querySelector('#supportForm');
      const password=dialog.querySelector('#supportPassword');
      dialog.querySelectorAll('[data-support-close]').forEach(control=>control.addEventListener('click',()=>dialog.close()));
      dialog.addEventListener('click',event=>{
        if(event.target!==dialog)return;
        const rect=dialog.getBoundingClientRect();
        if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
      });
      dialog.addEventListener('close',()=>{
        password.value='';
        if(opener&&opener.isConnected)opener.focus();
      });
      form.addEventListener('submit',event=>{
        event.preventDefault();
        if(!form.reportValidity())return;
        password.value='';
        const status=dialog.querySelector('#supportStatus');
        status.textContent=document.documentElement.lang==='es'
          ?'La solicitud aún no se ha enviado. El servicio de soporte y la verificación segura de identidad deben estar conectados.'
          :'The request has not been sent. The support service and secure identity verification must be connected.';
      });
      window.addEventListener('pagehide',()=>{password.value='';});
    }
    opener=button;
    dialog.querySelector('#supportStatus').textContent='';
    window.MarxiaI18n?.apply(document.documentElement.lang);
    if(!dialog.open)dialog.showModal();
  }
  document.querySelectorAll('[data-support-open]').forEach(button=>button.addEventListener('click',()=>openSupport(button)));
})();
