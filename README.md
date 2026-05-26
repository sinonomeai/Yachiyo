# Yachiyo — 智能文档助手系统

集成 RAG（检索增强生成）技术，实现基于私有文档的精准问答的文档管理系统。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| UI | React 19, Tailwind CSS 4, Ant Design 6 |
| 状态管理 | Zustand (persist) |
| 数据请求 | TanStack React Query, AI SDK |
| 后端 | Next.js API Routes, PostgreSQL + pgvector |
| 认证 | JWT (jsonwebtoken + bcryptjs) |
| AI | DeepSeek API (对话), 阿里云百炼 DashScope (Embedding) |
| Markdown | react-markdown + remark-gfm + rehype-highlight |

## 项目结构

```
Yachiyo/
├── README.md
├── package.json                    # monorepo 根
├── frontend/                       # Next.js 应用
│   ├── package.json
│   ├── tsconfig.json
│   ├── proxy.ts                    # 开发代理配置
│   │
│   ├── app/                        # App Router 页面 & API
│   │   ├── layout.tsx              # 根布局
│   │   ├── globals.css             # 全局样式
│   │   ├── providers.tsx           # QueryClient + Ant Design Provider
│   │   ├── page.tsx                # 首页（重定向到登录）
│   │   ├── error.tsx               # 错误边界 (error page)
│   │   ├── not-found.tsx           # 404 页面
│   │   │
│   │   ├── login/                  # 登录/注册模块
│   │   │   ├── page.tsx
│   │   │   ├── page.module.css
│   │   │   └── components/
│   │   │       ├── Login.tsx       # 登录表单
│   │   │       ├── Register.tsx    # 注册表单
│   │   │       └── SwitchBox.tsx   # 登录/注册切换
│   │   │
│   │   ├── yachiyo/               # 主应用区
│   │   │   ├── layout.tsx         # 侧边栏 + 内容区布局
│   │   │   ├── page.tsx           # 知识库列表首页
│   │   │   ├── yachiyo.module.css
│   │   │   │
│   │   │   ├── [id]/              # 对话页（动态路由）
│   │   │   │   ├── page.tsx       # 聊天主页面
│   │   │   │   └── chat/
│   │   │   │       └── chat.tsx   # 消息列表渲染（Markdown + 流式）
│   │   │   │
│   │   │   ├── docbase/           # 知识库管理
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx       # 知识库列表
│   │   │   │   └── [baseId]/
│   │   │   │       └── page.tsx   # 知识库详情（文档上传/管理）
│   │   │   │
│   │   │   └── components/        # 应用级组件
│   │   │       ├── Input/
│   │   │       │   ├── Input.tsx           # 聊天输入框
│   │   │       │   ├── KnowledgeModal.tsx  # 知识库选择弹窗
│   │   │       │   └── Button/
│   │   │       │       └── InputButton.tsx # 输入框图标按钮
│   │   │       └── SiderBar/
│   │   │           ├── SiderBar.tsx        # 侧边栏
│   │   │           └── components/
│   │   │               ├── List/
│   │   │               │   └── List.tsx    # 会话列表
│   │   │               └── SiderLogin/
│   │   │                   └── SiderLogin.tsx # 侧边栏用户信息
│   │   │
│   │   ├── api/                   # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── register/route.ts
│   │   │   │   └── logout/route.ts
│   │   │   │
│   │   │   ├── chat/
│   │   │   │   ├── init/route.ts        # 初始化会话（含标题生成）
│   │   │   │   ├── sessions/route.ts    # 获取会话历史消息
│   │   │   │   └── stream/route.ts      # 流式对话 + RAG 检索管道
│   │   │   │
│   │   │   ├── knowledge-bases/
│   │   │   │   ├── route.ts             # 知识库 CRUD
│   │   │   │   ├── getDocument/route.ts
│   │   │   │   └── [baseId]/documents/
│   │   │   │       └── route.ts         # 文档上传/删除/重命名
│   │   │   │
│   │   │   └── initialData/
│   │   │       ├── getList/route.ts     # 获取会话列表
│   │   │       ├── getDocBases/route.ts # 获取知识库列表
│   │   │       ├── getDocuments/route.ts # 获取文档列表
│   │   │       └── getChunks/route.ts   # 获取文档切片
│   │   │
│   │   └── test/                 # 测试页面
│   │
│   ├── components/               # 公共组件
│   │   ├── Button/Button.tsx
│   │   ├── Icon/Icon.tsx         # SVG 图标组件
│   │   ├── Input/Input.tsx       # 通用输入框
│   │   └── Popup/Popup.tsx       # 通用弹窗
│   │
│   ├── hooks/                    # 自定义 Hooks
│   │   ├── useDocBasesData.ts    # 知识库/文档/切片数据查询
│   │   ├── useMessagesData.ts    # 历史消息查询
│   │   ├── useDebounce.ts
│   │   ├── useThrottle.ts
│   │   └── useMouseFollower.ts
│   │
│   ├── lib/                      # 工具库
│   │   ├── db.ts                 # PostgreSQL 连接池
│   │   ├── auth.ts               # 认证工具
│   │   ├── chunk.ts              # Markdown 分块（标题感知 + 滑动窗口）
│   │   ├── embed.ts              # 阿里云百炼 Embedding（text-embedding-v4, 1024维）
│   │   ├── chat-session.ts       # 前端会话加载
│   │   ├── chat-store.ts         # 后端消息持久化
│   │   └── docbase.ts            # 知识库/文档 CRUD API 封装
│   │
│   ├── state/stores/             # Zustand 状态管理
│   │   ├── useSiderStore.ts      # 侧边栏展开/收起
│   │   ├── useSessionsStore.ts   # 会话列表（localStorage 持久化）
│   │   ├── useModStore.ts        # 界面模式
│   │   └── useKnowledgeStore.ts  # 知识库选中状态（localStorage 持久化）
│   │
│   ├── mock/
│   │   └── db.json               # json-server 模拟数据
│   │
│   └── public/
│       └── iconfont/             # 图标字体
│
├── test.html                     # 早期测试页面
└── node_modules/
```

## 核心流程

### 文档处理流程

1. 用户创建知识库 → 上传 .md 文档
2. 服务端解析文档内容
3. `chunkMarkdown()` 按标题 + 段落分块（目标 800 字符/块，100 字符重叠）
4. `embedChunks()` 调用阿里云 DashScope `text-embedding-v4` 生成 1024 维向量
5. 向量写入 PostgreSQL `document_chunks` 表（pgvector 扩展）

### 问答流程（RAG）

1. 用户在聊天页选择知识库和文档 → 发送问题
2. 请求携带 `knowledgeBaseId` + `documentIds` 到达 `/api/chat/stream`
3. `embedSingle()` 将用户问题转为 1024 维向量
4. pgvector `<=>` 余弦距离算子检索 Top-K 相关片段
5. 检索结果拼接为上下文注入 system prompt
6. DeepSeek 流式生成答案并返回

## 已完成功能

- [x] 登录 / 注册（JWT + bcryptjs）
- [x] 404 错误页面
- [x] 知识库创建、编辑、删除
- [x] 文档上传（.md）、删除、重命名
- [x] Markdown 分块 + 向量化存储
- [x] RAG 问答（知识库选择 → 向量检索 → 上下文增强生成）
- [x] 流式回答（AI SDK stream）
- [x] 历史会话管理（侧边栏列表、自动标题生成）
- [x] 文件批量上传 + 进度显示
- [x] 路由懒加载（Next.js 动态 import）

## 数据库表

| 表名 | 用途 |
|------|------|
| `users` | 用户（id, username, password_hash, created_at） |
| `chat_sessions` | 会话（id, user_id, title, created_at, updated_at） |
| `chat_messages` | 消息（id, session_id, role, parts, created_at） |
| `knowledge_bases` | 知识库（id, user_id, name, description, created_at, updated_at） |
| `documents` | 文档（id, knowledge_base_id, filename, file_type, file_size, raw_content, total_chunks, created_at, updated_at） |
| `document_chunks` | 文档切片（id, document_id, chunk_index, content, embedding, metadata, created_at） |

## 环境变量

```bash
DASHSCOPE_API_KEY=   # 阿里云百炼（Embedding）
DEEPSEEK_API_KEY=    # DeepSeek（对话 + 标题生成）
JWT_SECRET=          # JWT 签名密钥
DB_HOST=             # PostgreSQL 主机
DB_PORT=             # PostgreSQL 端口
DB_USER=             # 数据库用户
DB_PASSWORD=         # 数据库密码
DB_NAME=             # 数据库名
```