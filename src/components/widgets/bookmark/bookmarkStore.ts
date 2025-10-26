import { defineStore, acceptHMRUpdate } from 'pinia';
import { LocalStorage } from 'quasar';
import { ref, watch } from 'vue';
import debounce from 'lodash.debounce';
import { StorageKey } from 'src/constants/storageKeys';

const STORAGE_KEY = `${StorageKey.WIDGET_CONFIG_PREFIX}bookmark`;

export interface BookmarkConfig {
  showLabel: boolean;
  fontSize: string;
  labelColor: string;
  hoverBgColor: string;
  openInNewTab: boolean;
}

const DEFAULT_CONFIG: BookmarkConfig = {
  showLabel: true,
  fontSize: '1rem',
  labelColor: '#ffffffff',
  hoverBgColor: 'rgba(255, 255, 255, 0.1)',
  openInNewTab: false,
};

export const useBookmarkStore = defineStore('bookmark', () => {
  const config = ref<BookmarkConfig>();
  function resetToDefault() {
    config.value = {
      ...DEFAULT_CONFIG,
    };
  }

  function saveToStorage() {
    LocalStorage.setItem(STORAGE_KEY, config.value);
  }

  const isInitialized = ref(false);
  function initialize() {
    if (isInitialized.value) return;
    try {
      const stored = LocalStorage.getItem(STORAGE_KEY) as BookmarkConfig;
      if (stored) {
        config.value = stored;
      } else {
        resetToDefault();
        saveToStorage();
      }
    } catch (e) {
      console.error('Load bookmark config failed:', e);
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
  return { config, resetToDefault };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBookmarkStore, import.meta.hot));
}
