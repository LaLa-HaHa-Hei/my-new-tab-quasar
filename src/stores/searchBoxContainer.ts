import { defineStore, acceptHMRUpdate } from 'pinia';
import { LocalStorage } from 'quasar';
import { ref, watch } from 'vue';
import type { SearchBoxContainerConfig, SearchBoxItem } from 'src/types';
import debounce from 'lodash.debounce';
import { defaultSearchBoxItems } from './defaultSearchBoxItems';
import { StorageKey } from '../constants/storageKeys';

const STORAGE_KEY = StorageKey.SEARCH_BOX_CONTAINER_CONFIG;

// 排除了 items，因为占用太大，额外放到 defaultSearchBoxItems 中
const DEFAULT_CONFIG: SearchBoxContainerConfig = {
  display: true,
  paddingTop: '2rem',
  paddingX: '10%',
  columnCount: 4,
  gap: '0.5rem',
  items: [],
};

export const useSearchBoxContainerStore = defineStore('searchBoxContainer', () => {
  const config = ref<SearchBoxContainerConfig>();

  function resetToDefault() {
    config.value = {
      ...DEFAULT_CONFIG,
      items: structuredClone(defaultSearchBoxItems),
    };
  }

  function getItems() {
    return config.value?.items || [];
  }

  function saveToStorage() {
    LocalStorage.setItem(STORAGE_KEY, config.value);
  }

  function moveItemUp(index: number) {
    if (index === 0 || !config.value) return;
    const items = config.value.items;
    const item = items[index];
    items[index] = items[index - 1]!;
    items[index - 1] = item!;
  }

  function moveItemDown(index: number) {
    if (!config.value) return;
    const items = config.value.items;
    if (index === items.length - 1) return;
    const item = items[index];
    items[index] = items[index + 1]!;
    items[index + 1] = item!;
  }

  function deleteItem(index: number) {
    if (!config.value) return;
    config.value.items.splice(index, 1);
  }

  function setItemEnabled(index: number, enabled: boolean) {
    if (!config.value || !config.value.items[index]) return;
    config.value.items[index].isEnabled = enabled;
  }

  function addItem(item: SearchBoxItem) {
    if (!config.value) return;
    config.value.items.push(item);
  }

  function setItem(index: number, item: SearchBoxItem) {
    if (!config.value || !config.value.items[index]) return;
    config.value.items[index] = item;
  }

  const isInitialized = ref(false);
  function initialize() {
    if (isInitialized.value) return;
    try {
      const stored = LocalStorage.getItem(STORAGE_KEY) as SearchBoxContainerConfig;
      if (stored) {
        config.value = stored;
      } else {
        resetToDefault();
        saveToStorage();
      }
    } catch (e) {
      console.error('Load search box container config failed:', e);
      resetToDefault();
      saveToStorage();
    }

    isInitialized.value = true;
  }

  initialize();

  const debouncedSave = debounce(saveToStorage, 500); // 500ms防抖
  watch(
    config,
    () => {
      debouncedSave();
    },
    { deep: true },
  );
  return {
    config,
    resetToDefault,
    getItems,
    moveItemUp,
    moveItemDown,
    deleteItem,
    setItemEnabled,
    addItem,
    setItem,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSearchBoxContainerStore, import.meta.hot));
}
