<template>
  <div class="search-box row full-width items-center" :style="{
    borderRadius: searchBoxStore.config!.borderRadius,
    backgroundColor: isFocused ? searchBoxStore.config!.focusBgColor : searchBoxStore.config!.bgColor,
    height: searchBoxStore.config!.height,
    paddingLeft: searchBoxStore.config!.paddingLeft,
    paddingRight: searchBoxStore.config!.paddingRight,
    border: `1px solid ${searchBoxStore.config!.borderColor}`,
  }">
    <input v-model="query" class="col bg-transparent no-border" :placeholder="props.config.label"
      :style="{ fontSize: searchBoxStore.config!.fontSize, color: searchBoxStore.config!.textColor }"
      @keyup.enter="search" @focus="isFocused = true" @blur="isFocused = false" />
    <q-img class="cursor-pointer" :style="{
      height: searchBoxStore.config!.iconSize,
      width: searchBoxStore.config!.iconSize,
    }" :src="props.config.icon" fit="contain" @click="search" loading="eager" loading-show-delay="500" />
  </div>
</template>

<script setup lang="ts">
import { useSearchBoxStore } from 'src/stores/searchBox'
import { ref } from 'vue'
import type { SearchBoxItem } from 'src/types'

const props = defineProps<{
  config: SearchBoxItem,
}>()

const searchBoxStore = useSearchBoxStore()
const query = ref('')
const isFocused = ref(false)

function search() {
  const url = props.config.searchUrl.replace('%s', query.value)
  window.open(url, searchBoxStore.config!.openInNewTab ? '_blank' : '_self')
  if (searchBoxStore.config!.clearAfterSearch) {
    query.value = ''
  }
}
</script>

<style scoped lang="scss">
.search-box {
  transition: background-color 0.2s ease-in-out;
  min-width: 0;

  input {
    outline: none;
    min-width: 0;
  }
}
</style>
