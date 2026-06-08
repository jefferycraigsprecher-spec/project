(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2116],{772:(e,t,a)=>{"use strict";a.d(t,{A:()=>n});var s=a(2115),r=a(907);let i=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,a)=>a?a.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var o=a(1265);let n=(e,t)=>{let a=(0,s.forwardRef)(({className:a,...n},l)=>(0,s.createElement)(o.default,{ref:l,iconNode:t,className:(0,r.z)(`lucide-${i(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,a),...n}));return a.displayName=i(e),a}},907:(e,t,a)=>{"use strict";a.d(t,{z:()=>s});let s=(...e)=>e.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim()},1265:(e,t,a)=>{"use strict";a.d(t,{default:()=>n});var s=a(2115),r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"},i=a(907);let o=(0,s.createContext)({}),n=(0,s.forwardRef)(({color:e,size:t,strokeWidth:a,absoluteStrokeWidth:n,className:l="",children:d,iconNode:c,...u},p)=>{let{size:m=24,strokeWidth:h=2,absoluteStrokeWidth:f=!1,color:y="currentColor",className:g=""}=(0,s.useContext)(o)??{},x=n??f?24*Number(a??h)/Number(t??m):a??h;return(0,s.createElement)("svg",{ref:p,...r,width:t??m??r.width,height:t??m??r.height,stroke:e??y,strokeWidth:x,className:(0,i.z)("lucide",g,l),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,t])=>(0,s.createElement)(e,t)),...Array.isArray(d)?d:[d]])})},3089:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});let s=(0,a(772).A)("package",[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]])},3321:(e,t,a)=>{"use strict";var s=a(4645);a.o(s,"useParams")&&a.d(t,{useParams:function(){return s.useParams}}),a.o(s,"usePathname")&&a.d(t,{usePathname:function(){return s.usePathname}}),a.o(s,"useRouter")&&a.d(t,{useRouter:function(){return s.useRouter}}),a.o(s,"useSearchParams")&&a.d(t,{useSearchParams:function(){return s.useSearchParams}})},5796:(e,t,a)=>{"use strict";a.d(t,{A:()=>s});let s=(0,a(772).A)("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]])},7366:(e,t,a)=>{Promise.resolve().then(a.bind(a,8902))},7529:(e,t,a)=>{"use strict";a.d(t,{A:()=>o});var s=a(1766),r=a(2849);let i=s.A.create({baseURL:"http://localhost:5000/api",headers:{"Content-Type":"application/json"},timeout:15e3});i.interceptors.request.use(e=>{let t=r.A.get("msc_admin_token");return t&&(e.headers.Authorization=`Bearer ${t}`),e}),i.interceptors.response.use(e=>e,e=>(e.response?.status===401&&(r.A.remove("msc_admin_token"),window.location.pathname.startsWith("/admin")&&"/admin/login"!==window.location.pathname&&(window.location.href="/admin/login")),Promise.reject(e)));let o=i},8434:(e,t,a)=>{"use strict";let s,r;a.d(t,{Toaster:()=>ee,Ay:()=>et});var i,o=a(2115);let n={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,c=/\n+/g,u=(e,t)=>{let a="",s="",r="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+o+";":s+="f"==i[1]?u(o,i):i+"{"+u(o,"k"==i[1]?"":t)+"}":"object"==typeof o?s+=u(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=u.p?u.p(i,o):i+":"+o+";")}return a+(t&&r?t+"{"+r+"}":r)+s},p={},m=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+m(e[a]);return t}return e};function h(e){let t,a,s=this||{},r=e.call?e(s.p):e;return((e,t,a,s,r)=>{var i;let o=m(e),n=p[o]||(p[o]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(o));if(!p[n]){let t=o!==e?e:(e=>{let t,a,s=[{}];for(;t=l.exec(e.replace(d,""));)t[4]?s.shift():t[3]?(a=t[3].replace(c," ").trim(),s.unshift(s[0][a]=s[0][a]||{})):s[0][t[1]]=t[2].replace(c," ").trim();return s[0]})(e);p[n]=u(r?{["@keyframes "+n]:t}:t,a?"":"."+n)}let h=a&&p.g;return a&&(p.g=p[n]),i=p[n],h?t.data=t.data.replace(h,i):-1===t.data.indexOf(i)&&(t.data=s?i+t.data:t.data+i),n})(r.unshift?r.raw?(t=[].slice.call(arguments,1),a=s.p,r.reduce((e,s,r)=>{let i=t[r];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+s+(null==i?"":i)},"")):r.reduce((e,t)=>Object.assign(e,t&&t.call?t(s.p):t),{}):r,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(s.target),s.g,s.o,s.k)}h.bind({g:1});let f,y,g,x=h.bind({k:1});function b(e,t){let a=this||{};return function(){let s=arguments;function r(i,o){let n=Object.assign({},i),l=n.className||r.className;a.p=Object.assign({theme:y&&y()},n),a.o=/go\d/.test(l),n.className=h.apply(a,s)+(l?" "+l:""),t&&(n.ref=o);let d=e;return e[0]&&(d=n.as||e,delete n.as),g&&d[0]&&g(n),f(d,n)}return t?t(r):r}}var v=(e,t)=>"function"==typeof e?e(t):e,w=(s=0,()=>(++s).toString()),k=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},j="default",N=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:s}=t;return N(e,{type:+!!e.toasts.find(e=>e.id===s.id),toast:s});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},A=[],E={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},$=(e,t=j)=>{C[t]=N(C[t]||E,e),A.forEach(([e,a])=>{e===t&&a(C[t])})},_=e=>Object.keys(C).forEach(t=>$(e,t)),z=(e=j)=>t=>{$(t,e)},P={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},O=e=>(t,a)=>{let s,r=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||w()}))(t,e,a);return z(r.toasterId||(s=r.id,Object.keys(C).find(e=>C[e].toasts.some(e=>e.id===s))))({type:2,toast:r}),r.id},D=(e,t)=>O("blank")(e,t);D.error=O("error"),D.success=O("success"),D.loading=O("loading"),D.custom=O("custom"),D.dismiss=(e,t)=>{let a={type:3,toastId:e};t?z(t)(a):_(a)},D.dismissAll=e=>D.dismiss(void 0,e),D.remove=(e,t)=>{let a={type:4,toastId:e};t?z(t)(a):_(a)},D.removeAll=e=>D.remove(void 0,e),D.promise=(e,t,a)=>{let s=D.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?v(t.success,e):void 0;return r?D.success(r,{id:s,...a,...null==a?void 0:a.success}):D.dismiss(s),e}).catch(e=>{let r=t.error?v(t.error,e):void 0;r?D.error(r,{id:s,...a,...null==a?void 0:a.error}):D.dismiss(s)}),e};var S=1e3,L=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,M=x`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,I=x`
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
    animation: ${M} 0.15s ease-out forwards;
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
    animation: ${I} 0.15s ease-out forwards;
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
}`,H=b("div")`
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
`,U=b("div")`
  position: absolute;
`,B=b("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,V=x`
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
  animation: ${V} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Y=({toast:e})=>{let{icon:t,type:a,iconTheme:s}=e;return void 0!==t?"string"==typeof t?o.createElement(Z,null,t):t:"blank"===a?null:o.createElement(B,null,o.createElement(T,{...s}),"loading"!==a&&o.createElement(U,null,"error"===a?o.createElement(R,{...s}):o.createElement(H,{...s})))},G=b("div")`
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
`,K=o.memo(({toast:e,position:t,style:a,children:s})=>{let r=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[s,r]=k()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${x(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${x(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=o.createElement(Y,{toast:e}),n=o.createElement(J,{...e.ariaProps},v(e.message,e));return o.createElement(G,{className:e.className,style:{...r,...a,...e.style}},"function"==typeof s?s({icon:i,message:n}):o.createElement(o.Fragment,null,i,n))});i=o.createElement,u.p=void 0,f=i,y=void 0,g=void 0;var Q=({id:e,className:t,style:a,onHeightUpdate:s,children:r})=>{let i=o.useCallback(t=>{if(t){let a=()=>{s(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return o.createElement("div",{ref:i,className:t,style:a},r)},X=h`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:s,children:r,toasterId:i,containerStyle:n,containerClassName:l})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:a,pausedAt:s}=((e={},t=j)=>{let[a,s]=(0,o.useState)(C[t]||E),r=(0,o.useRef)(C[t]);(0,o.useEffect)(()=>(r.current!==C[t]&&s(C[t]),A.push([t,s]),()=>{let e=A.findIndex(([e])=>e===t);e>-1&&A.splice(e,1)}),[t]);let i=a.toasts.map(t=>{var a,s,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(s=e[t.type])?void 0:s.duration)||(null==e?void 0:e.duration)||P[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...a,toasts:i}})(e,t),r=(0,o.useRef)(new Map).current,i=(0,o.useCallback)((e,t=S)=>{if(r.has(e))return;let a=setTimeout(()=>{r.delete(e),n({type:4,toastId:e})},t);r.set(e,a)},[]);(0,o.useEffect)(()=>{if(s)return;let e=Date.now(),r=a.map(a=>{if(a.duration===1/0)return;let s=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(s<0){a.visible&&D.dismiss(a.id);return}return setTimeout(()=>D.dismiss(a.id,t),s)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[a,s,t]);let n=(0,o.useCallback)(z(t),[t]),l=(0,o.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),d=(0,o.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),c=(0,o.useCallback)(()=>{s&&n({type:6,time:Date.now()})},[s,n]),u=(0,o.useCallback)((e,t)=>{let{reverseOrder:s=!1,gutter:r=8,defaultPosition:i}=t||{},o=a.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...s?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+r,0)},[a]);return(0,o.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=r.get(e.id);t&&(clearTimeout(t),r.delete(e.id))}})},[a,i]),{toasts:a,handlers:{updateHeight:d,startPause:l,endPause:c,calculateOffset:u}}})(a,i);return o.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(a=>{let i,n,l=a.position||t,d=c.calculateOffset(a,{reverseOrder:e,gutter:s,defaultPosition:t}),u=(i=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:k()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...n});return o.createElement(Q,{id:a.id,key:a.id,onHeightUpdate:c.updateHeight,className:a.visible?X:"",style:u},"custom"===a.type?v(a.message,a):r?r(a):o.createElement(K,{toast:a,position:l}))}))},et=D},8902:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>f});var s=a(5155),r=a(2115),i=a(3321),o=a(2849),n=a(7529),l=a(8434),d=a(3089),c=a(772);let u=(0,c.A)("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);var p=a(5796);let m=(0,c.A)("eye-off",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]),h=(0,c.A)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);function f(){let e=(0,i.useRouter)(),[t,a]=(0,r.useState)({email:"",password:""}),[c,f]=(0,r.useState)(!1),[y,g]=(0,r.useState)(!1);(0,r.useEffect)(()=>{o.A.get("msc_admin_token")&&e.replace("/admin/dashboard")},[]);let x=async a=>{if(a.preventDefault(),!t.email||!t.password)return l.Ay.error("All fields required");f(!0);try{let a=await n.A.post("/auth/login",t);o.A.set("msc_admin_token",a.data.token,{expires:7}),l.Ay.success(`Welcome back, ${a.data.admin.name}!`),e.push("/admin/dashboard")}catch(e){l.Ay.error(e.response?.data?.message||"Login failed")}finally{f(!1)}};return(0,s.jsxs)("div",{className:"min-h-screen bg-navy-900 flex items-center justify-center p-4",children:[(0,s.jsx)("div",{className:"hero-stripe absolute inset-0"}),(0,s.jsx)("div",{className:"absolute top-0 left-0 right-0 h-1 bg-brand-500"}),(0,s.jsxs)("div",{className:"relative w-full max-w-md",children:[(0,s.jsxs)("div",{className:"text-center mb-8",children:[(0,s.jsxs)("div",{className:"inline-flex items-center gap-3 mb-4",children:[(0,s.jsx)("div",{className:"bg-brand-500 p-3",children:(0,s.jsx)(d.A,{className:"w-7 h-7 text-white"})}),(0,s.jsxs)("div",{className:"text-left",children:[(0,s.jsx)("div",{className:"font-display text-2xl text-white uppercase font-bold",children:"Midwest"}),(0,s.jsx)("div",{className:"text-brand-400 text-xs font-bold uppercase tracking-[0.2em]",children:"Shipment Company"})]})]}),(0,s.jsx)("p",{className:"text-gray-400 text-sm",children:"Admin Portal — Authorized Access Only"})]}),(0,s.jsxs)("div",{className:"bg-white p-8 shadow-2xl",children:[(0,s.jsxs)("div",{className:"flex items-center gap-2 mb-6",children:[(0,s.jsx)(u,{className:"w-4 h-4 text-brand-500"}),(0,s.jsx)("h2",{className:"font-display text-navy-900 uppercase tracking-wide",children:"Secure Login"})]}),(0,s.jsxs)("form",{onSubmit:x,className:"space-y-4",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"label",children:"Email Address"}),(0,s.jsxs)("div",{className:"relative",children:[(0,s.jsx)(p.A,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"}),(0,s.jsx)("input",{type:"email",value:t.email,onChange:e=>a({...t,email:e.target.value}),className:"input-field pl-10",placeholder:"admin@midwestshipment.com",required:!0})]})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"label",children:"Password"}),(0,s.jsxs)("div",{className:"relative",children:[(0,s.jsx)(u,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"}),(0,s.jsx)("input",{type:y?"text":"password",value:t.password,onChange:e=>a({...t,password:e.target.value}),className:"input-field pl-10 pr-10",placeholder:"••••••••",required:!0}),(0,s.jsx)("button",{type:"button",onClick:()=>g(!y),className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",children:y?(0,s.jsx)(m,{className:"w-4 h-4"}):(0,s.jsx)(h,{className:"w-4 h-4"})})]})]}),(0,s.jsx)("button",{type:"submit",disabled:c,className:"btn-primary w-full justify-center py-4 mt-2",children:c?"Signing In...":"Sign In to Dashboard"})]}),(0,s.jsx)("div",{className:"mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-400",children:"Default: admin@midwestshipment.com / Admin@123456"})]})]})]})}}},e=>{e.O(0,[1518,8441,3794,7358],()=>e(e.s=7366)),_N_E=e.O()}]);