# Cursor通用解决方案

## 准备 3-5 个知名品牌邮箱

> [!tip]
> Gmail、GitHub、微软、雅虎、163、QQ 等等都行

使用一个邮箱注册并使用 Cursor，直到出现「limit」或「High Load」提示

## 注销账号

步骤：用户头像 -> Setting -> 左下角 Advanced -> Delete Account

## 刷新机器码

### Mac OS

#### 方式一

```sh
curl -fsSL https://raw.githubusercontent.com/yuaotian/go-cursor-help/refs/heads/master/scripts/run/cursor_mac_id_modifier.sh | tee /tmp/cursor_mac_id_modifier.sh  sudo chown root:wheel /tmp/cursor_mac_id_modifier.sh  sudo chmod +x /tmp/cursor_mac_id_modifier.sh  sudo bash /tmp/cursor_mac_id_modifier.sh  rm /tmp/cursor_mac_id_modifier.sh 
```

#### 方式二

```sh
curl -fsSL https://aizaozao.com/accelerate.php/https://raw.githubusercontent.com/yuaotian/go-cursor-help/refs/heads/master/scripts/run/cursor_mac_id_modifier.sh -o ./cursor_mac_id_modifier.sh  sudo bash ./cursor_mac_id_modifier.sh  rm ./cursor_mac_id_modifier.sh
```

### Linux

```sh
curl -fsSL https://aizaozao.com/accelerate.php/https://raw.githubusercontent.com/yuaotian/go-cursor-help/refs/heads/master/scripts/run/cursor_linux_id_modifier.sh | sudo bash
```

### Window

```sh
irm https://aizaozao.com/accelerate.php/https://raw.githubusercontent.com/yuaotian/go-cursor-help/refs/heads/master/scripts/run/cursor_win_id_modifier.ps1 | iex
```

## 重新注册账号

## 异常处理

重新注册账号不可用、无法删除账号等等一大堆问题，一般是浏览器被风控了，换个浏览器「edge、Google、火狐」或者使用指纹浏览器
