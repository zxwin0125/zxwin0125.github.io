"use strict";(self.webpackChunklearn_data=self.webpackChunklearn_data||[]).push([[2617],{2617:(e,t,l)=>{l.r(t),l.d(t,{default:()=>v});var n=l(3894),r=l(6350),o=l(54),a=l(5598),s=l(6254),i=l(5525),d=l(1548),c=l(5839);const u=["/DailyRoutine.html","/Fitness.html","/","/blog.html","/intro.html","/apps/Applist.html","/apps/Chrome.html","/apps/design.html","/apps/toolbox.html","/code/AutoHotkey.html","/code/Electron.html","/code/HTML.html","/code/Javascript.html","/code/Markdown.html","/code/Python.html","/code/","/code/Regex.html","/code/Vue.html","/deploy/CloudServices.html","/deploy/Cloudflare.html","/deploy/DNS.html","/deploy/GitHub.html","/deploy/MySQL.html","/deploy/Static.html","/deploy/VPS.html","/family/Coupon.html","/family/Diet.html","/family/Life.html","/life/","/manage/","/project/","/web/Comments.html","/web/VuePress.html","/web/docsify.html","/work/bitOne.html","/apps/topic/","/apps/topic/topic01.html","/apps/topic/topic02anytitle.html","/knowledge/clientSide/","/knowledge/dataBase/","/knowledge/mac/","/knowledge/os/","/knowledge/serverSide/","/knowledge/tool/","/knowledge/frontEnd/css/bfc.html","/knowledge/frontEnd/css/cssCenter.html","/knowledge/frontEnd/css/cssModules.html","/knowledge/frontEnd/css/cssVariable.html","/knowledge/frontEnd/css/responsiveLayoutAndBootstrap.html","/knowledge/frontEnd/engineering/codeSpecification.html","/knowledge/frontEnd/engineering/module.html","/knowledge/frontEnd/engineering/projectOrganizationDesign.html","/knowledge/frontEnd/engineering/webpack.html","/knowledge/frontEnd/frame/frameAnalogy.html","/knowledge/frontEnd/frame/frameIsomorphic.html","/knowledge/frontEnd/frame/frameStudy.html","/knowledge/frontEnd/html/html5Mobile.html","/knowledge/frontEnd/html/html5Tag.html","/knowledge/frontEnd/html/htmlSemanticization.html","/knowledge/frontEnd/javascript/api.html","/knowledge/frontEnd/javascript/asynchronous.html","/knowledge/frontEnd/javascript/closure.html","/knowledge/frontEnd/javascript/es6Next.html","/knowledge/frontEnd/javascript/objectPrototype.html","/knowledge/frontEnd/javascript/other.html","/knowledge/frontEnd/javascript/promise.html","/knowledge/frontEnd/javascript/this.html","/knowledge/frontEnd/performanceOptimization/monitorAndError.html","/knowledge/frontEnd/performanceOptimization/problems.html","/knowledge/frontEnd/performanceOptimization/reactFrame.html","/knowledge/frontEnd/programmingThinkingAndAlgorithms/algorithms.html","/knowledge/frontEnd/programmingThinkingAndAlgorithms/dataStructure.html","/knowledge/frontEnd/programmingThinkingAndAlgorithms/designPattern.html","/knowledge/frontEnd/programmingThinkingAndAlgorithms/function.html","/knowledge/frontEnd/programmingThinkingAndAlgorithms/wx.html","/knowledge/interview/css/","/knowledge/interview/dom/","/knowledge/interview/webAPI/","/knowledge/os/network/jsonp.html","/knowledge/frontEnd/frame/react/reactComponentDesign.html","/knowledge/frontEnd/frame/react/reactNowAndFuture.html","/knowledge/frontEnd/frame/react/reactStatus.html","/knowledge/frontEnd/frame/react/understandReact.html","/knowledge/frontEnd/html/webComponents/webComponents.html","/404.html","/apps/","/deploy/","/family/","/web/","/work/","/knowledge/","/knowledge/frontEnd/css/","/knowledge/frontEnd/","/knowledge/frontEnd/engineering/","/knowledge/frontEnd/frame/","/knowledge/frontEnd/html/","/knowledge/frontEnd/javascript/","/knowledge/frontEnd/performanceOptimization/","/knowledge/frontEnd/programmingThinkingAndAlgorithms/","/knowledge/interview/","/knowledge/os/network/","/knowledge/frontEnd/frame/react/","/knowledge/frontEnd/html/webComponents/","/category/","/category/css3/","/category/html5/","/category/javascript/","/category/%E9%9D%A2%E8%AF%95/","/category/%E7%BD%91%E7%BB%9C/","/category/web-components/","/tag/","/tag/css-bfc/","/tag/css-modules/","/tag/css-variable/","/tag/%E5%93%8D%E5%BA%94%E5%BC%8F%E5%B8%83%E5%B1%80/","/tag/css/","/tag/dom/","/tag/webapi/","/tag/%E8%B7%A8%E5%9F%9F/","/article/","/star/","/timeline/"];l(6445);const h=(0,r.Mjh)("SEARCH_PRO_QUERY_HISTORY",[]),m=e=>u[e.id]+("anchor"in e?`#${e.anchor}`:""),{resultHistoryCount:p}=c.s,g=(0,r.Mjh)("SEARCH_PRO_RESULT_HISTORY",[]);var v=(0,s.pM)({name:"SearchResult",props:{queries:{type:Array,required:!0},isFocusing:Boolean},emits:["close","updateQuery"],setup(e,{emit:t}){const l=(0,i.rd)(),u=(0,i.Zv)(),v=(0,n.s5)(c.a),{enabled:y,addQueryHistory:w,queryHistory:f,removeQueryHistory:k}=(()=>{const{queryHistoryCount:e}=c.s,t=e>0;return{enabled:t,queryHistory:h,addQueryHistory:l=>{t&&(h.value=Array.from(new Set([l,...h.value.slice(0,e-1)])))},removeQueryHistory:e=>{h.value=[...h.value.slice(0,e),...h.value.slice(e+1)]}}})(),{enabled:E,resultHistory:b,addResultHistory:A,removeResultHistory:H}=(()=>{const e=p>0;return{enabled:e,resultHistory:g,addResultHistory:t=>{if(e){const e={link:m(t),display:t.display};"header"in t&&(e.header=t.header),g.value=[e,...g.value.slice(0,p-1)]}},removeResultHistory:e=>{g.value=[...g.value.slice(0,e),...g.value.slice(e+1)]}}})(),C=y||E,S=(0,a.lW)(e,"queries"),{results:R,isSearching:j}=(e=>{const t=(0,c.u)(),l=(0,i.Zv)(),n=(0,i.BV)(),r=(0,a.KR)(0),d=(0,s.EW)((()=>r.value>0)),u=(0,a.IJ)([]);return(0,s.sV)((()=>{const{search:a,terminate:i}=(0,c.c)(),d=(0,o.Q0)((e=>{const o=e.join(" "),{searchFilter:s=e=>e,splitWord:i,suggestionsFilter:d,...c}=t.value;o?(r.value+=1,a(e.join(" "),l.value,c).then((e=>s(e,o,l.value,n.value))).then((e=>{r.value-=1,u.value=e})).catch((e=>{console.warn(e),r.value-=1,r.value||(u.value=[])}))):u.value=[]}),c.s.searchDelay-c.s.suggestDelay);(0,s.wB)([e,l],(([e])=>d(e)),{immediate:!0}),(0,s.hi)((()=>{i()}))})),{isSearching:d,results:u}})(S),Q=(0,a.Kh)({isQuery:!0,index:0}),x=(0,a.KR)(0),D=(0,a.KR)(0),T=(0,s.EW)((()=>C&&(f.value.length>0||b.value.length>0))),B=(0,s.EW)((()=>R.value.length>0)),q=(0,s.EW)((()=>R.value[x.value]||null)),F=e=>e.map((e=>(0,n.Kg)(e)?e:(0,s.h)(e[0],e[1]))),M=e=>{if("customField"===e.type){const t=c.b[e.index]||"$content",[l,r=""]=(0,n.Qd)(t)?t[u.value].split("$content"):t.split("$content");return e.display.map((e=>(0,s.h)("div",F([l,...e,r]))))}return e.display.map((e=>(0,s.h)("div",F(e))))},O=()=>{x.value=0,D.value=0,t("updateQuery",""),t("close")};return(0,r.MLh)("keydown",(n=>{if(e.isFocusing)if(B.value){if("ArrowUp"===n.key)D.value>0?D.value-=1:(x.value=x.value>0?x.value-1:R.value.length-1,D.value=q.value.contents.length-1);else if("ArrowDown"===n.key)D.value<q.value.contents.length-1?D.value+=1:(x.value=x.value<R.value.length-1?x.value+1:0,D.value=0);else if("Enter"===n.key){const t=q.value.contents[D.value];w(e.queries.join(" ")),A(t),l.push(m(t)),O()}}else if(E)if("ArrowUp"===n.key)(()=>{const{isQuery:e,index:t}=Q;0===t?(Q.isQuery=!e,Q.index=e?b.value.length-1:f.value.length-1):Q.index=t-1})();else if("ArrowDown"===n.key)(()=>{const{isQuery:e,index:t}=Q;t===(e?f.value.length-1:b.value.length-1)?(Q.isQuery=!e,Q.index=0):Q.index=t+1})();else if("Enter"===n.key){const{index:e}=Q;Q.isQuery?(t("updateQuery",f.value[e]),n.preventDefault()):(l.push(b.value[e].link),O())}})),(0,s.wB)([x,D],(()=>{document.querySelector(".search-pro-result-list-item.active .search-pro-result-item.active")?.scrollIntoView(!1)}),{flush:"post"}),()=>(0,s.h)("div",{class:["search-pro-result-wrapper",{empty:e.queries.length?!B.value:!T.value}],id:"search-pro-results"},e.queries.length?j.value?(0,s.h)(d.S,{hint:v.value.searching}):B.value?(0,s.h)("ul",{class:"search-pro-result-list"},R.value.map((({title:t,contents:l},n)=>{const r=x.value===n;return(0,s.h)("li",{class:["search-pro-result-list-item",{active:r}]},[(0,s.h)("div",{class:"search-pro-result-title"},t||v.value.defaultTitle),l.map(((t,l)=>{const n=r&&D.value===l;return(0,s.h)(i.Wt,{to:m(t),class:["search-pro-result-item",{active:n,"aria-selected":n}],onClick:()=>{w(e.queries.join(" ")),A(t),O()}},(()=>["text"===t.type?null:(0,s.h)("title"===t.type?d.T:"heading"===t.type?d.H:d.a,{class:"search-pro-result-type"}),(0,s.h)("div",{class:"search-pro-result-content"},["text"===t.type&&t.header?(0,s.h)("div",{class:"content-header"},t.header):null,(0,s.h)("div",M(t))])]))}))])}))):v.value.emptyResult:C?T.value?[y?(0,s.h)("ul",{class:"search-pro-result-list"},(0,s.h)("li",{class:"search-pro-result-list-item"},[(0,s.h)("div",{class:"search-pro-result-title"},v.value.queryHistory),f.value.map(((e,l)=>(0,s.h)("div",{class:["search-pro-result-item",{active:Q.isQuery&&Q.index===l}],onClick:()=>{t("updateQuery",e)}},[(0,s.h)(d.b,{class:"search-pro-result-type"}),(0,s.h)("div",{class:"search-pro-result-content"},e),(0,s.h)("button",{class:"search-pro-remove-icon",innerHTML:d.C,onClick:e=>{e.preventDefault(),e.stopPropagation(),k(l)}})])))])):null,E?(0,s.h)("ul",{class:"search-pro-result-list"},(0,s.h)("li",{class:"search-pro-result-list-item"},[(0,s.h)("div",{class:"search-pro-result-title"},v.value.resultHistory),b.value.map(((e,t)=>(0,s.h)(i.Wt,{to:e.link,class:["search-pro-result-item",{active:!Q.isQuery&&Q.index===t}],onClick:()=>{O()}},(()=>[(0,s.h)(d.b,{class:"search-pro-result-type"}),(0,s.h)("div",{class:"search-pro-result-content"},[e.header?(0,s.h)("div",{class:"content-header"},e.header):null,(0,s.h)("div",e.display.map((e=>F(e))).flat())]),(0,s.h)("button",{class:"search-pro-remove-icon",innerHTML:d.C,onClick:e=>{e.preventDefault(),e.stopPropagation(),H(t)}})]))))])):null]:v.value.emptyHistory:v.value.emptyResult)}})}}]);