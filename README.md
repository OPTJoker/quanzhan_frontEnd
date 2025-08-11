# AI 聊天助手 - 前端应用

基于 Vite + React + TypeScript + Tailwind CSS 构建的现代化聊天界面。

## 功能特性

- ✅ **现代化界面设计**：使用 Tailwind CSS 的响应式设计
- ✅ **实时聊天**：与 AI 助手进行自然对话
- ✅ **聊天管理**：创建、切换和管理多个聊天会话
- ✅ **消息历史**：保存和显示完整的对话历史
- ✅ **连接状态**：实时显示与后端的连接状态
- ✅ **错误处理**：友好的错误提示和重试机制
- ✅ **响应式布局**：适配桌面和移动设备

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite 7
- **样式框架**：Tailwind CSS 3
- **图标库**：Lucide React
- **HTTP客户端**：Axios
- **开发工具**：ESLint + 热重载

## 快速开始

### 1. 启动后端服务

```bash
cd /Users/sharon/me/code/ai
make run
```

### 2. 启动前端开发服务器

```bash
cd frontend
npm run dev
```

访问 http://localhost:3000

### 3. 开始使用

1. 点击"新建聊天"创建对话
2. 在输入框中输入消息
3. 按 Enter 发送，Shift+Enter 换行
4. 享受与 AI 助手的对话！

## 项目结构

```
src/
├── components/          # React 组件
│   ├── ChatList.tsx    # 聊天列表组件
│   ├── MessageList.tsx # 消息显示组件
│   └── MessageInput.tsx# 消息输入组件
├── hooks/              # 自定义 Hooks
│   └── useChat.ts      # 聊天状态管理
├── services/           # API 服务层
│   └── chatApi.ts      # 后端 API 调用
├── types/              # TypeScript 类型定义
│   └── api.ts          # API 响应类型
├── App.tsx             # 主应用组件
└── main.tsx            # 应用入口
```

## API 集成

前端通过以下 API 端点与 Go 后端通信：

- `GET /api/v1/chats` - 获取聊天列表
- `POST /api/v1/chats` - 创建新聊天
- `GET /api/v1/chats/:sessionId` - 获取聊天历史
- `POST /api/v1/chats/:sessionId/messages` - 发送消息
- `GET /health` - 健康检查

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

## 环境要求

- Node.js 18+
- npm 或 yarn
- 后端 Go API 服务运行在 localhost:8080
