const toast = document.querySelector('#toast');
let toastTimer;
function showToast(message){
  toast.textContent=message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('show'),2800);
}

document.querySelectorAll('[data-page]').forEach(control=>{
  control.addEventListener('click',()=>{
    const page=control.dataset.page;
    document.querySelector('#sidebar').classList.remove('open');
    document.querySelector('#menuToggle').setAttribute('aria-expanded','false');
    if(page==='Overview') return;
    showToast(page+' will be created as its own page in the next approved stage.');
  });
});
document.querySelectorAll('[data-toast]').forEach(control=>control.addEventListener('click',()=>showToast(control.dataset.toast)));
document.querySelectorAll('[data-no-route]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();showToast('This action will be connected during the Overview workflow.');}));

const menuToggle=document.querySelector('#menuToggle');
menuToggle.addEventListener('click',()=>{
  const sidebar=document.querySelector('#sidebar');
  const open=sidebar.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded',String(open));
});

const languageToggle=document.querySelector('#languageToggle');
languageToggle.addEventListener('click',()=>{
  const spanish=languageToggle.textContent==='EN';
  languageToggle.textContent=spanish?'ES':'EN';
  showToast(spanish?'Spanish labels will be completed page by page.':'English restored.');
});

const themeToggle=document.querySelector('#themeToggle');
themeToggle.addEventListener('click',()=>{
  const dark=document.body.classList.toggle('dark');
  const image=themeToggle.querySelector('img');
  const source=dark?'assets/dark.webp':'assets/light.webp';
  image.src=typeof MARXIA_ASSETS!=='undefined'&&MARXIA_ASSETS[source]?MARXIA_ASSETS[source]:source;
  showToast(dark?'Dark appearance enabled.':'Light appearance enabled.');
  drawChart();
});

document.addEventListener('keydown',event=>{
  if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){
    event.preventDefault();
    document.querySelector('#searchInput').focus();
  }
  if(event.key==='Escape'){
    document.querySelector('#sidebar').classList.remove('open');
    menuToggle.setAttribute('aria-expanded','false');
  }
});

function drawChart(){
  const canvas=document.querySelector('#performanceChart');
  const rect=canvas.getBoundingClientRect();
  const ratio=window.devicePixelRatio||1;
  canvas.width=Math.max(320,rect.width)*ratio;
  canvas.height=170*ratio;
  const ctx=canvas.getContext('2d');
  ctx.scale(ratio,ratio);
  const width=canvas.width/ratio;
  const height=170;
  const pad={left:40,right:18,top:18,bottom:26};
  const plotW=width-pad.left-pad.right;
  const plotH=height-pad.top-pad.bottom;
  const dark=document.body.classList.contains('dark');
  ctx.font='9px system-ui';
  ctx.strokeStyle=dark?'#344b44':'#e5e9e7';
  ctx.fillStyle=dark?'#9fb0aa':'#68716e';
  ctx.lineWidth=1;
  [0,1,2,3].forEach(i=>{
    const y=pad.top+(plotH/3)*i;
    ctx.beginPath();ctx.moveTo(pad.left,y);ctx.lineTo(width-pad.right,y);ctx.stroke();
    ctx.fillText(['$30K','$20K','$10K','$0'][i],2,y+3);
  });
  const bars=[9,13,20,17,21,25,21,24,18,17,28,20,21,25,26,28,27,30,24,26,24,20,21,22,24,25,24,26,19,21];
  const sales=[14,10,7,9,13,15,12,18,23,19,28,16,13,21,19,20,24,18,12,17,19,20,21,16,13,17,18,17,20,26];
  const step=plotW/(bars.length-1);
  ctx.fillStyle=dark?'#ad8f61':'#ddc092';
  bars.forEach((v,i)=>{const h=(v/30)*plotH;ctx.fillRect(pad.left+i*step-4,pad.top+plotH-h,8,h)});
  ctx.strokeStyle=dark?'#62c4a7':'#075747';ctx.lineWidth=2.2;ctx.beginPath();
  sales.forEach((v,i)=>{const x=pad.left+i*step;const y=pad.top+plotH-(v/30)*plotH;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});
  ctx.stroke();
  const labels=[['Aug 6',1],['Aug 11',6],['Aug 16',12],['Aug 21',17],['Aug 26',22],['Aug 31',27],['Sep 4',29]];
  ctx.fillStyle=dark?'#9fb0aa':'#68716e';labels.forEach(([label,i])=>ctx.fillText(label,pad.left+i*step-13,height-7));
}
window.addEventListener('resize',drawChart);
drawChart();

const dialogOpeners=document.querySelectorAll('[data-open-dialog]');
dialogOpeners.forEach(control=>control.addEventListener('click',()=>{
  const dialog=document.querySelector('#'+control.dataset.openDialog);
  if(dialog&&typeof dialog.showModal==='function') dialog.showModal();
}));
document.querySelectorAll('[data-close-dialog]').forEach(control=>control.addEventListener('click',()=>{
  const dialog=control.closest('dialog');
  if(dialog) dialog.close();
}));
document.querySelectorAll('.record-dialog').forEach(dialog=>dialog.addEventListener('click',event=>{
  if(event.target===dialog) dialog.close();
}));

const clientType=document.querySelector('#clientType');
const taxIdField=document.querySelector('#taxIdField');
const clientTaxId=document.querySelector('#clientTaxId');
function updateClientType(){
  const business=clientType.value==='business';
  taxIdField.hidden=!business;
  clientTaxId.required=business;
  clientTaxId.setAttribute('aria-required',String(business));
}
clientType.addEventListener('change',updateClientType);
updateClientType();

document.querySelector('#clientForm').addEventListener('submit',event=>{
  event.preventDefault();
  if(!event.currentTarget.reportValidity()) return;
  document.querySelector('#clientDialog').close();
  showToast('Client saved. Billing notices will use the registered email.');
  event.currentTarget.reset();
  updateClientType();
});

const productUpload=document.querySelector('#productUpload');
const productPhoto=document.querySelector('#productPhoto');
productUpload.addEventListener('click',()=>productPhoto.click());
productPhoto.addEventListener('change',()=>{
  const file=productPhoto.files&&productPhoto.files[0];
  if(file) productUpload.querySelector('strong').textContent=file.name;
});
const productStock=document.querySelector('#productStock');
document.querySelector('#stockMinus').addEventListener('click',()=>productStock.value=Math.max(0,Number(productStock.value||0)-1));
document.querySelector('#stockPlus').addEventListener('click',()=>productStock.value=Number(productStock.value||0)+1);
const productTaxToggle=document.querySelector('#productTaxToggle');
const productTaxValue=document.querySelector('#productTaxValue');
productTaxToggle.addEventListener('click',()=>{
  const on=productTaxToggle.getAttribute('aria-checked')!=='true';
  productTaxToggle.setAttribute('aria-checked',String(on));
  productTaxToggle.classList.toggle('on',on);
  productTaxValue.disabled=!on;
});
document.querySelector('#notInStock').addEventListener('change',event=>{
  productStock.disabled=event.currentTarget.checked;
  if(event.currentTarget.checked) productStock.value=0;
});
document.querySelector('#productForm').addEventListener('submit',event=>{
  event.preventDefault();
  if(!event.currentTarget.reportValidity()) return;
  document.querySelector('#productDialog').close();
  showToast('Product saved to the catalog.');
  event.currentTarget.reset();
  productStock.disabled=false;
  productTaxValue.disabled=false;
  productTaxToggle.classList.add('on');
  productTaxToggle.setAttribute('aria-checked','true');
  productUpload.querySelector('strong').textContent='Take a picture or upload';
});
