(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[357],{397:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>f});var a=s(5155),r=s(2115),i=s(8500),o=s.n(i),l=s(3321),n=s(2849),c=s(3089),d=s(5796);let u=(0,s(772).A)("lock-keyhole",[["circle",{cx:"12",cy:"16",r:"1",key:"1au0dj"}],["rect",{x:"3",y:"10",width:"18",height:"12",rx:"2",key:"6s8ecr"}],["path",{d:"M7 10V7a5 5 0 0 1 10 0v3",key:"1pqi11"}]]);var p=s(861),m=s(8434);function f(){let e=(0,l.useRouter)(),[t,s]=(0,r.useState)({email:"",password:""}),[i,f]=(0,r.useState)(!1);(0,r.useEffect)(()=>{n.A.get("msc_customer_token")&&e.replace("/customer/dashboard")},[e]);let h=async s=>{s.preventDefault(),f(!0);try{let s=await p.A.post("/customers/login",t);n.A.set("msc_customer_token",s.data.token,{expires:7}),m.Ay.success("Welcome back."),e.push("/customer/dashboard")}catch(e){m.Ay.error(e.response?.data?.message||"Unable to login.")}finally{f(!1)}};return(0,a.jsxs)("main",{className:"grid min-h-screen bg-slate-100 lg:grid-cols-[0.9fr_1.1fr]",children:[(0,a.jsxs)("section",{className:"hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between",children:[(0,a.jsxs)(o(),{href:"/",className:"flex items-center gap-3",children:[(0,a.jsx)("div",{className:"bg-brand-500 p-2",children:(0,a.jsx)(c.A,{className:"h-5 w-5"})}),(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"font-display text-lg uppercase",children:"Midwest"}),(0,a.jsx)("p",{className:"text-xs uppercase tracking-[0.25em] text-brand-300",children:"Shipment Company"})]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("p",{className:"section-subtitle text-brand-300",children:"Customer access"}),(0,a.jsx)("h1",{className:"mt-4 font-display text-5xl uppercase leading-tight",children:"Track every shipment from one secure dashboard."}),(0,a.jsx)("p",{className:"mt-5 max-w-xl text-slate-300",children:"View shipment history, upload delivery documents, monitor notifications, and contact support."})]})]}),(0,a.jsx)("section",{className:"flex items-center justify-center px-4 py-10",children:(0,a.jsxs)("form",{onSubmit:h,className:"w-full max-w-md border border-gray-100 bg-white p-6 shadow-sm",children:[(0,a.jsx)("p",{className:"section-subtitle",children:"Customer login"}),(0,a.jsx)("h2",{className:"mt-2 font-display text-3xl uppercase text-navy-900",children:"Welcome back"}),(0,a.jsxs)("label",{className:"mt-6 block",children:[(0,a.jsx)("span",{className:"label",children:"Email"}),(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)(d.A,{className:"absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"}),(0,a.jsx)("input",{type:"email",required:!0,value:t.email,onChange:e=>s({...t,email:e.target.value}),className:"input-field pl-10"})]})]}),(0,a.jsxs)("label",{className:"mt-4 block",children:[(0,a.jsx)("span",{className:"label",children:"Password"}),(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)(u,{className:"absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"}),(0,a.jsx)("input",{type:"password",required:!0,value:t.password,onChange:e=>s({...t,password:e.target.value}),className:"input-field pl-10"})]})]}),(0,a.jsx)("button",{disabled:i,className:"btn-primary mt-6 w-full justify-center",children:i?"Signing in...":"Login"}),(0,a.jsxs)("div",{className:"mt-5 flex flex-wrap justify-between gap-3 text-sm",children:[(0,a.jsx)(o(),{href:"/customer/register",className:"font-semibold text-brand-600",children:"Create account"}),(0,a.jsx)(o(),{href:"/customer/forgot-password",className:"font-semibold text-navy-700",children:"Forgot password?"})]})]})})]})}},772:(e,t,s)=>{"use strict";s.d(t,{A:()=>l});var a=s(2115),r=s(907);let i=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,s)=>s?s.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var o=s(1265);let l=(e,t)=>{let s=(0,a.forwardRef)(({className:s,...l},n)=>(0,a.createElement)(o.default,{ref:n,iconNode:t,className:(0,r.z)(`lucide-${i(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...l}));return s.displayName=i(e),s}},861:(e,t,s)=>{"use strict";s.d(t,{A:()=>o});var a=s(1766),r=s(2849);let i=a.A.create({baseURL:"http://localhost:5000/api",timeout:15e3});i.interceptors.request.use(e=>{let t=r.A.get("msc_customer_token");return t&&(e.headers.Authorization=`Bearer ${t}`),e}),i.interceptors.response.use(e=>e,e=>(e.response?.status===401&&(r.A.remove("msc_customer_token"),window.location.pathname.startsWith("/customer")&&"/customer/login"!==window.location.pathname&&(window.location.href="/customer/login")),Promise.reject(e)));let o=i},907:(e,t,s)=>{"use strict";s.d(t,{z:()=>a});let a=(...e)=>e.filter((e,t,s)=>!!e&&""!==e.trim()&&s.indexOf(e)===t).join(" ").trim()},1265:(e,t,s)=>{"use strict";s.d(t,{default:()=>l});var a=s(2115),r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"},i=s(907);let o=(0,a.createContext)({}),l=(0,a.forwardRef)(({color:e,size:t,strokeWidth:s,absoluteStrokeWidth:l,className:n="",children:c,iconNode:d,...u},p)=>{let{size:m=24,strokeWidth:f=2,absoluteStrokeWidth:h=!1,color:g="currentColor",className:y=""}=(0,a.useContext)(o)??{},x=l??h?24*Number(s??f)/Number(t??m):s??f;return(0,a.createElement)("svg",{ref:p,...r,width:t??m??r.width,height:t??m??r.height,stroke:e??g,strokeWidth:x,className:(0,i.z)("lucide",y,n),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,t])=>(0,a.createElement)(e,t)),...Array.isArray(c)?c:[c]])})},3089:(e,t,s)=>{"use strict";s.d(t,{A:()=>a});let a=(0,s(772).A)("package",[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]])},3321:(e,t,s)=>{"use strict";var a=s(4645);s.o(a,"useParams")&&s.d(t,{useParams:function(){return a.useParams}}),s.o(a,"usePathname")&&s.d(t,{usePathname:function(){return a.usePathname}}),s.o(a,"useRouter")&&s.d(t,{useRouter:function(){return a.useRouter}}),s.o(a,"useSearchParams")&&s.d(t,{useSearchParams:function(){return a.useSearchParams}})},5796:(e,t,s)=>{"use strict";s.d(t,{A:()=>a});let a=(0,s(772).A)("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]])},8361:(e,t,s)=>{Promise.resolve().then(s.bind(s,397))},8434:(e,t,s)=>{"use strict";let a,r;s.d(t,{Toaster:()=>ee,Ay:()=>et});var i,o=s(2115);let l={data:""},n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,c=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,u=(e,t)=>{let s="",a="",r="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?s=i+" "+o+";":a+="f"==i[1]?u(o,i):i+"{"+u(o,"k"==i[1]?"":t)+"}":"object"==typeof o?a+=u(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=u.p?u.p(i,o):i+":"+o+";")}return s+(t&&r?t+"{"+r+"}":r)+a},p={},m=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+m(e[s]);return t}return e};function f(e){let t,s,a=this||{},r=e.call?e(a.p):e;return((e,t,s,a,r)=>{var i;let o=m(e),l=p[o]||(p[o]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(o));if(!p[l]){let t=o!==e?e:(e=>{let t,s,a=[{}];for(;t=n.exec(e.replace(c,""));)t[4]?a.shift():t[3]?(s=t[3].replace(d," ").trim(),a.unshift(a[0][s]=a[0][s]||{})):a[0][t[1]]=t[2].replace(d," ").trim();return a[0]})(e);p[l]=u(r?{["@keyframes "+l]:t}:t,s?"":"."+l)}let f=s&&p.g;return s&&(p.g=p[l]),i=p[l],f?t.data=t.data.replace(f,i):-1===t.data.indexOf(i)&&(t.data=a?i+t.data:t.data+i),l})(r.unshift?r.raw?(t=[].slice.call(arguments,1),s=a.p,r.reduce((e,a,r)=>{let i=t[r];if(i&&i.call){let e=i(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"")):r.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):r,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||l})(a.target),a.g,a.o,a.k)}f.bind({g:1});let h,g,y,x=f.bind({k:1});function b(e,t){let s=this||{};return function(){let a=arguments;function r(i,o){let l=Object.assign({},i),n=l.className||r.className;s.p=Object.assign({theme:g&&g()},l),s.o=/go\d/.test(n),l.className=f.apply(s,a)+(n?" "+n:""),t&&(l.ref=o);let c=e;return e[0]&&(c=l.as||e,delete l.as),y&&c[0]&&y(l),h(c,l)}return t?t(r):r}}var v=(e,t)=>"function"==typeof e?e(t):e,w=(a=0,()=>(++a).toString()),k=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},j="default",N=(e,t)=>{let{toastLimit:s}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,s)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return N(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},A=[],E={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},$=(e,t=j)=>{C[t]=N(C[t]||E,e),A.forEach(([e,s])=>{e===t&&s(C[t])})},_=e=>Object.keys(C).forEach(t=>$(e,t)),P=(e=j)=>t=>{$(t,e)},z={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},O=e=>(t,s)=>{let a,r=((e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||w()}))(t,e,s);return P(r.toasterId||(a=r.id,Object.keys(C).find(e=>C[e].toasts.some(e=>e.id===a))))({type:2,toast:r}),r.id},D=(e,t)=>O("blank")(e,t);D.error=O("error"),D.success=O("success"),D.loading=O("loading"),D.custom=O("custom"),D.dismiss=(e,t)=>{let s={type:3,toastId:e};t?P(t)(s):_(s)},D.dismissAll=e=>D.dismiss(void 0,e),D.remove=(e,t)=>{let s={type:4,toastId:e};t?P(t)(s):_(s)},D.removeAll=e=>D.remove(void 0,e),D.promise=(e,t,s)=>{let a=D.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?v(t.success,e):void 0;return r?D.success(r,{id:a,...s,...null==s?void 0:s.success}):D.dismiss(a),e}).catch(e=>{let r=t.error?v(t.error,e):void 0;r?D.error(r,{id:a,...s,...null==s?void 0:s.error}):D.dismiss(a)}),e};var S=1e3,L=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,I=x`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,M=x`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,R=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${L} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${I} 0.15s ease-out forwards;
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
    animation: ${M} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,q=x`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,T=b("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${q} 1s linear infinite;
`,W=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,F=x`
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
}`,U=b("div")`
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
    animation: ${F} 0.2s ease-out forwards;
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
`,H=b("div")`
  position: absolute;
`,V=b("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,B=x`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Z=b("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${B} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Y=({toast:e})=>{let{icon:t,type:s,iconTheme:a}=e;return void 0!==t?"string"==typeof t?o.createElement(Z,null,t):t:"blank"===s?null:o.createElement(V,null,o.createElement(T,{...a}),"loading"!==s&&o.createElement(H,null,"error"===s?o.createElement(R,{...a}):o.createElement(U,{...a})))},G=b("div")`
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
`,J=b("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,K=o.memo(({toast:e,position:t,style:s,children:a})=>{let r=e.height?((e,t)=>{let s=e.includes("top")?1:-1,[a,r]=k()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*s}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*s}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${x(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${x(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=o.createElement(Y,{toast:e}),l=o.createElement(J,{...e.ariaProps},v(e.message,e));return o.createElement(G,{className:e.className,style:{...r,...s,...e.style}},"function"==typeof a?a({icon:i,message:l}):o.createElement(o.Fragment,null,i,l))});i=o.createElement,u.p=void 0,h=i,g=void 0,y=void 0;var Q=({id:e,className:t,style:s,onHeightUpdate:a,children:r})=>{let i=o.useCallback(t=>{if(t){let s=()=>{a(e,t.getBoundingClientRect().height)};s(),new MutationObserver(s).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return o.createElement("div",{ref:i,className:t,style:s},r)},X=f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:s,gutter:a,children:r,toasterId:i,containerStyle:l,containerClassName:n})=>{let{toasts:c,handlers:d}=((e,t="default")=>{let{toasts:s,pausedAt:a}=((e={},t=j)=>{let[s,a]=(0,o.useState)(C[t]||E),r=(0,o.useRef)(C[t]);(0,o.useEffect)(()=>(r.current!==C[t]&&a(C[t]),A.push([t,a]),()=>{let e=A.findIndex(([e])=>e===t);e>-1&&A.splice(e,1)}),[t]);let i=s.toasts.map(t=>{var s,a,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(s=e[t.type])?void 0:s.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||z[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...s,toasts:i}})(e,t),r=(0,o.useRef)(new Map).current,i=(0,o.useCallback)((e,t=S)=>{if(r.has(e))return;let s=setTimeout(()=>{r.delete(e),l({type:4,toastId:e})},t);r.set(e,s)},[]);(0,o.useEffect)(()=>{if(a)return;let e=Date.now(),r=s.map(s=>{if(s.duration===1/0)return;let a=(s.duration||0)+s.pauseDuration-(e-s.createdAt);if(a<0){s.visible&&D.dismiss(s.id);return}return setTimeout(()=>D.dismiss(s.id,t),a)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[s,a,t]);let l=(0,o.useCallback)(P(t),[t]),n=(0,o.useCallback)(()=>{l({type:5,time:Date.now()})},[l]),c=(0,o.useCallback)((e,t)=>{l({type:1,toast:{id:e,height:t}})},[l]),d=(0,o.useCallback)(()=>{a&&l({type:6,time:Date.now()})},[a,l]),u=(0,o.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:r=8,defaultPosition:i}=t||{},o=s.filter(t=>(t.position||i)===(e.position||i)&&t.height),l=o.findIndex(t=>t.id===e.id),n=o.filter((e,t)=>t<l&&e.visible).length;return o.filter(e=>e.visible).slice(...a?[n+1]:[0,n]).reduce((e,t)=>e+(t.height||0)+r,0)},[s]);return(0,o.useEffect)(()=>{s.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=r.get(e.id);t&&(clearTimeout(t),r.delete(e.id))}})},[s,i]),{toasts:s,handlers:{updateHeight:c,startPause:n,endPause:d,calculateOffset:u}}})(s,i);return o.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...l},className:n,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(s=>{let i,l,n=s.position||t,c=d.calculateOffset(s,{reverseOrder:e,gutter:a,defaultPosition:t}),u=(i=n.includes("top"),l=n.includes("center")?{justifyContent:"center"}:n.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:k()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...l});return o.createElement(Q,{id:s.id,key:s.id,onHeightUpdate:d.updateHeight,className:s.visible?X:"",style:u},"custom"===s.type?v(s.message,s):r?r(s):o.createElement(K,{toast:s,position:n}))}))},et=D}},e=>{e.O(0,[8500,1518,8441,3794,7358],()=>e(e.s=8361)),_N_E=e.O()}]);