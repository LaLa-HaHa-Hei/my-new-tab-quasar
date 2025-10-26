<template>
  <div class="row flex-center" v-if="currentTimeStore.config!.display" :style="{
    fontSize: currentTimeStore.config!.fontSize,
    paddingTop: currentTimeStore.config!.paddingTop,
    color: currentTimeStore.config!.textColor,
    fontWeight: currentTimeStore.config!.fontWeight,
  }">
    {{ time }}
  </div>
</template>

<script setup lang="ts">
import { useCurrentTimeStore } from 'src/stores/currentTime'
import { ref, onMounted, onUnmounted } from 'vue'


const currentTimeStore = useCurrentTimeStore()
const time = ref<string>('')
let timer: NodeJS.Timeout | null = null

const updateTime = () => {
  const now = new Date();
  const hour = now.getHours().toString();
  const minute = now.getMinutes().toString().padStart(2, '0');
  time.value = `${hour}:${minute}`
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer)
    clearInterval(timer)
})
</script>
