(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1417],{861:(e,t,a)=>{"use strict";a.d(t,{A:()=>o});var s=a(1766),r=a(2849);let i=s.A.create({baseURL:"http://localhost:5000/api",timeout:15e3});i.interceptors.request.use(e=>{let t=r.A.get("msc_customer_token");return t&&(e.headers.Authorization=`Bearer ${t}`),e}),i.interceptors.response.use(e=>e,e=>(e.response?.status===401&&(r.A.remove("msc_customer_token"),window.location.pathname.startsWith("/customer")&&"/customer/login"!==window.location.pathname&&(window.location.href="/customer/login")),Promise.reject(e)));let o=i},3321:(e,t,a)=>{"use strict";var s=a(4645);a.o(s,"useParams")&&a.d(t,{useParams:function(){return s.useParams}}),a.o(s,"usePathname")&&a.d(t,{usePathname:function(){return s.usePathname}}),a.o(s,"useRouter")&&a.d(t,{useRouter:function(){return s.useRouter}}),a.o(s,"useSearchParams")&&a.d(t,{useSearchParams:function(){return s.useSearchParams}})},4351:(e,t,a)=>{Promise.resolve().then(a.bind(a,9365))},8434:(e,t,a)=>{"use strict";let s,r;a.d(t,{Toaster:()=>ee,Ay:()=>et});var i,o=a(2115);let n={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,c=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,u=(e,t)=>{let a="",s="",r="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+o+";":s+="f"==i[1]?u(o,i):i+"{"+u(o,"k"==i[1]?"":t)+"}":"object"==typeof o?s+=u(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=u.p?u.p(i,o):i+":"+o+";")}return a+(t&&r?t+"{"+r+"}":r)+s},p={},m=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+m(e[a]);return t}return e};function f(e){let t,a,s=this||{},r=e.call?e(s.p):e;return((e,t,a,s,r)=>{var i;let o=m(e),n=p[o]||(p[o]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(o));if(!p[n]){let t=o!==e?e:(e=>{let t,a,s=[{}];for(;t=l.exec(e.replace(c,""));)t[4]?s.shift():t[3]?(a=t[3].replace(d," ").trim(),s.unshift(s[0][a]=s[0][a]||{})):s[0][t[1]]=t[2].replace(d," ").trim();return s[0]})(e);p[n]=u(r?{["@keyframes "+n]:t}:t,a?"":"."+n)}let f=a&&p.g;return a&&(p.g=p[n]),i=p[n],f?t.data=t.data.replace(f,i):-1===t.data.indexOf(i)&&(t.data=s?i+t.data:t.data+i),n})(r.unshift?r.raw?(t=[].slice.call(arguments,1),a=s.p,r.reduce((e,s,r)=>{let i=t[r];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":u(e,""):!1===e?"":e}return e+s+(null==i?"":i)},"")):r.reduce((e,t)=>Object.assign(e,t&&t.call?t(s.p):t),{}):r,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(s.target),s.g,s.o,s.k)}f.bind({g:1});let h,b,g,y=f.bind({k:1});function x(e,t){let a=this||{};return function(){let s=arguments;function r(i,o){let n=Object.assign({},i),l=n.className||r.className;a.p=Object.assign({theme:b&&b()},n),a.o=/go\d/.test(l),n.className=f.apply(a,s)+(l?" "+l:""),t&&(n.ref=o);let c=e;return e[0]&&(c=n.as||e,delete n.as),g&&c[0]&&g(n),h(c,n)}return t?t(r):r}}var v=(e,t)=>"function"==typeof e?e(t):e,w=(s=0,()=>(++s).toString()),j=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},N="default",k=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:s}=t;return k(e,{type:+!!e.toasts.find(e=>e.id===s.id),toast:s});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},C=[],E={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},A={},P=(e,t=N)=>{A[t]=k(A[t]||E,e),C.forEach(([e,a])=>{e===t&&a(A[t])})},$=e=>Object.keys(A).forEach(t=>P(e,t)),_=(e=N)=>t=>{P(t,e)},O={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},D=e=>(t,a)=>{let s,r=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||w()}))(t,e,a);return _(r.toasterId||(s=r.id,Object.keys(A).find(e=>A[e].toasts.some(e=>e.id===s))))({type:2,toast:r}),r.id},S=(e,t)=>D("blank")(e,t);S.error=D("error"),S.success=D("success"),S.loading=D("loading"),S.custom=D("custom"),S.dismiss=(e,t)=>{let a={type:3,toastId:e};t?_(t)(a):$(a)},S.dismissAll=e=>S.dismiss(void 0,e),S.remove=(e,t)=>{let a={type:4,toastId:e};t?_(t)(a):$(a)},S.removeAll=e=>S.remove(void 0,e),S.promise=(e,t,a)=>{let s=S.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?v(t.success,e):void 0;return r?S.success(r,{id:s,...a,...null==a?void 0:a.success}):S.dismiss(s),e}).catch(e=>{let r=t.error?v(t.error,e):void 0;r?S.error(r,{id:s,...a,...null==a?void 0:a.error}):S.dismiss(s)}),e};var z=1e3,I=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,L=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,R=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,T=x("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${I} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${L} 0.15s ease-out forwards;
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
    animation: ${R} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,F=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,M=x("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${F} 1s linear infinite;
`,U=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,q=y`
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
}`,H=x("div")`
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
`,B=x("div")`
  position: absolute;
`,V=x("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,W=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Y=x("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${W} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Z=({toast:e})=>{let{icon:t,type:a,iconTheme:s}=e;return void 0!==t?"string"==typeof t?o.createElement(Y,null,t):t:"blank"===a?null:o.createElement(V,null,o.createElement(M,{...s}),"loading"!==a&&o.createElement(B,null,"error"===a?o.createElement(T,{...s}):o.createElement(H,{...s})))},G=x("div")`
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
`,J=x("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,K=o.memo(({toast:e,position:t,style:a,children:s})=>{let r=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[s,r]=j()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${y(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=o.createElement(Z,{toast:e}),n=o.createElement(J,{...e.ariaProps},v(e.message,e));return o.createElement(G,{className:e.className,style:{...r,...a,...e.style}},"function"==typeof s?s({icon:i,message:n}):o.createElement(o.Fragment,null,i,n))});i=o.createElement,u.p=void 0,h=i,b=void 0,g=void 0;var Q=({id:e,className:t,style:a,onHeightUpdate:s,children:r})=>{let i=o.useCallback(t=>{if(t){let a=()=>{s(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return o.createElement("div",{ref:i,className:t,style:a},r)},X=f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ee=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:s,children:r,toasterId:i,containerStyle:n,containerClassName:l})=>{let{toasts:c,handlers:d}=((e,t="default")=>{let{toasts:a,pausedAt:s}=((e={},t=N)=>{let[a,s]=(0,o.useState)(A[t]||E),r=(0,o.useRef)(A[t]);(0,o.useEffect)(()=>(r.current!==A[t]&&s(A[t]),C.push([t,s]),()=>{let e=C.findIndex(([e])=>e===t);e>-1&&C.splice(e,1)}),[t]);let i=a.toasts.map(t=>{var a,s,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(s=e[t.type])?void 0:s.duration)||(null==e?void 0:e.duration)||O[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...a,toasts:i}})(e,t),r=(0,o.useRef)(new Map).current,i=(0,o.useCallback)((e,t=z)=>{if(r.has(e))return;let a=setTimeout(()=>{r.delete(e),n({type:4,toastId:e})},t);r.set(e,a)},[]);(0,o.useEffect)(()=>{if(s)return;let e=Date.now(),r=a.map(a=>{if(a.duration===1/0)return;let s=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(s<0){a.visible&&S.dismiss(a.id);return}return setTimeout(()=>S.dismiss(a.id,t),s)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[a,s,t]);let n=(0,o.useCallback)(_(t),[t]),l=(0,o.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),c=(0,o.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),d=(0,o.useCallback)(()=>{s&&n({type:6,time:Date.now()})},[s,n]),u=(0,o.useCallback)((e,t)=>{let{reverseOrder:s=!1,gutter:r=8,defaultPosition:i}=t||{},o=a.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...s?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+r,0)},[a]);return(0,o.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=r.get(e.id);t&&(clearTimeout(t),r.delete(e.id))}})},[a,i]),{toasts:a,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:u}}})(a,i);return o.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(a=>{let i,n,l=a.position||t,c=d.calculateOffset(a,{reverseOrder:e,gutter:s,defaultPosition:t}),u=(i=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:j()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...n});return o.createElement(Q,{id:a.id,key:a.id,onHeightUpdate:d.updateHeight,className:a.visible?X:"",style:u},"custom"===a.type?v(a.message,a):r?r(a):o.createElement(K,{toast:a,position:l}))}))},et=S},9365:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>u});var s=a(5155),r=a(2115),i=a(8500),o=a.n(i),n=a(3321),l=a(2849),c=a(861),d=a(8434);function u(){let e=(0,n.useRouter)(),[t,a]=(0,r.useState)(""),[i,u]=(0,r.useState)({name:"",email:"",password:"",phone:"",address:"",city:"",state:"",country:"USA"}),[p,m]=(0,r.useState)(!1),f=async e=>{e.preventDefault(),m(!0);try{let e=await c.A.post("/customers/register",i);l.A.set("msc_customer_token",e.data.token,{expires:7}),a(e.data.verification_token||""),d.Ay.success("Account created.")}catch(e){d.Ay.error(e.response?.data?.message||"Unable to create account.")}finally{m(!1)}},h=async()=>{if(t)try{await c.A.post("/customers/verify-email",{token:t}),d.Ay.success("Email verified."),e.push("/customer/dashboard")}catch(e){d.Ay.error(e.response?.data?.message||"Unable to verify email.")}};return(0,s.jsx)("main",{className:"min-h-screen bg-slate-100 px-4 py-10",children:(0,s.jsxs)("div",{className:"mx-auto max-w-2xl border border-gray-100 bg-white p-6 shadow-sm",children:[(0,s.jsx)("p",{className:"section-subtitle",children:"Customer registration"}),(0,s.jsx)("h1",{className:"mt-2 font-display text-3xl uppercase text-navy-900",children:"Create your portal account"}),(0,s.jsxs)("form",{onSubmit:f,className:"mt-6 grid gap-4 md:grid-cols-2",children:[(0,s.jsxs)("label",{className:"block md:col-span-2",children:[(0,s.jsx)("span",{className:"label",children:"Full name"}),(0,s.jsx)("input",{required:!0,value:i.name,onChange:e=>u({...i,name:e.target.value}),className:"input-field"})]}),(0,s.jsxs)("label",{className:"block",children:[(0,s.jsx)("span",{className:"label",children:"Email"}),(0,s.jsx)("input",{type:"email",required:!0,value:i.email,onChange:e=>u({...i,email:e.target.value}),className:"input-field"})]}),(0,s.jsxs)("label",{className:"block",children:[(0,s.jsx)("span",{className:"label",children:"Password"}),(0,s.jsx)("input",{type:"password",required:!0,minLength:8,value:i.password,onChange:e=>u({...i,password:e.target.value}),className:"input-field"})]}),(0,s.jsxs)("label",{className:"block",children:[(0,s.jsx)("span",{className:"label",children:"Phone"}),(0,s.jsx)("input",{value:i.phone,onChange:e=>u({...i,phone:e.target.value}),className:"input-field"})]}),(0,s.jsxs)("label",{className:"block",children:[(0,s.jsx)("span",{className:"label",children:"Country"}),(0,s.jsx)("input",{value:i.country,onChange:e=>u({...i,country:e.target.value}),className:"input-field"})]}),(0,s.jsxs)("label",{className:"block md:col-span-2",children:[(0,s.jsx)("span",{className:"label",children:"Address"}),(0,s.jsx)("input",{value:i.address,onChange:e=>u({...i,address:e.target.value}),className:"input-field"})]}),(0,s.jsxs)("label",{className:"block",children:[(0,s.jsx)("span",{className:"label",children:"City"}),(0,s.jsx)("input",{value:i.city,onChange:e=>u({...i,city:e.target.value}),className:"input-field"})]}),(0,s.jsxs)("label",{className:"block",children:[(0,s.jsx)("span",{className:"label",children:"State"}),(0,s.jsx)("input",{value:i.state,onChange:e=>u({...i,state:e.target.value}),className:"input-field"})]}),(0,s.jsxs)("div",{className:"flex flex-wrap gap-3 md:col-span-2",children:[(0,s.jsx)("button",{disabled:p,className:"btn-primary",children:p?"Creating...":"Create account"}),(0,s.jsx)(o(),{href:"/customer/login",className:"btn-outline",children:"Back to login"})]})]}),t&&(0,s.jsxs)("div",{className:"mt-6 border border-brand-200 bg-brand-50 p-4",children:[(0,s.jsx)("p",{className:"font-semibold text-navy-900",children:"Email verification token"}),(0,s.jsx)("p",{className:"mt-2 break-all font-mono text-sm text-brand-700",children:t}),(0,s.jsx)("button",{onClick:h,className:"btn-secondary mt-4",children:"Verify email"})]})]})})}}},e=>{e.O(0,[8500,1518,8441,3794,7358],()=>e(e.s=4351)),_N_E=e.O()}]);