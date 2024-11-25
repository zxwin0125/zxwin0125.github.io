"use strict";(self.webpackChunklearn_data=self.webpackChunklearn_data||[]).push([[4012],{3386:(i,s)=>{s.A=(i,s)=>{const a=i.__vccOpts||i;for(const[i,e]of s)a[i]=e;return a}},6061:(i,s,a)=>{a.r(s),a.d(s,{comp:()=>n,data:()=>t});var e=a(6254);const l={},n=(0,a(3386).A)(l,[["render",function(i,s){const a=(0,e.g2)("font");return(0,e.uX)(),(0,e.CE)("div",null,[s[5]||(s[5]=(0,e.Fv)('<h3 id="sessionstorage-与-localstorage-有何区别" tabindex="-1"><a class="header-anchor" href="#sessionstorage-与-localstorage-有何区别"><span>sessionStorage 与 localStorage 有何区别</span></a></h3><blockquote><p>题目：sessionStorage 与 localStorage 有何区别</p></blockquote><ul><li>localStorage 生命周期是永久，除非自主清除</li><li>sessionStorage 生命周期为当前窗口或标签页，关闭窗口或标签页则会清除数据</li><li>localStorage、sessionStorage 都只能存储字符串类型的对象</li><li>不同浏览器无法共享 localStorage 或 sessionStorage 中的信息</li><li>相同浏览器的不同页面间可以共享相同的 localStorage（页面属于相同域名和端口），但是不同页面或标签页间无法共享sessionStorage 的信息</li></ul><div class="hint-container warning"><p class="hint-container-title">注意</p><p>页面及标签页仅指顶级窗口，如果一个标签页包含多个 iframe 标签且他们属于同源页面，那么他们之间是可以共享sessionStorage 的</p></div><h3 id="如何设置一个支持过期时间的-localstorage" tabindex="-1"><a class="header-anchor" href="#如何设置一个支持过期时间的-localstorage"><span>如何设置一个支持过期时间的 localStorage</span></a></h3><blockquote><p>题目：如何设置一个支持过期时间的 localStorage</p></blockquote><ul><li>设置如下数据结构，当用户存储数据时，存储至 __value 字段，并将过期时间存储至 __expires 字段</li></ul><div class="language-javascript line-numbers-mode" data-highlighter="shiki" data-ext="javascript" data-title="javascript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">{  </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">__value</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">__expires</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ul><li>而当每次获取数据时，判断当前时间是否已超过 __expires 过期时间，如果超过，则返回 undefined，并删除该数据</li></ul><h3 id="cookie-属性" tabindex="-1"><a class="header-anchor" href="#cookie-属性"><span>Cookie 属性</span></a></h3><blockquote><p>题目：浏览器中 cookie 有哪些字段</p></blockquote><ul><li>Cookie 有以下属性 <ul><li>Domain</li><li>Path</li><li>Expire/MaxAge</li><li>HttpOnly: 是否允许被 JavaScript 操作</li><li>Secure: 只能在 HTTPS 连接中配置</li><li>SameSite</li></ul></li></ul><h3 id="cookie-maxage" tabindex="-1"><a class="header-anchor" href="#cookie-maxage"><span>Cookie maxAge</span></a></h3><blockquote><p>题目：当 cookie 没有设置 maxage 时，cookie 会存在多久</p></blockquote><ul><li>如果没有 maxAge，则 cookie 的有效时间为会话时间</li></ul><h3 id="cookie-samesite" tabindex="-1"><a class="header-anchor" href="#cookie-samesite"><span>Cookie SameSite</span></a></h3><blockquote><p>题目：SameSite Cookie 有哪些值，是如何预防 CSRF 攻击的？</p></blockquote><blockquote><p>见文档 <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value" target="_blank" rel="noopener noreferrer">SameSite Cookie - MDN</a></p></blockquote><ul><li>None: 任何情况下都会向第三方网站请求发送 Cookie</li><li>Lax: 只有导航到第三方网站的 Get 链接会发送 Cookie，跨域的图片、iframe、form 表单都不会发送 Cookie</li><li>Strict: 任何情况下都不会向第三方网站请求发送 Cookie</li></ul><div class="hint-container info"><p class="hint-container-title">相关信息</p><p>目前，主流浏览器 Same-Site 的默认值为 Lax，而在以前是 None，将会预防大部分 CSRF 攻击，如果需要手动指定 Same-Site 为 None，需要指定 Cookie 属性 Secure，即在 https 下发送</p></div><h3 id="cookie-增删改查" tabindex="-1"><a class="header-anchor" href="#cookie-增删改查"><span>Cookie 增删改查</span></a></h3><blockquote><p>题目：如何设置一个 Cookie 题目：如何删除一个 Cookie</p></blockquote><ul><li>通过把该 cookie 的过期时间改为过去时即可删除成功，具体操作的话可以通过操作两个字段来完成</li></ul><ol><li>max-age: 将要过期的最大秒数，设置为 -1 即可删除</li><li>expires: 将要过期的绝对时间，存储到 cookies 中需要通过 date.toUTCString() 处理，设置为过期时间即可删除</li></ol><ul><li>很明显，max-age 更为简单，以下代码可在命令行控制台中进行测试</li></ul><div class="language-javascript line-numbers-mode" data-highlighter="shiki" data-ext="javascript" data-title="javascript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">// max-age 设置为 -1 即可成功</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">document</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">cookie</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;a=3; max-age=-1&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-highlighter="shiki" data-ext="javascript" data-title="javascript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> document</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">cookie</span></span>\n<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">&lt;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;&quot;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> </span></span>\n<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> document</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">cookie</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;a=3&#39;</span></span>\n<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">&lt;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;a=3&quot;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> </span></span>\n<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> document</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">cookie</span></span>\n<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">&lt;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;a=3&quot;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> </span></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">// 把该字段的 max-age 设置为 -1</span></span>\n<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> document</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">cookie</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;a=3; max-age=-1&#39;</span></span>\n<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">&lt;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;a=3; max-age=-1&quot;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> </span></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">// 删除成功</span></span>\n<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> document</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">cookie</span></span>\n<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">&lt;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>同时，也可以使用最新关于 cookie 操作的 API: CookieStore API 其中的 cookieStore.delete(name) 删除某个 cookie</li></ul><h3 id="clipboard-api" tabindex="-1"><a class="header-anchor" href="#clipboard-api"><span>ClipBoard API</span></a></h3><blockquote><p>题目：在浏览器中如何获取剪切板中内容 题目：浏览器的剪切板中如何监听复制事件 题目：如何实现页面文本不可复制</p></blockquote><ul><li>通过 Clipboard API 可以获取剪切板中内容，但需要获取到 clipboard-read 的权限，以下是关于读取剪贴板内容的代码：</li></ul><div class="language-javascript line-numbers-mode" data-highlighter="shiki" data-ext="javascript" data-title="javascript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">// 是否能够有读取剪贴板的权限</span></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">// result.state == &quot;granted&quot; || result.state == &quot;prompt&quot;</span></span>\n<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> result</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> await</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> navigator</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">permissions</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">query</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">({ </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">name</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;clipboard-read&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> })</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> </span></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">// 获取剪贴板内容</span></span>\n<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> text</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> await</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> navigator</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">clipboard</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">readText</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">注意</p><p>该方法在 devtools 中不生效</p></div><ul><li>有 CSS 和 JS 两种方法禁止复制，以下任选其一或结合使用</li><li>使用 CSS 如下：</li></ul><div class="language-css line-numbers-mode" data-highlighter="shiki" data-ext="css" data-title="css" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">user-select</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">: none;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ul><li>或使用 JS 如下，监听 selectstart 事件，禁止选中</li><li>当用户选中一片区域时，将触发 selectstart 事件，Selection API 将会选中一片区域</li><li>禁止选中区域即可实现页面文本不可复制</li></ul><div class="language-javascript line-numbers-mode" data-highlighter="shiki" data-ext="javascript" data-title="javascript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">document</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">body</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">onselectstart</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;"> e</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> =&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {  </span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">  e</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">preventDefault</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> </span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">document</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">body</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">oncopy</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;"> e</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> =&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {  </span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">  e</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">preventDefault</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="fetch-中-credentials-指什么意思" tabindex="-1"><a class="header-anchor" href="#fetch-中-credentials-指什么意思"><span>fetch 中 credentials 指什么意思</span></a></h3><blockquote><p>题目：fetch 中 credentials 指什么意思</p></blockquote><ul><li>credentials 指在使用 fetch 发送请求时是否应当发送 cookie <ul><li>omit: 从不发送 cookie</li><li>same-origin: 同源时发送 cookie (浏览器默认值)</li><li>include: 同源与跨域时都发送 cookie</li></ul></li></ul><h3 id="如何取消请求的发送" tabindex="-1"><a class="header-anchor" href="#如何取消请求的发送"><span>如何取消请求的发送</span></a></h3><blockquote><p>题目：如何取消请求的发送</p></blockquote><ul><li>以下两种 API 的方式如下 <ul><li>XHR 使用 xhr.abort()</li><li>fetch 使用 AbortController</li></ul></li></ul><h3 id="如何判断在移动端" tabindex="-1"><a class="header-anchor" href="#如何判断在移动端"><span>如何判断在移动端</span></a></h3><blockquote><p>题目：如何判断当前环境是移动端还是 PC 端</p></blockquote><ul><li>判断 navigator.userAgent，对于 Android/iPhone 可以匹配以下正则</li></ul><div class="language-javascript line-numbers-mode" data-highlighter="shiki" data-ext="javascript" data-title="javascript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> appleIphone</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#0184BC;--shiki-dark:#E06C75;"> /iPhone/</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">i</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>\n<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> appleIpod</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#0184BC;--shiki-dark:#E06C75;"> /iPod/</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">i</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>\n<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> appleTablet</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#0184BC;--shiki-dark:#E06C75;"> /iPad/</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">i</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>\n<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> androidPhone</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#0184BC;--shiki-dark:#E06C75;"> /</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">\\b</span><span style="--shiki-light:#0184BC;--shiki-dark:#E06C75;">Android(?:</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">.</span><span style="--shiki-light:#0184BC;--shiki-dark:#D19A66;">+</span><span style="--shiki-light:#0184BC;--shiki-dark:#E06C75;">)Mobile</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">\\b</span><span style="--shiki-light:#0184BC;--shiki-dark:#E06C75;">/</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">i</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">; </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">// Match &#39;Android&#39; AND &#39;Mobile&#39;</span></span>\n<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> androidTablet</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#0184BC;--shiki-dark:#E06C75;"> /Android/</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">i</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>推荐一个库: <a href="https://github.com/kaimallea/isMobile" target="_blank" rel="noopener noreferrer">ismobilejs</a></li></ul><div class="language-javascript line-numbers-mode" data-highlighter="shiki" data-ext="javascript" data-title="javascript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">import</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> isMobile</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> from</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;ismobilejs&#39;</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> </span></span>\n<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> mobile</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> isMobile</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="requestidlecallback" tabindex="-1"><a class="header-anchor" href="#requestidlecallback"><span>requestIdleCallback</span></a></h3><blockquote><p>题目：简单介绍 requestIdleCallback 及使用场景</p></blockquote><ul><li>requestIdleCallback 维护一个队列，将在浏览器空闲时间内执行</li><li>它属于 Background Tasks API，可以使用 setTimeout 来模拟实现</li></ul><div class="language-javascript line-numbers-mode" data-highlighter="shiki" data-ext="javascript" data-title="javascript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">window</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">requestIdleCallback</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> window</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">requestIdleCallback</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> ||</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> function</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">handler</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) {</span></span>\n<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">  let</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> startTime</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> Date</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">now</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> </span></span>\n<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">  return</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> setTimeout</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">function</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">() {</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    handler</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">({</span></span>\n<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">      didTimeout</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> false</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">      timeRemaining</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> function</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">() {</span></span>\n<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        return</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> Math</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">max</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">50.0</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">Date</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">now</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">() </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> startTime</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">));</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      }</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    });</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  }, </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">1</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>\n<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>以上实现过于复杂以及细节化，也可以像 swr 一样做一个简单的模拟实现，见<a href="https://github.com/vercel/swr/blob/8670be8072b0c223bc1c040deccd2e69e8978aad/src/use-swr.ts#L33" target="_blank" rel="noopener noreferrer">代码</a></li></ul><div class="language-javascript line-numbers-mode" data-highlighter="shiki" data-ext="javascript" data-title="javascript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> rIC</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> window</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;requestIdleCallback&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">] </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">||</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">f</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> =&gt;</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> setTimeout</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">f</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">1</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">))</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="hint-container warning"><p class="hint-container-title">注意</p><p>在 rIC 中执行任务时需要注意以下几点：</p><ul><li>执行重计算而非紧急任务</li><li>空闲回调执行时间应该小于 50ms，最好更少</li><li>空闲回调中不要操作 DOM，因为它本来就是利用的重排重绘后的间隙空闲时间，重新操作 DOM 又会造成重排重绘</li></ul></div><h3 id="如何把-dom-转化为图片" tabindex="-1"><a class="header-anchor" href="#如何把-dom-转化为图片"><span>如何把 DOM 转化为图片</span></a></h3><blockquote><p>题目：如何把 DOM 转化为图片</p></blockquote><ul><li><a href="https://html2canvas.hertzen.com/" target="_blank" rel="noopener noreferrer">html2canvas</a>: Screenshots with JavaScript</li><li><a href="https://github.com/tsayen/dom-to-image" target="_blank" rel="noopener noreferrer">dom-to-image</a>: Generates an image from a DOM node using HTML5 canvas</li></ul><h3 id="异步加载-js-脚本时-async-与-defer-有何区别" tabindex="-1"><a class="header-anchor" href="#异步加载-js-脚本时-async-与-defer-有何区别"><span>异步加载 JS 脚本时，async 与 defer 有何区别</span></a></h3><blockquote><p>题目：异步加载 JS 脚本时，async 与 defer 有何区别</p></blockquote><ul><li>以下图片取自 whatwg 的规范，可以说是最权威的图文解释了</li></ul><p><a href="https://html.spec.whatwg.org/images/asyncdefer.svg" target="_blank" rel="noopener noreferrer">!示意图</a></p>',63)),(0,e.Lk)("ul",null,[s[4]||(s[4]=(0,e.Lk)("li",null,[(0,e.eW)("在正常情况下，即 "),(0,e.Lk)("code",null,"<script>"),(0,e.eW)(" 没有任何额外属性标记的情况下，有几点共识 "),(0,e.Lk)("ol",null,[(0,e.Lk)("li",null,"JS 的脚本分为加载、解析、执行几个步骤，简单对应到图中就是 fetch (加载) 和 execution (解析并执行)"),(0,e.Lk)("li",null,"JS 的脚本加载(fetch)且执行(execution)会阻塞 DOM 的渲染，因此 JS 一般放到最后头")])],-1)),(0,e.Lk)("li",null,[s[3]||(s[3]=(0,e.eW)("而 defer 与 async 的区别如下: ")),(0,e.Lk)("ul",null,[(0,e.Lk)("li",null,[s[1]||(s[1]=(0,e.eW)("相同点: ")),(0,e.Lk)("strong",null,[(0,e.bF)(a,{color:"red"},{default:(0,e.k6)((()=>s[0]||(s[0]=[(0,e.eW)("异步加载 (fetch)")]))),_:1})])]),s[2]||(s[2]=(0,e.Lk)("li",null,[(0,e.eW)("不同点: "),(0,e.Lk)("ul",null,[(0,e.Lk)("li",null,"async 加载(fetch)完成后立即执行 (execution)，因此可能会阻塞 DOM 解析"),(0,e.Lk)("li",null,"defer 加载(fetch)完成后延迟到 DOM 解析完成后才会执行(execution)，但会在事件 DomContentLoaded 之前")])],-1))])])])])}]]),t=JSON.parse('{"path":"/knowledge/interview/webAPI/","title":"webAPI 面试重点","lang":"zh-CN","frontmatter":{"title":"webAPI 面试重点","category":["面试"],"tag":["webAPI"],"description":"sessionStorage 与 localStorage 有何区别 题目：sessionStorage 与 localStorage 有何区别 localStorage 生命周期是永久，除非自主清除 sessionStorage 生命周期为当前窗口或标签页，关闭窗口或标签页则会清除数据 localStorage、sessionStorage 都只能存...","head":[["meta",{"property":"og:url","content":"https://www.zxwin0125.top/knowledge/interview/webAPI/"}],["meta",{"property":"og:site_name","content":"欢迎来到我的Blog"}],["meta",{"property":"og:title","content":"webAPI 面试重点"}],["meta",{"property":"og:description","content":"sessionStorage 与 localStorage 有何区别 题目：sessionStorage 与 localStorage 有何区别 localStorage 生命周期是永久，除非自主清除 sessionStorage 生命周期为当前窗口或标签页，关闭窗口或标签页则会清除数据 localStorage、sessionStorage 都只能存..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-11-25T11:31:08.000Z"}],["meta",{"property":"article:tag","content":"webAPI"}],["meta",{"property":"article:modified_time","content":"2024-11-25T11:31:08.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"webAPI 面试重点\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-11-25T11:31:08.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"三金\\",\\"url\\":\\"https://www.zxwin0125.top\\"}]}"]]},"headers":[{"level":3,"title":"sessionStorage 与 localStorage 有何区别","slug":"sessionstorage-与-localstorage-有何区别","link":"#sessionstorage-与-localstorage-有何区别","children":[]},{"level":3,"title":"如何设置一个支持过期时间的 localStorage","slug":"如何设置一个支持过期时间的-localstorage","link":"#如何设置一个支持过期时间的-localstorage","children":[]},{"level":3,"title":"Cookie 属性","slug":"cookie-属性","link":"#cookie-属性","children":[]},{"level":3,"title":"Cookie maxAge","slug":"cookie-maxage","link":"#cookie-maxage","children":[]},{"level":3,"title":"Cookie SameSite","slug":"cookie-samesite","link":"#cookie-samesite","children":[]},{"level":3,"title":"Cookie 增删改查","slug":"cookie-增删改查","link":"#cookie-增删改查","children":[]},{"level":3,"title":"ClipBoard API","slug":"clipboard-api","link":"#clipboard-api","children":[]},{"level":3,"title":"fetch 中 credentials 指什么意思","slug":"fetch-中-credentials-指什么意思","link":"#fetch-中-credentials-指什么意思","children":[]},{"level":3,"title":"如何取消请求的发送","slug":"如何取消请求的发送","link":"#如何取消请求的发送","children":[]},{"level":3,"title":"如何判断在移动端","slug":"如何判断在移动端","link":"#如何判断在移动端","children":[]},{"level":3,"title":"requestIdleCallback","slug":"requestidlecallback","link":"#requestidlecallback","children":[]},{"level":3,"title":"如何把 DOM 转化为图片","slug":"如何把-dom-转化为图片","link":"#如何把-dom-转化为图片","children":[]},{"level":3,"title":"异步加载 JS 脚本时，async 与 defer 有何区别","slug":"异步加载-js-脚本时-async-与-defer-有何区别","link":"#异步加载-js-脚本时-async-与-defer-有何区别","children":[]}],"git":{"createdTime":1732534268000,"updatedTime":1732534268000,"contributors":[{"name":"zxwin0125","email":"zxwin_0125@163.com","commits":1}]},"readingTime":{"minutes":5.58,"words":1674},"filePathRelative":"knowledge/interview/webAPI/index.md","localizedDate":"2024年11月25日","excerpt":"<h3>sessionStorage 与 localStorage 有何区别</h3>\\n<blockquote>\\n<p>题目：sessionStorage 与 localStorage 有何区别</p>\\n</blockquote>","autoDesc":true}')}}]);