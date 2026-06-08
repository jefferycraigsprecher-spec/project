(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7177],{772:(e,t,a)=>{"use strict";a.d(t,{A:()=>n});var r=a(2115),s=a(907);let i=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,a)=>a?a.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var o=a(1265);let n=(e,t)=>{let a=(0,r.forwardRef)(({className:a,...n},l)=>(0,r.createElement)(o.default,{ref:l,iconNode:t,className:(0,s.z)(`lucide-${i(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,a),...n}));return a.displayName=i(e),a}},881:(e,t,a)=>{"use strict";a.d(t,{default:()=>s});var r=a(2115);function s(){return(0,r.useEffect)(()=>{"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js").catch(()=>{})},[]),null}},907:(e,t,a)=>{"use strict";a.d(t,{z:()=>r});let r=(...e)=>e.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim()},1265:(e,t,a)=>{"use strict";a.d(t,{default:()=>n});var r=a(2115),s={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"},i=a(907);let o=(0,r.createContext)({}),n=(0,r.forwardRef)(({color:e,size:t,strokeWidth:a,absoluteStrokeWidth:n,className:l="",children:d,iconNode:c,...u},p)=>{let{size:m=24,strokeWidth:h=2,absoluteStrokeWidth:f=!1,color:g="currentColor",className:x=""}=(0,r.useContext)(o)??{},b=n??f?24*Number(a??h)/Number(t??m):a??h;return(0,r.createElement)("svg",{ref:p,...s,width:t??m??s.width,height:t??m??s.height,stroke:e??g,strokeWidth:b,className:(0,i.z)("lucide",x,l),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,t])=>(0,r.createElement)(e,t)),...Array.isArray(d)?d:[d]])})},1743:()=>{},1959:(e,t,a)=>{Promise.resolve().then(a.t.bind(a,4879,23)),Promise.resolve().then(a.t.bind(a,4811,23)),Promise.resolve().then(a.bind(a,8434)),Promise.resolve().then(a.t.bind(a,1743,23)),Promise.resolve().then(a.bind(a,3714)),Promise.resolve().then(a.bind(a,881)),Promise.resolve().then(a.bind(a,5948))},3714:(e,t,a)=>{"use strict";a.d(t,{default:()=>i});var r=a(5155),s=a(2115);class i extends s.Component{constructor(e){super(e),this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(e,t){console.error("ErrorBoundary caught an error:",e,t)}render(){return this.state.hasError?(0,r.jsx)("div",{className:"min-h-screen flex items-center justify-center bg-slate-950 text-white px-4",children:(0,r.jsxs)("div",{className:"max-w-lg rounded-3xl border border-white/10 bg-slate-900/95 p-10 text-center shadow-2xl",children:[(0,r.jsx)("h1",{className:"text-3xl font-bold",children:"Something went wrong."}),(0,r.jsx)("p",{className:"mt-4 text-sm text-slate-300",children:"Please refresh the page or contact support if the issue persists."})]})}):this.props.children}}},4811:e=>{e.exports={style:{fontFamily:"'Oswald', 'Oswald Fallback'",fontStyle:"normal"},className:"__className_4b3a9b",variable:"__variable_4b3a9b"}},4879:e=>{e.exports={style:{fontFamily:"'Barlow', 'Barlow Fallback'",fontStyle:"normal"},className:"__className_7c7c8c",variable:"__variable_7c7c8c"}},5948:(e,t,a)=>{"use strict";a.d(t,{default:()=>m});var r=a(5155),s=a(8500),i=a.n(s),o=a(2115),n=a(9005),l=a(7932);let d=(0,a(772).A)("message-circle",[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]]);var c=a(6369),u=a(6721);let p=["Thanks for reaching out. If you need a quick answer, share your tracking ID or shipment type and I will guide you.","We can help with quotes, urgent shipments, and secure handling. Tell me what you need and I will route you to the right support path.","For immediate escalation, share your contact details and the issue summary so our team can respond quickly."];function m(){let[e,t]=(0,o.useState)(!1),[a,s]=(0,o.useState)(""),[m,h]=(0,o.useState)([{sender:"assistant",text:"Hi! I am your support assistant. Ask about tracking, quotes, or urgent help."}]),f=(0,o.useMemo)(()=>m.filter(e=>"assistant"===e.sender).length,[m]),g=()=>{let e=a.trim();if(!e)return;let t=e.toLowerCase(),r=p[f%p.length];(t.includes("track")||t.includes("tracking"))&&(r="Use the tracking page to review live status updates. I can also help you get to the right shipment details."),(t.includes("quote")||t.includes("rate"))&&(r="I can help prepare a quote request. Share origin, destination, cargo type, and your preferred timeline."),(t.includes("urgent")||t.includes("asap"))&&(r="We can prioritize urgent support immediately. Share your shipment details and I will direct you to the right specialist."),h(t=>[...t,{sender:"user",text:e},{sender:"assistant",text:r}]),s("")};return(0,r.jsxs)("div",{className:"fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3",children:[e&&(0,r.jsxs)("div",{className:"w-[22rem] max-w-[calc(100vw-2rem)] rounded-[1.5rem] border border-gray-100 bg-white shadow-[0_30px_80px_-35px_rgba(15,23,42,0.75)]",children:[(0,r.jsx)("div",{className:"rounded-t-[1.5rem] bg-slate-950 px-4 py-4 text-white",children:(0,r.jsxs)("div",{className:"flex items-start justify-between gap-4",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("p",{className:"text-[0.65rem] font-bold uppercase tracking-[0.3em] text-brand-200",children:"Support widget"}),(0,r.jsx)("h2",{className:"mt-2 text-base font-semibold",children:"Need help now?"})]}),(0,r.jsx)("button",{type:"button","aria-label":"Close support widget",onClick:()=>t(!1),className:"rounded-full bg-white/10 p-2 text-white",children:(0,r.jsx)(n.A,{className:"h-4 w-4"})})]})}),(0,r.jsxs)("div",{className:"px-4 pb-4 pt-3",children:[(0,r.jsx)("div",{className:"space-y-3",children:m.map((e,t)=>(0,r.jsx)("div",{className:`max-w-[90%] rounded-[1rem] px-3 py-2 text-sm leading-6 ${"assistant"===e.sender?"bg-gray-100 text-slate-900":"ml-auto bg-brand-500 text-slate-950"}`,children:e.text},`${e.sender}-${t}`))}),(0,r.jsxs)("div",{className:"mt-4 rounded-[1.25rem] border border-gray-100 bg-gray-50 p-3",children:[(0,r.jsxs)("div",{className:"flex items-center gap-2 text-sm font-semibold text-navy-900",children:[(0,r.jsx)(l.A,{className:"h-4 w-4 text-brand-500"}),"Need direct human support?"]}),(0,r.jsxs)("div",{className:"mt-2 flex flex-wrap gap-2 text-xs",children:[(0,r.jsxs)("a",{href:"mailto:support@midwestshipment.com",className:"inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-slate-900",children:[(0,r.jsx)(d,{className:"h-3.5 w-3.5 text-brand-500"}),"Email"]}),(0,r.jsxs)("a",{href:"tel:+16145550123",className:"inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-slate-900",children:[(0,r.jsx)(c.A,{className:"h-3.5 w-3.5 text-brand-500"}),"Call"]}),(0,r.jsxs)(i(),{href:"/support",className:"inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-slate-900",children:["Support center",(0,r.jsx)(u.A,{className:"h-3.5 w-3.5 text-brand-500"})]})]})]}),(0,r.jsxs)("div",{className:"mt-4 flex gap-2",children:[(0,r.jsx)("input",{value:a,onChange:e=>s(e.target.value),onKeyDown:e=>{"Enter"===e.key&&(e.preventDefault(),g())},placeholder:"Ask a support question",className:"flex-1 rounded-[1rem] border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"}),(0,r.jsx)("button",{type:"button",onClick:g,className:"rounded-[1rem] bg-brand-500 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950",children:"Send"})]})]})]}),(0,r.jsxs)("button",{type:"button","aria-label":"Open support chat",onClick:()=>t(e=>!e),className:"inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_20px_60px_-25px_rgba(15,23,42,0.85)]",children:[(0,r.jsx)(d,{className:"h-4 w-4 text-brand-300"}),"Support"]})]})}},6369:(e,t,a)=>{"use strict";a.d(t,{A:()=>r});let r=(0,a(772).A)("phone",[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]])},6721:(e,t,a)=>{"use strict";a.d(t,{A:()=>r});let r=(0,a(772).A)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]])},7932:(e,t,a)=>{"use strict";a.d(t,{A:()=>r});let r=(0,a(772).A)("headphones",[["path",{d:"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",key:"1xhozi"}]])},8434:(e,t,a)=>{"use strict";let r,s;a.d(t,{Toaster:()=>ee,Ay:()=>et});var i,o=a(2115);let n={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,c=/\n+/g,u=(e,t)=>{let a="",r="",s="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+o+";":r+="f"==i[1]?u(o,i):i+"{"+u(o,"k"==i[1]?"":t)+"}":"object"==typeof o?r+=u(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=u.p?u.p(i,o):i+":"+o+";")}return a+(t&&s?t+"{"+s+"}":s)+r},p={},m=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+m(e[a]);return t}return e};function h(e){let t,a,r=this||{},s=e.call?e(r.p):e;return((e,t,a,r,s)=>{var i;let o=m(e),n=p[o]||(p[o]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(o));if(!p[n]){let t=o!==e?e:(e=>{let t,a,r=[{}];for(;t=l.exec(e.replace(d,""));)t[4]?r.shift():t[3]?(a=t[3].replace(c," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(c," ").trim();return r[0]})(e);p[n]=u(s?{["@keyframes "+n]:t}:t,a?"":"."+n)}let h=a&&p.g;return a&&(p.g=p[n]),i=p[n],h?t.data=t.data.replace(h,i):-1===t.data.indexOf(i)&&(t.data=r?i+t.data:t.data+i),n})(s.unshift?s.raw?(t=[].slice.call(arguments,1),a=r.p,s.reduce((e,r,s)=>{let i=t[s];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+r+(null==i?"":i)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(r.target),r.g,r.o,r.k)}h.bind({g:1});let f,g,x,b=h.bind({k:1});function y(e,t){let a=this||{};return function(){let r=arguments;function s(i,o){let n=Object.assign({},i),l=n.className||s.className;a.p=Object.assign({theme:g&&g()},n),a.o=/go\d/.test(l),n.className=h.apply(a,r)+(l?" "+l:""),t&&(n.ref=o);let d=e;return e[0]&&(d=n.as||e,delete n.as),x&&d[0]&&x(n),f(d,n)}return t?t(s):s}}var v=(e,t)=>"function"==typeof e?e(t):e,w=(r=0,()=>(++r).toString()),k=()=>{if(void 0===s&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");s=!e||e.matches}return s},N="default",j=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return j(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},E=[],A={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},_=(e,t=N)=>{C[t]=j(C[t]||A,e),E.forEach(([e,a])=>{e===t&&a(C[t])})},$=e=>Object.keys(C).forEach(t=>_(e,t)),O=(e=N)=>t=>{_(t,e)},D={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},I=e=>(t,a)=>{let r,s=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||w()}))(t,e,a);return O(s.toasterId||(r=s.id,Object.keys(C).find(e=>C[e].toasts.some(e=>e.id===r))))({type:2,toast:s}),s.id},S=(e,t)=>I("blank")(e,t);S.error=I("error"),S.success=I("success"),S.loading=I("loading"),S.custom=I("custom"),S.dismiss=(e,t)=>{let a={type:3,toastId:e};t?O(t)(a):$(a)},S.dismissAll=e=>S.dismiss(void 0,e),S.remove=(e,t)=>{let a={type:4,toastId:e};t?O(t)(a):$(a)},S.removeAll=e=>S.remove(void 0,e),S.promise=(e,t,a)=>{let r=S.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?v(t.success,e):void 0;return s?S.success(s,{id:r,...a,...null==a?void 0:a.success}):S.dismiss(r),e}).catch(e=>{let s=t.error?v(t.error,e):void 0;s?S.error(s,{id:r,...a,...null==a?void 0:a.error}):S.dismiss(r)}),e};var z=1e3,P=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,F=b`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,L=b`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,M=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${P} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${F} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${L} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,q=b`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,T=y("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${q} 1s linear infinite;
`,W=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,H=b`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,B=y("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${W} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${H} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,R=y("div")`
  position: absolute;
`,U=y("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Z=b`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,K=y("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Z} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Y=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?o.createElement(K,null,t):t:"blank"===a?null:o.createElement(U,null,o.createElement(T,{...r}),"loading"!==a&&o.createElement(R,null,"error"===a?o.createElement(M,{...r}):o.createElement(B,{...r})))},G=y("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,J=y("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Q=o.memo(({toast:e,position:t,style:a,children:r})=>{let s=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[r,s]=k()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${b(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${b(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=o.createElement(Y,{toast:e}),n=o.createElement(J,{...e.ariaProps},v(e.message,e));return o.createElement(G,{className:e.className,style:{...s,...a,...e.style}},"function"==typeof r?r({icon:i,message:n}):o.createElement(o.Fragment,null,i,n))});i=o.createElement,u.p=void 0,f=i,g=void 0,x=void 0;var V=({id:e,className:t,style:a,onHeightUpdate:r,children:s})=>{let i=o.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return o.createElement("div",{ref:i,className:t,style:a},s)},X=h`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:s,toasterId:i,containerStyle:n,containerClassName:l})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=N)=>{let[a,r]=(0,o.useState)(C[t]||A),s=(0,o.useRef)(C[t]);(0,o.useEffect)(()=>(s.current!==C[t]&&r(C[t]),E.push([t,r]),()=>{let e=E.findIndex(([e])=>e===t);e>-1&&E.splice(e,1)}),[t]);let i=a.toasts.map(t=>{var a,r,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||D[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...a,toasts:i}})(e,t),s=(0,o.useRef)(new Map).current,i=(0,o.useCallback)((e,t=z)=>{if(s.has(e))return;let a=setTimeout(()=>{s.delete(e),n({type:4,toastId:e})},t);s.set(e,a)},[]);(0,o.useEffect)(()=>{if(r)return;let e=Date.now(),s=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&S.dismiss(a.id);return}return setTimeout(()=>S.dismiss(a.id,t),r)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let n=(0,o.useCallback)(O(t),[t]),l=(0,o.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),d=(0,o.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),c=(0,o.useCallback)(()=>{r&&n({type:6,time:Date.now()})},[r,n]),u=(0,o.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:s=8,defaultPosition:i}=t||{},o=a.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...r?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+s,0)},[a]);return(0,o.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=s.get(e.id);t&&(clearTimeout(t),s.delete(e.id))}})},[a,i]),{toasts:a,handlers:{updateHeight:d,startPause:l,endPause:c,calculateOffset:u}}})(a,i);return o.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(a=>{let i,n,l=a.position||t,d=c.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),u=(i=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:k()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...n});return o.createElement(V,{id:a.id,key:a.id,onHeightUpdate:c.updateHeight,className:a.visible?X:"",style:u},"custom"===a.type?v(a.message,a):s?s(a):o.createElement(Q,{toast:a,position:l}))}))},et=S},9005:(e,t,a)=>{"use strict";a.d(t,{A:()=>r});let r=(0,a(772).A)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]])}},e=>{e.O(0,[5822,8500,8441,3794,7358],()=>e(e.s=1959)),_N_E=e.O()}]);