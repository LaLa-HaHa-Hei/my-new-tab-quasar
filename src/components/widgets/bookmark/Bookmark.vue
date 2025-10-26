<template>
  <div ref="bookmarkRef" class="bookmark column cursor-pointer fit" :style="{ backgroundColor: bgColor }"
    @mouseover="bgColor = bookmarkStore.config!.hoverBgColor" @mouseleave="bgColor = 'rgba(255, 255, 255, 0)'"
    @click="handleClick">
    <q-img class="col" :src="data.icon" fit="contain" :ratio="1" />
    <div v-if="bookmarkStore.config!.showLabel" class="row justify-center"
      :style="{ color: bookmarkStore.config!.labelColor, fontSize: bookmarkStore.config!.fontSize }"> {{
        data.label }} </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WidgetItem } from 'src/types'
import { useBookmarkStore } from './bookmarkStore'
import type { BookmarkData } from './bookmarkData'

const props = defineProps<{
  widget: WidgetItem,
}>()
const bookmarkRef = ref()
const data = computed(() => props.widget.data as BookmarkData)
const bookmarkStore = useBookmarkStore()


const bgColor = ref<string>("rgba(255, 255, 255, 0)")

function handleClick() {
  window.open(data.value.url, bookmarkStore.config!.openInNewTab ? '_blank' : '_self')
}
</script>

<style scoped lang="scss">
.bookmark {
  transition: background-color 0.3s ease;
  border-radius: 0.5rem;
}
</style>
