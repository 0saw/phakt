const e=100,t=100,n=(e,t,n)=>{const o=document.createElement("div");return o.className="piece",o.style.cssText=`\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100px;\n    height: 100px;\n    background-image: url(${e});\n    background-position: ${-100*t}px ${-100*n}px;\n    background-size: 300% 300%;\n    transform: translate(0, 0);\n    pointer-events: none;\n  `,o};let o=1;(async()=>{const r=document.querySelector(".game"),i=document.querySelector(".game__area"),s=document.querySelector(".game__bag");if(null===r||null===i||null===s)return;i.style.width="300px",i.style.height="300px";const a=new Array;for(let e=0;e<3;e++)for(let t=0;t<3;t++)a.push(n("https://picsum.photos/300/300",t,e));const l=new Array(a.length).fill(null),c=[...a];c.sort((()=>.5-Math.random())),s.innerText=`x${c.length}`,r.addEventListener("pointerdown",(n=>{let p,m=-50,d=-50;const g=s.getBoundingClientRect(),u=i.getBoundingClientRect(),h=(e,t)=>e>=g.left&&e<=g.right&&t>=g.top&&t<=g.bottom;if(n.target instanceof HTMLDivElement&&n.target.classList.contains("piece"))p=n.target,m=-n.offsetX,d=-n.offsetY,l.includes(p)&&(l[l.indexOf(p)]=null);else{if(n.target!==s)return;const e=c.pop();if(s.innerText=`x${c.length}`,void 0===e)return;p=e,r.append(e)}p.style.zIndex=""+o++;const x=n=>{s.classList.toggle("game__bag--active",h(n.x,n.y)),p.style.transform=`translate(${Math.min(window.innerWidth-e,Math.max(0,n.x+m))}px, ${Math.min(window.innerHeight-t,Math.max(0,n.y+d))}px)`};x(n);const f=n=>{n.stopPropagation(),n.stopImmediatePropagation(),r.removeEventListener("pointermove",x),r.removeEventListener("pointerout",v),r.removeEventListener("pointerup",f);const o=h(n.x,n.y);p.style.pointerEvents=o?"none":"",o&&(c.unshift(p),p.remove(),s.classList.remove("game__bag--active")),s.innerText=`x${c.length}`;const i=n.x+m+50-u.x,g=n.y+d+50-u.y,y=Math.floor(i/u.width*3),w=Math.floor(g/u.height*3);null===l[3*w+y]&&i>=0&&i<=u.width&&g>=0&&g<=u.height&&((y*e+50-i)**2+(w*t+50-g)**2)**.5<24&&(l[3*w+y]=p,p.style.transform=`translate(${u.left+y*e}px, ${u.top+w*t}px)`),l.every(((e,t)=>a[t]===e))&&setTimeout((()=>alert("Win, lmao")),10),m=-50,d=-50},v=e=>{e.relatedTarget===document.documentElement&&f(e)};r.addEventListener("pointermove",x),r.addEventListener("pointerout",v),r.addEventListener("pointerup",f)}))})();
//# sourceMappingURL=index.d4472462.js.map
