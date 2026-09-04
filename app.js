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
