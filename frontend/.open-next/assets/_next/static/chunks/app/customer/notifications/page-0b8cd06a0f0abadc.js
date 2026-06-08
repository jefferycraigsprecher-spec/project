(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2724,4548],{148:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>d});var s=r(5155),a=r(2115),i=r(7745),o=r(5012),n=r(861),l=r(8599),c=r(8434);function d(){let[e,t]=(0,a.useState)([]),[r,d]=(0,a.useState)(!0),u=async()=>{d(!0);try{let e=await n.A.get("/customers/notifications");t(e.data.notifications||[])}catch{c.Ay.error("Unable to load notifications.")}finally{d(!1)}};(0,a.useEffect)(()=>{u()},[]);let p=async e=>{await n.A.put(`/customers/notifications/${e}/read`),await u()};return(0,s.jsx)(i.A,{children:(0,s.jsxs)("div",{className:"space-y-6",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"section-subtitle",children:"Notification center"}),(0,s.jsx)("h1",{className:"section-title text-3xl",children:"Notifications"})]}),(0,s.jsx)("div",{className:"border border-gray-100 bg-white p-5 shadow-sm",children:r?(0,s.jsx)("div",{className:"flex justify-center p-8",children:(0,s.jsx)(o.A,{size:"lg"})}):(0,s.jsx)("div",{className:"space-y-3",children:0===e.length?(0,s.jsx)("p",{className:"text-sm text-gray-500",children:"No notifications."}):e.map(e=>(0,s.jsx)("div",{className:`border p-4 ${e.is_read?"border-gray-100 bg-white":"border-brand-200 bg-brand-50"}`,children:(0,s.jsxs)("div",{className:"flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"font-semibold text-navy-900",children:e.title}),(0,s.jsx)("p",{className:"mt-1 text-sm text-gray-600",children:e.message}),(0,s.jsx)("p",{className:"mt-2 text-xs uppercase tracking-[0.16em] text-gray-400",children:(0,l.r6)(e.created_at)})]}),!e.is_read&&(0,s.jsx)("button",{onClick:()=>p(e.id),className:"text-sm font-semibold text-brand-600",children:"Mark read"})]})},e.id))})})]})})}},772:(e,t,r)=>{"use strict";r.d(t,{A:()=>n});var s=r(2115),a=r(907);let i=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var o=r(1265);let n=(e,t)=>{let r=(0,s.forwardRef)(({className:r,...n},l)=>(0,s.createElement)(o.default,{ref:l,iconNode:t,className:(0,a.z)(`lucide-${i(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,r),...n}));return r.displayName=i(e),r}},861:(e,t,r)=>{"use strict";r.d(t,{A:()=>o});var s=r(1766),a=r(2849);let i=s.A.create({baseURL:"http://localhost:5000/api",timeout:15e3});i.interceptors.request.use(e=>{let t=a.A.get("msc_customer_token");return t&&(e.headers.Authorization=`Bearer ${t}`),e}),i.interceptors.response.use(e=>e,e=>(e.response?.status===401&&(a.A.remove("msc_customer_token"),window.location.pathname.startsWith("/customer")&&"/customer/login"!==window.location.pathname&&(window.location.href="/customer/login")),Promise.reject(e)));let o=i},907:(e,t,r)=>{"use strict";r.d(t,{z:()=>s});let s=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim()},1265:(e,t,r)=>{"use strict";r.d(t,{default:()=>n});var s=r(2115),a={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"},i=r(907);let o=(0,s.createContext)({}),n=(0,s.forwardRef)(({color:e,size:t,strokeWidth:r,absoluteStrokeWidth:n,className:l="",children:c,iconNode:d,...u},p)=>{let{size:m=24,strokeWidth:h=2,absoluteStrokeWidth:f=!1,color:y="currentColor",className:x=""}=(0,s.useContext)(o)??{},g=n??f?24*Number(r??h)/Number(t??m):r??h;return(0,s.createElement)("svg",{ref:p,...a,width:t??m??a.width,height:t??m??a.height,stroke:e??y,strokeWidth:g,className:(0,i.z)("lucide",x,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,t])=>(0,s.createElement)(e,t)),...Array.isArray(c)?c:[c]])})},2560:(e,t,r)=>{Promise.resolve().then(r.bind(r,148))},3089:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(772).A)("package",[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]])},3321:(e,t,r)=>{"use strict";var s=r(4645);r.o(s,"useParams")&&r.d(t,{useParams:function(){return s.useParams}}),r.o(s,"usePathname")&&r.d(t,{usePathname:function(){return s.usePathname}}),r.o(s,"useRouter")&&r.d(t,{useRouter:function(){return s.useRouter}}),r.o(s,"useSearchParams")&&r.d(t,{useSearchParams:function(){return s.useSearchParams}})},3488:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(772).A)("truck",[["path",{d:"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",key:"wrbu53"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["path",{d:"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",key:"lysw3i"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}]])},5012:(e,t,r)=>{"use strict";r.d(t,{A:()=>a});var s=r(5155);function a({size:e="md"}){return(0,s.jsx)("div",{className:`${{sm:"w-4 h-4",md:"w-8 h-8",lg:"w-12 h-12"}[e]} border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin`})}},5298:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(772).A)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]])},6304:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(772).A)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]])},6483:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(772).A)("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]])},7428:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(772).A)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]])},7745:(e,t,r)=>{"use strict";r.d(t,{A:()=>k});var s=r(5155),a=r(2115),i=r(8500),o=r.n(i),n=r(3321),l=r(2849),c=r(9960),d=r(3488),u=r(6483),p=r(5298),m=r(7932),h=r(8074),f=r(3089),y=r(7428),x=r(9005),g=r(6304),b=r(861),v=r(8599);let w=[{href:"/customer/dashboard",icon:c.A,label:"Overview"},{href:"/customer/shipments",icon:d.A,label:"Shipments"},{href:"/customer/documents",icon:u.A,label:"Documents"},{href:"/customer/notifications",icon:p.A,label:"Notifications"},{href:"/customer/support",icon:m.A,label:"Support"},{href:"/customer/profile",icon:h.A,label:"Profile"}];function k({children:e}){let t=(0,n.usePathname)(),r=(0,n.useRouter)(),[i,c]=(0,a.useState)(null),[d,u]=(0,a.useState)(!1);return(0,a.useEffect)(()=>{l.A.get("msc_customer_token")?b.A.get("/customers/me").then(e=>c(e.data.customer)).catch(()=>{l.A.remove("msc_customer_token"),r.push("/customer/login")}):r.push("/customer/login")},[r]),(0,s.jsxs)("div",{className:"flex min-h-screen bg-slate-100",children:[(0,s.jsxs)("aside",{className:(0,v.cn)("fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 transition-transform lg:static lg:translate-x-0",d?"translate-x-0":"-translate-x-full"),children:[(0,s.jsx)("div",{className:"border-b border-white/10 px-5 py-5",children:(0,s.jsxs)(o(),{href:"/customer/dashboard",className:"flex items-center gap-3",children:[(0,s.jsx)("div",{className:"bg-brand-500 p-2 text-white",children:(0,s.jsx)(f.A,{className:"h-5 w-5"})}),(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"font-display text-sm font-bold uppercase text-white",children:"Midwest"}),(0,s.jsx)("p",{className:"text-[0.65rem] font-bold uppercase tracking-[0.25em] text-brand-300",children:"Customer Portal"})]})]})}),(0,s.jsx)("nav",{className:"flex-1 space-y-1 px-3 py-4",children:w.map(({href:e,icon:r,label:a})=>(0,s.jsxs)(o(),{href:e,onClick:()=>u(!1),className:(0,v.cn)("flex items-center gap-3 px-3 py-3 text-sm font-semibold uppercase tracking-wide transition-colors",t.startsWith(e)?"bg-brand-500 text-white":"text-slate-400 hover:bg-white/10 hover:text-white"),children:[(0,s.jsx)(r,{className:"h-4 w-4"}),a]},e))}),(0,s.jsxs)("div",{className:"border-t border-white/10 p-4",children:[i&&(0,s.jsxs)("div",{className:"mb-3 flex items-center gap-3",children:[(0,s.jsx)("div",{className:"flex h-9 w-9 items-center justify-center bg-brand-500 font-bold text-white",children:i.name.charAt(0).toUpperCase()}),(0,s.jsxs)("div",{className:"min-w-0",children:[(0,s.jsx)("p",{className:"truncate text-sm font-semibold text-white",children:i.name}),(0,s.jsx)("p",{className:"truncate text-xs text-slate-400",children:i.email})]})]}),(0,s.jsxs)("button",{onClick:()=>{l.A.remove("msc_customer_token"),r.push("/customer/login")},className:"flex w-full items-center justify-center gap-2 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-red-500 hover:text-white",children:[(0,s.jsx)(y.A,{className:"h-4 w-4"}),"Logout"]})]})]}),d&&(0,s.jsx)("button",{"aria-label":"Close menu",className:"fixed inset-0 z-40 bg-black/50 lg:hidden",onClick:()=>u(!1)}),(0,s.jsxs)("div",{className:"flex min-w-0 flex-1 flex-col",children:[(0,s.jsxs)("header",{className:"flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3",children:[(0,s.jsx)("button",{onClick:()=>u(e=>!e),className:"p-2 text-slate-600 lg:hidden",children:d?(0,s.jsx)(x.A,{className:"h-5 w-5"}):(0,s.jsx)(g.A,{className:"h-5 w-5"})}),(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"text-xs font-bold uppercase tracking-[0.25em] text-brand-500",children:"Customer dashboard"}),(0,s.jsx)("p",{className:"text-sm text-slate-500",children:"Track shipments, manage documents, and contact support."})]}),(0,s.jsx)(o(),{href:"/track",className:"hidden bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white sm:inline-flex",children:"Track"})]}),(0,s.jsx)("main",{className:"flex-1 overflow-auto p-4 md:p-6",children:e})]})]})}},7932:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(772).A)("headphones",[["path",{d:"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",key:"1xhozi"}]])},8074:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(772).A)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]])},8434:(e,t,r)=>{"use strict";let s,a;r.d(t,{Toaster:()=>ee,Ay:()=>et});var i,o=r(2115);let n={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,c=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,u=(e,t)=>{let r="",s="",a="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+o+";":s+="f"==i[1]?u(o,i):i+"{"+u(o,"k"==i[1]?"":t)+"}":"object"==typeof o?s+=u(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=u.p?u.p(i,o):i+":"+o+";")}return r+(t&&a?t+"{"+a+"}":a)+s},p={},m=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+m(e[r]);return t}return e};function h(e){let t,r,s=this||{},a=e.call?e(s.p):e;return((e,t,r,s,a)=>{var i;let o=m(e),n=p[o]||(p[o]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(o));if(!p[n]){let t=o!==e?e:(e=>{let t,r,s=[{}];for(;t=l.exec(e.replace(c,""));)t[4]?s.shift():t[3]?(r=t[3].replace(d," ").trim(),s.unshift(s[0][r]=s[0][r]||{})):s[0][t[1]]=t[2].replace(d," ").trim();return s[0]})(e);p[n]=u(a?{["@keyframes "+n]:t}:t,r?"":"."+n)}let h=r&&p.g;return r&&(p.g=p[n]),i=p[n],h?t.data=t.data.replace(h,i):-1===t.data.indexOf(i)&&(t.data=s?i+t.data:t.data+i),n})(a.unshift?a.raw?(t=[].slice.call(arguments,1),r=s.p,a.reduce((e,s,a)=>{let i=t[a];if(i&&i.call){let e=i(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+s+(null==i?"":i)},"")):a.reduce((e,t)=>Object.assign(e,t&&t.call?t(s.p):t),{}):a,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(s.target),s.g,s.o,s.k)}h.bind({g:1});let f,y,x,g=h.bind({k:1});function b(e,t){let r=this||{};return function(){let s=arguments;function a(i,o){let n=Object.assign({},i),l=n.className||a.className;r.p=Object.assign({theme:y&&y()},n),r.o=/go\d/.test(l),n.className=h.apply(r,s)+(l?" "+l:""),t&&(n.ref=o);let c=e;return e[0]&&(c=n.as||e,delete n.as),x&&c[0]&&x(n),f(c,n)}return t?t(a):a}}var v=(e,t)=>"function"==typeof e?e(t):e,w=(s=0,()=>(++s).toString()),k=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},A="default",j=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:s}=t;return j(e,{type:+!!e.toasts.find(e=>e.id===s.id),toast:s});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},N=[],_={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},E=(e,t=A)=>{C[t]=j(C[t]||_,e),N.forEach(([e,r])=>{e===t&&r(C[t])})},M=e=>Object.keys(C).forEach(t=>E(e,t)),S=(e=A)=>t=>{E(t,e)},$={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},P=e=>(t,r)=>{let s,a=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||w()}))(t,e,r);return S(a.toasterId||(s=a.id,Object.keys(C).find(e=>C[e].toasts.some(e=>e.id===s))))({type:2,toast:a}),a.id},z=(e,t)=>P("blank")(e,t);z.error=P("error"),z.success=P("success"),z.loading=P("loading"),z.custom=P("custom"),z.dismiss=(e,t)=>{let r={type:3,toastId:e};t?S(t)(r):M(r)},z.dismissAll=e=>z.dismiss(void 0,e),z.remove=(e,t)=>{let r={type:4,toastId:e};t?S(t)(r):M(r)},z.removeAll=e=>z.remove(void 0,e),z.promise=(e,t,r)=>{let s=z.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let a=t.success?v(t.success,e):void 0;return a?z.success(a,{id:s,...r,...null==r?void 0:r.success}):z.dismiss(s),e}).catch(e=>{let a=t.error?v(t.error,e):void 0;a?z.error(a,{id:s,...r,...null==r?void 0:r.error}):z.dismiss(s)}),e};var D=1e3,O=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,H=g`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,L=g`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,I=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${O} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${H} 0.15s ease-out forwards;
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
`,R=g`
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
  animation: ${R} 1s linear infinite;
`,U=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,q=g`
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
}`,F=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${U} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${q} 0.2s ease-out forwards;
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
`,W=b("div")`
  position: absolute;
`,V=b("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Z=g`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,B=b("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Z} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Y=({toast:e})=>{let{icon:t,type:r,iconTheme:s}=e;return void 0!==t?"string"==typeof t?o.createElement(B,null,t):t:"blank"===r?null:o.createElement(V,null,o.createElement(T,{...s}),"loading"!==r&&o.createElement(W,null,"error"===r?o.createElement(I,{...s}):o.createElement(F,{...s})))},G=b("div")`
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
`,K=o.memo(({toast:e,position:t,style:r,children:s})=>{let a=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[s,a]=k()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${g(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${g(a)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=o.createElement(Y,{toast:e}),n=o.createElement(J,{...e.ariaProps},v(e.message,e));return o.createElement(G,{className:e.className,style:{...a,...r,...e.style}},"function"==typeof s?s({icon:i,message:n}):o.createElement(o.Fragment,null,i,n))});i=o.createElement,u.p=void 0,f=i,y=void 0,x=void 0;var Q=({id:e,className:t,style:r,onHeightUpdate:s,children:a})=>{let i=o.useCallback(t=>{if(t){let r=()=>{s(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return o.createElement("div",{ref:i,className:t,style:r},a)},X=h`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:s,children:a,toasterId:i,containerStyle:n,containerClassName:l})=>{let{toasts:c,handlers:d}=((e,t="default")=>{let{toasts:r,pausedAt:s}=((e={},t=A)=>{let[r,s]=(0,o.useState)(C[t]||_),a=(0,o.useRef)(C[t]);(0,o.useEffect)(()=>(a.current!==C[t]&&s(C[t]),N.push([t,s]),()=>{let e=N.findIndex(([e])=>e===t);e>-1&&N.splice(e,1)}),[t]);let i=r.toasts.map(t=>{var r,s,a;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(s=e[t.type])?void 0:s.duration)||(null==e?void 0:e.duration)||$[t.type],style:{...e.style,...null==(a=e[t.type])?void 0:a.style,...t.style}}});return{...r,toasts:i}})(e,t),a=(0,o.useRef)(new Map).current,i=(0,o.useCallback)((e,t=D)=>{if(a.has(e))return;let r=setTimeout(()=>{a.delete(e),n({type:4,toastId:e})},t);a.set(e,r)},[]);(0,o.useEffect)(()=>{if(s)return;let e=Date.now(),a=r.map(r=>{if(r.duration===1/0)return;let s=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(s<0){r.visible&&z.dismiss(r.id);return}return setTimeout(()=>z.dismiss(r.id,t),s)});return()=>{a.forEach(e=>e&&clearTimeout(e))}},[r,s,t]);let n=(0,o.useCallback)(S(t),[t]),l=(0,o.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),c=(0,o.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),d=(0,o.useCallback)(()=>{s&&n({type:6,time:Date.now()})},[s,n]),u=(0,o.useCallback)((e,t)=>{let{reverseOrder:s=!1,gutter:a=8,defaultPosition:i}=t||{},o=r.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...s?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+a,0)},[r]);return(0,o.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=a.get(e.id);t&&(clearTimeout(t),a.delete(e.id))}})},[r,i]),{toasts:r,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:u}}})(r,i);return o.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(r=>{let i,n,l=r.position||t,c=d.calculateOffset(r,{reverseOrder:e,gutter:s,defaultPosition:t}),u=(i=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:k()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...n});return o.createElement(Q,{id:r.id,key:r.id,onHeightUpdate:d.updateHeight,className:r.visible?X:"",style:u},"custom"===r.type?v(r.message,r):a?a(r):o.createElement(K,{toast:r,position:l}))}))},et=z},8599:(e,t,r)=>{"use strict";r.d(t,{Yq:()=>i,Zt:()=>n,cn:()=>a,is:()=>d,qY:()=>u,r6:()=>o,wM:()=>l});var s=r(9722);function a(...e){return(0,s.$)(e)}function i(e){return e?new Date(e).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}):"N/A"}function o(e){return e?new Date(e).toLocaleString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):"N/A"}let n={processing:"Processing",picked_up:"Picked Up",in_transit:"In Transit",customs_clearance:"Customs Clearance",arrived_at_facility:"Arrived at Facility",out_for_delivery:"Out for Delivery",delivered:"Delivered",failed_delivery:"Failed Delivery"},l={standard:"Standard Shipping",express:"Express Shipping",overnight:"Overnight Shipping",freight:"Freight"},c={processing:"Shipment is being processed.",picked_up:"Parcel has been collected from sender.",in_transit:"Shipment is moving through the logistics network.",customs_clearance:"Shipment is undergoing customs clearance.",arrived_at_facility:"Shipment has arrived at a carrier facility.",out_for_delivery:"Shipment is out for delivery.",delivered:"Package has been successfully delivered.",failed_delivery:"Delivery attempt failed. A follow-up action is required."};function d(e){return c[e]||"Shipment status updated."}function u(e){return({processing:"bg-yellow-100 text-yellow-800 border-yellow-200",picked_up:"bg-sky-100 text-sky-800 border-sky-200",in_transit:"bg-blue-100 text-blue-800 border-blue-200",customs_clearance:"bg-indigo-100 text-indigo-800 border-indigo-200",arrived_at_facility:"bg-cyan-100 text-cyan-800 border-cyan-200",out_for_delivery:"bg-purple-100 text-purple-800 border-purple-200",delivered:"bg-green-100 text-green-800 border-green-200",failed_delivery:"bg-red-100 text-red-800 border-red-200"})[e]||"bg-gray-100 text-gray-800 border-gray-200"}},9005:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(772).A)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]])},9722:(e,t,r)=>{"use strict";function s(){for(var e,t,r=0,s="",a=arguments.length;r<a;r++)(e=arguments[r])&&(t=function e(t){var r,s,a="";if("string"==typeof t||"number"==typeof t)a+=t;else if("object"==typeof t)if(Array.isArray(t)){var i=t.length;for(r=0;r<i;r++)t[r]&&(s=e(t[r]))&&(a&&(a+=" "),a+=s)}else for(s in t)t[s]&&(a&&(a+=" "),a+=s);return a}(e))&&(s&&(s+=" "),s+=t);return s}r.d(t,{$:()=>s})},9960:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(772).A)("layout-dashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]])}},e=>{e.O(0,[8500,1518,8441,3794,7358],()=>e(e.s=2560)),_N_E=e.O()}]);