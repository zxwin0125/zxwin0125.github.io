# 移动端 H5 注意事项总结

> [!tip]
> 因为 HTML5 强大的能力，所以很快就开启了一场开发的变革，在国内，体现最明显的就是各种 H5 移动页面
> 
> 但是由于移动端的碎片化现象，以及技术落地的成熟度不高，造成了不少的问题，那么移动端开发 H5 有哪些坑以及小技巧呢？

## 打电话发短信写邮件的小技巧

> [!tip]
> 这些技巧都和 a 标签相关

打电话

```html
<a href="tel: 110">打电话给警察局</a>
```

发短信

```html
<a href="sms: 110">发短信给警察局</a>
```

写邮件依赖「**mailto**」

```html
<a href="mailto: 110@govn.com">发邮件给警察局</a>
```

设置可以添加抄送

```html
<a href="mailto: 110@govn.com?cc=baba@family.com">发邮件给警察局，并抄送给我爸爸</a>
```

除了抄送，也可以私密发送

```html
<a href="mailto: 110@govn.com?cc=baba@family.com&bcc=mama@family.com">发邮件给警察局，并抄送给我爸爸，密送给我妈妈</a>
```

群发也可以

```html
<a href="mailto: 110@govn.com; 120@govn.com">发邮件给警察局，以及 120 急救</a>
```

既然都支持群发了，那么定义主题和内容也可以

```html
<a href="mailto: 110@govn.com?subject=SOS">发邮件给警察局，并添加救命主题</a>
```

包含内容用 body 体现

```html
<a href="mailto: 110@govn.com?subject=SOS&body=快来救我">发邮件给警察局，并添加救命主题和内容</a>
```

## 移动端 300 毫秒点击延迟以及点击穿透现象

> [!warning]
> 这是由于历史原因造成的，一般解决手段为禁止混用 touch 和 click，或者增加一层「透明」蒙层，也可以通过延迟上层元素消失来实现

点击元素禁止产生背景或边框，一般可以使用 tap-highlight-color 属性进行禁用

```css
-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
```

禁止长按链接与图片弹出菜单，一般可以使用

```css
-webkit-touch-callout: none;
```

禁止用户选中文字

```css
-webkit-user-select: none;
user-select: none;
```

取消 input 输入时，英文首字母的默认大写

```html
<input autocapitalize="off" autocorrect="off" />
```

## 语音和视频自动播放

> [!warning]
> 不同浏览器内核支持自动播放的情况不一样，甚至 webkit 内核对于自动播放的策略也一直在调整当中

自动播放有时候也带着条件：比如设置静音等

具体信息更新可以参考：[New video Policies for iOS](https://webkit.org/blog/6784/new-%20video-policies-for-ios/)

一般设置自动播放的回退策略是用户触摸屏幕时进行的播放

```JavaScript
// JS 绑定自动播放（操作 window 时，播放音乐）
$(window).on('touchstart', () => {
	video.play();
});

// 微信环境
document.addEventListener(
	'WeixinJSBridgeReady',
	() => {
		video.play();
	},
	false
);
```

## 视频全屏播放

为了使视频全屏播放，一般设置

```html
<video
	x-webkit-airplay="true"
	webkit-playsinline="true"
	preload="auto"
	autoplay
	src=""
></video>
```

> [!warning]
> 但是最终情况还是要受到浏览器引擎实现的影响

## 开启硬件加速

在做动画时，为了达到更好的性能效果，往往会选用硬件加速，一般手段为

```css
transform: translate3d(0, 0, 0);
```

## fixed 定位问题

这个问题主要体现在 iOS 端，比如软键盘弹出时，某些情况下，会影响 fixed 元素定位

配合使用 transform、translate 时，某些情况下，也会影响 fixed 元素定位

一般解决方案是模拟 fixed 定位，或者使用 iScroll 库

## 怎么让 Chrome 支持小于 12px 的文字？

一般通过 text-size-adjust 实现

```css
-webkit-text-size-adjust: none;
```
