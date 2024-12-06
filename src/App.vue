<template>
  <div>
    <h1>RTSP流播放器</h1>
    <RTSPPlayer />
  </div>
</template>

<script setup lang="ts">
import RTSPPlayer from './components/RTSPPlayer.vue'
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin: 20px 0;
}
</style>
