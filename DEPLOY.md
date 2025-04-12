# 向阳乔木博客系统部署指南

这是一个基于Next.js的个人博客系统，支持Markdown和HTML文章，具有完整的后台管理功能。本指南将帮助您快速部署此博客系统。

## 目录

- [系统要求](#系统要求)
- [快速部署](#快速部署)
- [详细部署步骤](#详细部署步骤)
- [配置说明](#配置说明)
- [常见问题](#常见问题)
- [更新博客](#更新博客)

## 系统要求

- Node.js 18.x 或更高版本
- npm 9.x 或更高版本
- 约 100MB 磁盘空间（不包括后续上传的图片和内容）

## 快速部署

如果您想快速部署，可以使用以下命令：

```bash
# 克隆仓库
git clone https://github.com/joeseesun/qiaomu_website.git
cd qiaomu_website

# 安装依赖
npm install

# 初始化数据库
npm run init-db

# 创建管理员账户
npm run create-admin

# 构建生产版本
npm run build

# 启动服务器
npm start
```

然后访问 `http://localhost:3000` 即可查看您的博客，管理后台位于 `http://localhost:3000/admin`。

## 详细部署步骤

### 1. 克隆仓库

```bash
git clone https://github.com/joeseesun/qiaomu_website.git
cd qiaomu_website
```

### 2. 安装依赖

```bash
npm install
```

### 3. 初始化数据库

博客系统使用SQLite作为数据库，无需额外安装数据库服务器。运行以下命令初始化数据库：

```bash
npm run init-db
```

这将创建一个名为`blog.db`的SQLite数据库文件，并设置必要的表结构。

### 4. 创建管理员账户

```bash
npm run create-admin
```

按照提示输入管理员邮箱和密码。

### 5. 配置环境变量（可选）

复制`.env.example`文件为`.env.local`：

```bash
cp .env.example .env.local
```

根据需要编辑`.env.local`文件，修改配置项。

### 6. 构建生产版本

```bash
npm run build
```

### 7. 启动服务器

开发模式（带有热重载）：

```bash
npm run dev
```

生产模式：

```bash
npm start
```

### 8. 访问博客

- 博客前台：`http://localhost:3000`
- 管理后台：`http://localhost:3000/admin`

## 配置说明

### 基本配置

编辑`.env.local`文件可以修改以下配置：

```
# 服务器端口
PORT=3000

# JWT密钥（用于管理员登录）
JWT_SECRET=your_jwt_secret_key

# 上传文件存储路径
UPLOAD_DIR=public/uploads

# 网站URL（用于生成绝对URL）
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 自定义上传目录

默认情况下，上传的图片会保存在`public/uploads`目录中。如果您想更改此设置，请修改`.env.local`文件中的`UPLOAD_DIR`变量。

### 数据库位置

默认情况下，数据库文件`blog.db`位于项目根目录。如果您想更改数据库位置，请修改`src/lib/db.ts`文件中的数据库路径。

## 使用Docker部署（可选）

如果您熟悉Docker，也可以使用Docker部署：

```bash
# 构建Docker镜像
docker build -t qiaomu-blog .

# 运行容器
docker run -p 3000:3000 -v $(pwd)/blog.db:/app/blog.db -v $(pwd)/public/uploads:/app/public/uploads qiaomu-blog
```

## 常见问题

### 1. 如何备份数据？

博客数据存储在SQLite数据库文件`blog.db`中，只需备份此文件即可。上传的图片存储在`public/uploads`目录，也需要一并备份。

```bash
# 备份数据库和上传文件
cp blog.db blog.db.backup
cp -r public/uploads public/uploads.backup
```

### 2. 如何重置管理员密码？

如果忘记了管理员密码，可以使用以下命令重置：

```bash
npm run reset-admin
```

### 3. 如何更改端口？

编辑`.env.local`文件，修改`PORT`变量，然后重启服务器。

## 更新博客

当有新版本发布时，您可以按照以下步骤更新博客：

```bash
# 拉取最新代码
git pull

# 安装依赖
npm install

# 运行数据库迁移（如果有）
npm run migrate

# 重新构建
npm run build

# 重启服务器
npm start
```

## 生产环境部署建议

对于生产环境，建议使用PM2或类似工具来管理Node.js进程：

```bash
# 安装PM2
npm install -g pm2

# 使用PM2启动应用
pm2 start npm --name "qiaomu-blog" -- start

# 设置开机自启
pm2 startup
pm2 save
```

## 支持与贡献

如果您遇到任何问题或有改进建议，请在GitHub仓库提交Issue或Pull Request。

---

祝您使用愉快！
