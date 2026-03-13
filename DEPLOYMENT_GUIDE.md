# VocabMaster 官网部署规范

## ⚠️ 重要警告

**绝对禁止将 mobile 版本部署到主域名！**

主域名 `https://vocabmaster-2my.pages.dev/` 必须保留给**官网桌面版**使用。

---

## 事故说明（2026-03-13）

### 问题描述

开发 agent 在部署 HORD mobile 版本时，错误地将 mobile 界面部署到了主域名，导致：
- 主域名显示 "HORD 手机管理器" 而不是 "HORD · 霍德英语学习管家"
- 官网桌面版用户访问时看到移动端界面
- 品牌形象受损

### 根本原因

使用 Wrangler CLI 部署时，没有正确指定部署路径，导致 mobile 文件覆盖了官网根目录。

---

## 部署规范

### 1. 官网桌面版（主域名）

**用途：** 桌面用户、产品介绍、购买页面

**部署路径：** 根目录 `/`

**部署命令：**
```bash
cd "Vocab-Master WEB"
wrangler pages deploy . --project-name=vocabmaster --branch=main
```

**Cloudflare Pages 配置：**
- 项目名称：`vocabmaster`
- 分支：`main`
- 构建输出目录：`/`（根目录）
- 构建命令：留空（无需构建）

**包含文件：**
```
index.html          # 官网首页
buy.html            # 购买页面
activate.html       # 激活页面
install.html        # 安装指南
logo.png            # 官网 Logo
logos/              # Logo 资源
screens/            # 截图展示
```

---

### 2. Mobile 版本（子路径）

**用途：** 移动端用户、PWA 应用

**部署路径：** `/mobile` 子路径

**部署命令：**
```bash
cd "Vocab-Master WEB"
wrangler pages deploy mobile --project-name=vocabmaster --branch=mobile --commit-dirty=true
```

**Cloudflare Pages 配置：**
- 项目名称：`vocabmaster`（同一项目）
- 分支：`mobile`（单独分支）
- 构建输出目录：`mobile/`
- 访问地址：`https://vocabmaster-2my.pages.dev/mobile/`

**包含文件：**
```
mobile/index.html
mobile/mobile.css
mobile/mobile.js
mobile/manifest.webmanifest
```

---

## 开发检查清单

在部署前，必须确认以下内容：

### ✅ 部署前检查

- [ ] 确认要部署的是**桌面版**还是**移动版**
- [ ] 桌面版 → 部署到根目录 `/`
- [ ] 移动版 → 部署到子路径 `/mobile`
- [ ] 检查 `index.html` 的 `<title>` 标签：
  - 桌面版：`HORD · 霍德英语学习管家 — Hold Your Word`
  - 移动版：`HORD 手机管理器`
- [ ] 在 Cloudflare Pages 控制台确认构建输出目录配置

### ✅ 部署后验证

- [ ] 访问主域名确认显示桌面版
- [ ] 访问 `/mobile/` 确认显示移动版
- [ ] 检查页面功能是否正常

---

## 快速识别方法

### 如何判断部署是否正确

访问主域名后，检查页面标题：

**✅ 正确（桌面版）：**
```
HORD · 霍德英语学习管家 — Hold Your Word
```

**❌ 错误（移动版）：**
```
HORD 手机管理器
```

---

## 文件结构规范

```
Vocab-Master WEB/
├── index.html              # 桌面版首页（根目录）
├── buy.html                # 购买页面
├── activate.html           # 激活页面
├── install.html            # 安装指南
├── wrangler.toml           # Cloudflare 部署配置
├── mobile/                 # 移动端文件（单独目录）
│   ├── index.html
│   ├── mobile.css
│   └── mobile.js
└── logos/
└── screens/
```

---

## Wrangler 配置说明

### wrangler.toml（根目录）

```toml
name = "vocabmaster"
compatibility_date = "2024-01-01"

[site]
bucket = "./"

[build]
command = ""
```

**注意：**
- `bucket = "./"` 表示部署根目录
- 不要修改为 `mobile/`

---

## 如果再次发生错误

### 紧急恢复步骤

1. **立即停止部署**
2. **从备份恢复：**
   ```bash
   cd "Vocab-Master WEB"
   rsync -av .deploy_origin_main/ ./
   git add -A
   git commit -m "fix: 恢复官网桌面版"
   git push origin main
   ```

3. **在 Cloudflare 控制台重新部署：**
   - 进入 Pages → vocabmaster → Deployments
   - 点击 **Retry Deployment**
   - 或手动触发新的部署

4. **验证恢复：**
   - 访问主域名确认显示桌面版
   - 清除浏览器缓存后再次验证

---

## 联系信息

如有部署相关问题，请先检查本文档。

**关键原则：**
> 桌面版和移动版必须物理隔离，永远不要将 mobile 目录的内容部署到根目录！

---

**最后更新：** 2026-03-13
**事故记录：** 2026-03-13 mobile 版本错误占用主域名
