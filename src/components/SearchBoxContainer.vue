<template>
  <div class="grid-container" v-if="searchBoxContainerStore.config!.display" :style="{
    paddingLeft: searchBoxContainerStore.config!.paddingX,
    paddingRight: searchBoxContainerStore.config!.paddingX,
    paddingTop: searchBoxContainerStore.config!.paddingTop,
    gridTemplateColumns: `repeat(${searchBoxContainerStore.config!.columnCount}, 1fr)`,
    gap: searchBoxContainerStore.config!.gap
  }">
    <template v-for="item in items" :key="item.id">
      <SearchBox v-if="item.isEnabled" :config="item" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useSearchBoxContainerStore } from 'src/stores/searchBoxContainer'
import SearchBox from 'components/SearchBox.vue'
import type { SearchBoxItem } from 'src/types';
import { computed } from 'vue'

const searchBoxContainerStore = useSearchBoxContainerStore()

const items = computed<SearchBoxItem[]>(() => searchBoxContainerStore.getItems())

</script>

<style scoped lang="scss">
.grid-container {
  display: grid;
}
</style>
