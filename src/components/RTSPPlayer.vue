<template>
  <div class="rtsp-player">
    <div class="input-container">
      <input 
        v-model="rtspUrl" 
        type="text" 
        placeholder="输入RTSP流地址" 
        class="rtsp-input"
      />
      <button @click="addStream" class="add-button">添加流</button>
    </div>
    
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div class="video-list">
      <div v-for="(stream, index) in streams" :key="index" class="video-item">
        <div class="video-container">
          <canvas :id="'canvas-' + index"></canvas>
        </div>
        <div class="stream-controls">
          <span class="stream-url">{{ stream.url }}</span>
          <button @click="removeStream(index)" class="remove-button">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import JSMpeg from 'jsmpeg-player'

interface Stream {
  url: string;
  name: string;
  wsUrl?: string;
}

const rtspUrl = ref('')
const streams = ref<Stream[]>([])
const players = ref<any[]>([])
const errorMessage = ref('')
let streamCounter = 0

const validateRtspUrl = (url: string): boolean => {
  const rtspRegex = /^rtsp:\/\/[a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;=]+$/
  return rtspRegex.test(url)
}

const showError = (message: string) => {
  errorMessage.value = message
  setTimeout(() => {
    errorMessage.value = ''
  }, 3000)
}

const initializePlayer = async (index: number) => {
  try {
    const stream = streams.value[index]
    const response = await fetch('http://localhost:3000/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: stream.url,
        name: stream.name
      })
    })

    const data = await response.json()
    if (data.error) {
      throw new Error(data.error)
    }

    stream.wsUrl = data.wsUrl
    const canvas = document.getElementById(`canvas-${index}`)
    if (!canvas) return

    const player = new JSMpeg.Player(stream.wsUrl, {
      canvas: canvas,
      autoplay: true,
      audio: false,
      loop: true
    })

    players.value[index] = player
  } catch (error) {
    console.error('Error initializing player:', error)
    showError(`初始化播放器错误: ${error.message}`)
  }
}

const addStream = () => {
  if (!rtspUrl.value) {
    showError('请输入RTSP流地址')
    return
  }

  if (!validateRtspUrl(rtspUrl.value)) {
    showError('无效的RTSP地址格式，请使用正确的RTSP URL格式')
    return
  }

  const streamName = `stream_${streamCounter++}`
  streams.value.push({
    url: rtspUrl.value,
    name: streamName
  })
  rtspUrl.value = ''
  errorMessage.value = ''
  
  setTimeout(() => {
    const index = streams.value.length - 1
    initializePlayer(index)
  }, 0)
}

const removeStream = async (index: number) => {
  const stream = streams.value[index]
  if (stream.name) {
    try {
      await fetch(`http://localhost:3000/stream/${stream.name}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Error removing stream:', error)
    }
  }

  if (players.value[index]) {
    players.value[index].destroy()
  }
  streams.value.splice(index, 1)
  players.value.splice(index, 1)
}

// 组件卸载时清理播放器和流
onUnmounted(() => {
  players.value.forEach((player, index) => {
    if (player) {
      player.destroy()
      removeStream(index)
    }
  })
})
</script>

<style scoped>
.rtsp-player {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.rtsp-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.add-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-button:hover {
  background-color: #45a049;
}

.error-message {
  color: #f44336;
  margin: 10px 0;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
}

.video-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 20px;
  justify-content: center;
  padding: 20px;
}

.video-item {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.video-container {
  margin-bottom: 10px;
  position: relative;
  padding-top: 56.25%; /* 16:9 宽高比 */
  background: #000;
}

.video-container canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
}

.stream-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
}

.stream-url {
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.remove-button {
  padding: 4px 8px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove-button:hover {
  background-color: #da190b;
}
</style>
