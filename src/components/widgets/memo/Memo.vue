<template>
  <main class="fit column rounded-borders bg-transparent">
    <header class="h6 text-center text-white">
      Memo
    </header>

    <q-separator dark />

    <main class="col no-border">
      <textarea ref="textareaRef" v-model="memo" class="overflow-auto fit no-border bg-transparent q-pa-sm" :style="{
        fontSize: memoStore.config!.fontSize,
        color: memoStore.config!.textColor,
      }">
          </textarea>
    </main>
  </main>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { LocalStorage } from 'quasar'
import type { MemoData } from './memoData';
import type { WidgetItem } from 'src/types'
import { StorageKey } from 'src/constants/storageKeys';
import debounce from 'lodash.debounce';
import { useMemoStore } from './memoStore';

const props = defineProps<{
  widget: WidgetItem,
}>()
const data = computed(() => props.widget.data as MemoData)
const memoStore = useMemoStore();
const STORAGE_KEY = `${StorageKey.WIDGET_CONFIG_PREFIX}memo_${data.value.id}`
const memo = ref<string>(LocalStorage.getItem(STORAGE_KEY) || '')

const debouncedSave = debounce(() => LocalStorage.setItem(STORAGE_KEY, memo.value), 500);
watch(memo, () => {
  debouncedSave();
})
</script>

<style scoped lang="scss">
main {
  max-height: 100%;
  max-width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.5);

  textarea {
    outline: none;
  }
}
</style>
