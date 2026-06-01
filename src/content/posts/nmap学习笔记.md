---
title: nmap学习笔记
published: 2025-12-06
description: ""
image: ""
tags:
  - "笔记"
category: "笔记"
draft: false
lang: ""
---

## nmap 学习笔记

## 总览

`nmap [<Scan Type> ...] [<Options>] {<target specification>}`

> `[ ... ]` optional
> `{ ... }` require

## 一次代表性 Nmap 扫描

```bash
~ ❯ nmap -A -T4 scanme.nmap.org

Starting Nmap 7.93 ( https://nmap.org ) at 2025-12-05 11:27 CST
Nmap scan report for scanme.nmap.org (45.33.32.156)
Host is up (0.13s latency).
Other addresses for scanme.nmap.org (not scanned): 2600:3c01::f03c:91ff:fe18:bb2f
Not shown: 995 closed tcp ports (reset)
PORT      STATE    SERVICE    VERSION
22/tcp    open     ssh        OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.13 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   1024 ac00a01a82ffcc5599dc672b34976b75 (DSA)
|   2048 203d2d44622ab05a9db5b30514c2a6b2 (RSA)
|   256 9602bb5e57541c4e452f564c4a24b257 (ECDSA)
|_  256 33fa910fe0e17b1f6d05a2b0f1544156 (ED25519)
25/tcp    filtered smtp
80/tcp    open     http       Apache httpd 2.4.7 ((Ubuntu))
|_http-title: Go ahead and ScanMe!
|_http-favicon: Nmap Project
|_http-server-header: Apache/2.4.7 (Ubuntu)
9929/tcp  open     nping-echo Nping echo
31337/tcp open     tcpwrapped
Device type: general purpose
Running: Linux 4.X|5.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5
OS details: Linux 4.15 - 5.6
Network Distance: 18 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 80/tcp)
HOP RTT       ADDRESS
1   3.57 ms   11.73.1.158
2   9.77 ms   11.73.1.217
3   4.83 ms   10.216.247.202
4   3.55 ms   117.49.36.154
5   4.14 ms   10.216.224.170
6   5.33 ms   101.95.211.117
7   6.62 ms   101.95.208.9
8   ...
9   6.17 ms   202.97.24.242
10  7.59 ms   202.97.90.57
11  160.14 ms 202.97.92.78
12  143.93 ms 218.30.53.51
13  128.46 ms ae-3.akamai.snjsca04.us.bb.gin.ntt.net (140.174.21.78)
14  131.68 ms ae22.gw3.scz1.netarch.akamai.com (23.203.158.51)
15  ... 17
18  127.14 ms scanme.nmap.org (45.33.32.156)

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 41.12 seconds
```

## 示例

---

1. 先快速看看哪些主机在线

```bash
nmap -sn 192.168.1.0/24          # 局域网 ping 扫描，输出存活列表
```

---

1. 批量扫内网热门端口，结果保存成 CSV 给 Excel

```bash
nmap -sS -F -oG - 192.168.1.0/24 | awk '{print $2","$5}' > live_ports.csv
```

`-F` 只扫 nmap-services 里的 100 个高频端口；`-oG` 输出 grepable 格式，方便 awk 摘列

---

1. 定位 Web 资产（80、443、8080-8090）并识别服务版本

```bash
nmap -sV -p80,443,8080-8090 -T4 --open 10.0.0.0/8
```

`-sV` 启用服务/版本探测；`--open` 只显示确定打开的端口，减少噪音；`-T4` 在千兆内网基本不掉包

---

1. 防火墙绕个小弯：碎片化 + 随机顺序 + 假源地址

```bash
nmap -sS -f -r -D 1.1.1.1,8.8.8.8,ME -S 4.4.4.4 -e eth0  target.com
```

`-f` 分片 IP 包；`-D` 把 1.1.1.1/8.8.8.8 当诱饵，同时保留真实地址 ME；`-S` 伪造源 IP（出接口需对端路由可达，实验环境用）。

---

1. 定向暴力全端口 + OS 检测，结果写三份（normal/XML/HTML）

```bash
nmap -A -p- -T5 --min-rate=1000 --max-rtt-timeout=200ms -oA full_scan  target_ip
```

`-A` 等价于 `-O -sV -sC --traceroute`；`-p-` 全端口 1-65535；`-T5` 最高速

---

1. 续扫

```bash
nmap --resume full_scan.nmap   # 只支持 normal/-oN 格式续扫
```
