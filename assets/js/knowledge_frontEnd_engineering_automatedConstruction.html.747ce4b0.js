"use strict";(self.webpackChunklearn_data=self.webpackChunklearn_data||[]).push([[3649],{3386:(s,i)=>{i.A=(s,i)=>{const e=s.__vccOpts||s;for(const[s,t]of i)e[s]=t;return e}},7479:(s,i,e)=>{e.r(i),e.d(i,{comp:()=>n,data:()=>l});var t=e(6254);const a={},n=(0,e(3386).A)(a,[["render",function(s,i){return(0,t.uX)(),(0,t.CE)("div",null,i[0]||(i[0]=[(0,t.Fv)('<h2 id="什么是自动化构建" tabindex="-1"><a class="header-anchor" href="#什么是自动化构建"><span>什么是自动化构建</span></a></h2><blockquote><p>重复的工作都应自动化</p></blockquote><ul><li>开发行业中的自动化构建，就是把开发中写的源代码自动转换成可以在生产环境中运行的代码</li><li>一般把这个转换过程称为自动化构建工作流，作用是让开发者脱离运行环境兼容带来的种种问题，在开发阶段使用一些提高效率的语法规格和标准</li><li>典型应用场景，开发网页应用时可以使用 <ul><li>ECMAScript Next 新语法提高编码效率和代码质量</li><li>Sass 增强 css 的可编程性</li><li>模板引擎抽象页面中重复的 html</li></ul></li><li>通过自动化构建工具可以将上述不被浏览器支持的特性转换成能够直接运行的代码</li></ul><h2 id="自动化构建初体验" tabindex="-1"><a class="header-anchor" href="#自动化构建初体验"><span>自动化构建初体验</span></a></h2><blockquote><p>通过 sass 增强 css 的可编程性</p></blockquote><h3 id="浏览器使用-sass" tabindex="-1"><a class="header-anchor" href="#浏览器使用-sass"><span>浏览器使用 sass</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">yarn</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> add</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> sass</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> --dev</span></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">\\</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">node_modules</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">\\</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">.bin</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">\\</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">sass.cmd</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> sass/style.sass</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> css/style.css</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>这样使用的话，每次转换都要执行一边代码，过于繁琐</li><li>所以要解决在项目开发阶段重复去执行的命令，可以使用 NPM Scripts</li></ul><h3 id="npm-scripts" tabindex="-1"><a class="header-anchor" href="#npm-scripts"><span>NPM Scripts</span></a></h3><ul><li>可以在 NPM Scripts 中定义一些与这个项目开发过程中有关的脚本命令，让这些命令跟在项目一起去维护</li><li>包装构建命令的方式就是在 package.json 中添加一个 scripts 字段：</li></ul><div class="language-json line-numbers-mode" data-highlighter="shiki" data-ext="json" data-title="json" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;scripts&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: {</span></span>\n<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">  &quot;build-sass&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;sass sass/style.sass css/style.css&quot;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>键是 script 命令，值是需要去执行的命令</li></ul><div class="hint-container warning"><p class="hint-container-title">注意</p><p>scripts 可以自动去发现 node_modules 中的命令，这里就不需要写完整的命令，直接写名称可以</p></div><ul><li>NPM Scripts 也是实现自动化构建最简单的方式</li></ul>',14)]))}]]),l=JSON.parse('{"path":"/knowledge/frontEnd/engineering/automatedConstruction.html","title":"自动化构建","lang":"zh-CN","frontmatter":{"title":"自动化构建","date":"2021-03-08T00:00:00.000Z","order":3,"description":"什么是自动化构建 重复的工作都应自动化 开发行业中的自动化构建，就是把开发中写的源代码自动转换成可以在生产环境中运行的代码 一般把这个转换过程称为自动化构建工作流，作用是让开发者脱离运行环境兼容带来的种种问题，在开发阶段使用一些提高效率的语法规格和标准 典型应用场景，开发网页应用时可以使用 ECMAScript Next 新语法提高编码效率和代码质量 ...","head":[["meta",{"property":"og:url","content":"https://www.zxwin0125.top/knowledge/frontEnd/engineering/automatedConstruction.html"}],["meta",{"property":"og:site_name","content":"欢迎来到我的Blog"}],["meta",{"property":"og:title","content":"自动化构建"}],["meta",{"property":"og:description","content":"什么是自动化构建 重复的工作都应自动化 开发行业中的自动化构建，就是把开发中写的源代码自动转换成可以在生产环境中运行的代码 一般把这个转换过程称为自动化构建工作流，作用是让开发者脱离运行环境兼容带来的种种问题，在开发阶段使用一些提高效率的语法规格和标准 典型应用场景，开发网页应用时可以使用 ECMAScript Next 新语法提高编码效率和代码质量 ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-11-30T08:25:33.000Z"}],["meta",{"property":"article:published_time","content":"2021-03-08T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-11-30T08:25:33.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"自动化构建\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2021-03-08T00:00:00.000Z\\",\\"dateModified\\":\\"2024-11-30T08:25:33.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"三金\\",\\"url\\":\\"https://www.zxwin0125.top\\"}]}"]]},"headers":[{"level":2,"title":"什么是自动化构建","slug":"什么是自动化构建","link":"#什么是自动化构建","children":[]},{"level":2,"title":"自动化构建初体验","slug":"自动化构建初体验","link":"#自动化构建初体验","children":[{"level":3,"title":"浏览器使用 sass","slug":"浏览器使用-sass","link":"#浏览器使用-sass","children":[]},{"level":3,"title":"NPM Scripts","slug":"npm-scripts","link":"#npm-scripts","children":[]}]}],"git":{"createdTime":1732955133000,"updatedTime":1732955133000,"contributors":[{"name":"zxwin0125","email":"zxwin_0125@163.com","commits":1}]},"readingTime":{"minutes":1.48,"words":443},"filePathRelative":"knowledge/frontEnd/engineering/automatedConstruction.md","localizedDate":"2021年3月8日","excerpt":"<h2>什么是自动化构建</h2>\\n<blockquote>\\n<p>重复的工作都应自动化</p>\\n</blockquote>\\n<ul>\\n<li>开发行业中的自动化构建，就是把开发中写的源代码自动转换成可以在生产环境中运行的代码</li>\\n<li>一般把这个转换过程称为自动化构建工作流，作用是让开发者脱离运行环境兼容带来的种种问题，在开发阶段使用一些提高效率的语法规格和标准</li>\\n<li>典型应用场景，开发网页应用时可以使用\\n<ul>\\n<li>ECMAScript Next 新语法提高编码效率和代码质量</li>\\n<li>Sass 增强 css 的可编程性</li>\\n<li>模板引擎抽象页面中重复的 html</li>\\n</ul>\\n</li>\\n<li>通过自动化构建工具可以将上述不被浏览器支持的特性转换成能够直接运行的代码</li>\\n</ul>","autoDesc":true}')}}]);