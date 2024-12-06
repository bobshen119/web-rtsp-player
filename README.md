# Web RTSP Player

一个基于 Vue 3 + TypeScript + Vite 的 Web RTSP 播放器，支持多路 RTSP 流的同时播放。

## 功能特点

- 支持多路 RTSP 流同时播放
- 自动为每路流分配独立的 WebSocket 端口
- 支持动态添加和移除视频流
- 响应式布局，自适应屏幕大小
- 基于 node-rtsp-stream 的服务器端转码
- 使用 JSMpeg 进行前端播放

## 系统要求

- Node.js >= 16
- FFmpeg（用于服务器端转码）
- Yarn 包管理器

## 安装步骤

1. 克隆项目：
```bash
git clone [项目地址]
cd web-rtsp-player
```

2. 安装前端依赖：
```bash
yarn install
```

3. 安装服务器依赖：
```bash
cd server
yarn install
cd ..
```

## 运行项目

1. 启动 RTSP 转码服务器：
```bash
yarn server
# 或者
node server/index.js
```

2. 在新的终端窗口启动前端开发服务器：
```bash
yarn dev
```

3. 在浏览器中访问：
```
http://localhost:5173
```

## 使用说明

1. 在输入框中输入 RTSP 流地址（格式：rtsp://xxx）
2. 点击"添加流"按钮
3. 等待几秒钟，视频流会自动开始播放
4. 可以继续添加更多的视频流
5. 点击视频流下方的"删除"按钮可以移除对应的视频流

## 技术栈

- 前端：
  - Vue 3
  - TypeScript
  - Vite
  - JSMpeg Player

- 后端：
  - Node.js
  - Express
  - node-rtsp-stream
  - WebSocket

## 注意事项

1. 确保 RTSP 流地址可以访问
2. 系统需要安装 FFmpeg
3. 每个视频流会占用一个独立的 WebSocket 端口（从 9999 开始递增）
4. 如果遇到播放问题，请检查浏览器控制台和服务器控制台的错误信息

## 常见问题

1. 如果视频无法播放，请检查：
   - RTSP 流地址是否正确
   - FFmpeg 是否正确安装
   - 服务器控制台是否有错误信息
   - 浏览器控制台是否有错误信息

2. 如果遇到端口占用问题，可以修改 server/index.js 中的起始端口号

## License

MIT
