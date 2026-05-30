# Yachiyo

AI 驱动的智能知识库问答平台，基于 DeepSeek 大模型，支持 RAG 文档检索、深度思考推理、多会话管理。

## 功能

- **AI 对话** — 接入 DeepSeek V3/R1 模型，支持流式输出与深度思考模式
- **知识库管理** — 上传 Markdown 文档，向量化检索增强回答质量
- **RAG 检索** — 用户问题智能改写 + pgvector 向量相似度搜索
- **会话管理** — 多会话切换、重命名、删除，标题 AI 自动生成
- **响应式布局** — 侧边栏自适应屏幕宽度，移动端遮罩层支持

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 前端 | React 19 · Tailwind CSS 4 · Zustand |
| 服务端 | @ai-sdk/deepseek · PostgreSQL + pgvector |
| 数据流 | React Query · AI SDK Streaming |
| 动画 | GSAP |
| 认证 | JWT + httpOnly Cookie |

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

### 环境变量

创建 `.env.local`：

```env
DEEPSEEK_API_KEY=your_deepseek_api_key
JWT_SECRET=your_jwt_secret
```

### 数据库初始化

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE users (id UUID PRIMARY KEY, email TEXT UNIQUE, password TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE chat_sessions (id UUID PRIMARY KEY, user_id UUID REFERENCES users(id), title TEXT, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE chat_messages (id SERIAL PRIMARY KEY, session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE, role TEXT, parts JSONB, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE knowledge_bases (id UUID PRIMARY KEY, user_id UUID REFERENCES users(id), name TEXT, description TEXT, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ);
CREATE TABLE documents (id UUID PRIMARY KEY, knowledge_base_id UUID REFERENCES knowledge_bases(id) ON DELETE CASCADE, filename TEXT, file_type TEXT, file_size BIGINT, raw_content TEXT, total_chunks INT, created_at TIMESTAMPTZ);
CREATE TABLE document_chunks (id UUID PRIMARY KEY, document_id UUID REFERENCES documents(id) ON DELETE CASCADE, content TEXT, embedding vector(1536), chunk_index INT, created_at TIMESTAMPTZ);
```

## 项目结构

详见 [docks/project/结构文档.md](docks/project/结构文档.md)

## 开发日志

详见 [docks/project/开发日志.md](docks/project/开发日志.md)
