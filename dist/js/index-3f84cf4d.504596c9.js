import{_ as k,a as D,u as $,b as I}from"./index.vue_vue_type_script_name_Preview_setup_true_lang-22e0d43b.89eaec2f.js";import"./index.cd9349d2.js";import{O as d,E as w,Q as u,T as E,I as f,J as g,a3 as o,aj as x,R as i,ak as H,N as M,a9 as B,K as _,a6 as N,aa as G,ab as V}from"./index.9ba2f0f9.js";import"./_plugin-vue_export-helper.c27b6911.js";import"./index.db9bc9a4.js";import"./___vite-browser-external_commonjs-proxy.6a231247.js";var X=Object.defineProperty,Y=Object.defineProperties,z=Object.getOwnPropertyDescriptors,O=Object.getOwnPropertySymbols,R=Object.prototype.hasOwnProperty,T=Object.prototype.propertyIsEnumerable,P=(t,e,r)=>e in t?X(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,C=(t,e)=>{for(var r in e||(e={}))R.call(e,r)&&P(t,r,e[r]);if(O)for(var r of O(e))T.call(e,r)&&P(t,r,e[r]);return t},b=(t,e)=>Y(t,z(e));function U(t,e,r,c){return Math.atan2(t-r,e-c)*(180/Math.PI)*-1+180}const F=t=>(G("data-v-4e21238c"),t=t(),V(),t),J={class:"gradient-controls border-box flex justify-between items-center w-full mb-8px px-16px"},K={class:"flex flex-1"},L={key:0,class:"relative mr-24px"},Q=F(()=>o("div",{class:"gradient-degree-pointer"},null,-1)),q=[Q],A={class:"gradient-degree-value flex justify-center items-center"},W=d({name:"GradientControls"}),Z=d(b(C({},W),{setup(t){const e=w("colorPickerState"),r=w("updateColor"),c=u(()=>e.type),m=u(()=>e.degree),v=n=>{r({type:n},"type")},l=E(!0),S=()=>{if(l.value){l.value=!1;return}let n=(e.degree||0)+45;n>=360&&(n=0),r({degree:~~n},"degree")},h=u(()=>({transform:`rotate(${e.degree}deg)`})),y=$(n=>{const a=n.target.getBoundingClientRect(),p=~~(8-window.pageYOffset)+a.top,j=~~(8-window.pageXOffset)+a.left;return{centerY:p,centerX:j}},(n,{centerX:s,centerY:a})=>{l.value=!0;const p=U(n.clientX,n.clientY,s,a);r({degree:~~p},"degree")},n=>{const s=n.target.classList;l.value=!1,s.contains("gradient-degrees")||s.contains("icon-rotate")});return(n,s)=>(f(),g("div",J,[o("div",K,[o("div",{class:x(`gradient-type-item liner-gradient ${i(c)==="linear"?"active":""}`),onClick:s[0]||(s[0]=a=>v("linear"))},null,2),o("div",{class:x(`gradient-type-item radial-gradient ${i(c)==="radial"?"active":""}`),onClick:s[1]||(s[1]=a=>v("radial"))},null,2)]),i(c)==="linear"?(f(),g("div",L,[o("div",{class:"gradient-degrees cursor-pointer flex justify-center items-center",onMousedown:s[2]||(s[2]=(...a)=>i(y)&&i(y)(...a)),onClick:S},[o("div",{class:"gradient-degree-center",style:H(i(h))},q,4)],32),o("div",A,[o("p",null,M(i(m))+"°",1)])])):B("",!0)]))}})),ee=I(Z,[["__scopeId","data-v-4e21238c"]]),te=d({name:"Gradient"}),pe=d(b(C({},te),{setup(t){return(e,r)=>(f(),g(N,null,[_(ee),_(k),_(D)],64))}}));export{pe as default};