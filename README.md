# QX Rewrite Hub

一个用于收集和维护 **Quantumult X / 圈X** 重写规则的仓库。

## 当前内容

- `rewrites/dingding-smart.conf`：叮叮智能（`com.lancens.wxdoorbell`）去广告实验版

## 使用方式

### Quantumult X 远程重写
将以下链接加入 `[rewrite_remote]`：

```ini
https://raw.githubusercontent.com/yunhugy/qx-rewrite-hub/main/rewrites/dingding-smart.conf, tag=叮叮智能去广告, enabled=true
```

## 说明

- 当前 `叮叮智能` 规则为 **实验版**，策略以“保守屏蔽常见广告/开屏/推广接口”为主。
- 如果后续抓到更准确的请求域名、接口路径、返回结构，可继续在此仓库追加更精准规则。
- 后续可继续增加更多 App 的 QX Rewrite 规则。

## 目录结构

```text
rewrites/
  dingding-smart.conf
README.md
```

## 维护建议

后续新增规则时建议：
1. 每个 App 单独一个 `.conf`
2. 文件头写明 App 名称、bundle id、状态（实验版/稳定版）
3. 若需要 HTTPS 解密，写明 `hostname`
4. 尽量先用最小规则集，避免误伤核心功能
