"use strict";
window.MarxiaLedger=(()=>{
const TODAY=new Date("2026-08-30T12:00:00-05:00");
const iso=d=>d.toISOString().slice(0,10);
const money=n=>Math.round(n*100)/100;
const seedFor=d=>Number(d.replaceAll("-",""));
const ledger=[];
const add=(date,type,account,amount,reference,meta={})=>ledger.push(Object.freeze({id:"MX-"+String(ledger.length+1).padStart(6,"0"),date,type,account,amount:money(amount),reference,meta:Object.freeze(meta)}));
for(let d=new Date("2025-01-01T12:00:00-05:00");d<=TODAY;d.setDate(d.getDate()+1)){
 const date=iso(d),seed=seedFor(date),weekday=d.getDay();
 if(weekday!==0){
  const units=5+(seed%13),price=8+(seed%9),sales=units*price;
  add(date,"sale","sales",sales,"INV-"+date.replaceAll("-","")+"-A",{units});
  add(date,"vat-collected","vatPayable",sales*.15,"VAT-"+date.replaceAll("-",""),{units});
  add(date,"cogs","cogs",sales*.46,"COGS-"+date.replaceAll("-",""),{units});
  add(date,"inventory-out","inventory",-sales*.46,"STK-"+date.replaceAll("-",""),{units});
  if(seed%9===0){add(date,"return","returns",price,"RET-"+date.replaceAll("-",""),{units:1});add(date,"inventory-in","inventory",price*.46,"RST-"+date.replaceAll("-",""),{units:1})}
 }
 if(d.getDate()===1){add(date,"expense","rent",780,"RENT-"+date.slice(0,7));add(date,"expense","utilities",115+(seed%45),"UTIL-"+date.slice(0,7));add(date,"purchase","inventory",1350+(seed%400),"PO-"+date.slice(0,7));add(date,"vat-credit","vatCredit",(1350+(seed%400))*.15,"VATC-"+date.slice(0,7))}
 if(d.getDate()===15)add(date,"expense","salary",1250,"PAY-"+date.slice(0,7));
 if(d.getDate()===20)add(date,"owner-withdrawal","withdrawals",300,"DRAW-"+date.slice(0,7));
}
add("2025-01-01","capital","openingCapital",18000,"CAP-OPEN");
add("2026-02-10","capital","contributions",2500,"CAP-2026-01");
const between=(from,to)=>ledger.filter(x=>x.date>=from&&x.date<=to);
const summarize=items=>{
 const sum=(...accounts)=>money(items.filter(x=>accounts.includes(x.account)).reduce((a,x)=>a+x.amount,0));
 const sales=sum("sales"),returns=sum("returns"),netSales=money(sales-returns),cogs=sum("cogs"),grossProfit=money(netSales-cogs),expenses=sum("rent","utilities","salary","repairs"),taxCollected=sum("vatPayable"),taxCredit=sum("vatCredit"),netProfit=money(grossProfit-expenses),inventory=money(sum("inventory"));
 return{sales,returns,netSales,cogs,grossProfit,expenses,netProfit,inventory,taxCollected,taxCredit,vatPosition:money(taxCollected-taxCredit),receivables:money(netSales*.18),payables:money(expenses*.12),openingCapital:sum("openingCapital"),contributions:sum("contributions"),withdrawals:sum("withdrawals"),closingEquity:money(sum("openingCapital","contributions")+netProfit-sum("withdrawals")),transactions:items.length};
};
return Object.freeze({TODAY,all:()=>[...ledger],between,summarize});
})();