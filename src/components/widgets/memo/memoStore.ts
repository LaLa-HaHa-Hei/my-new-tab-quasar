import { defineStore, acceptHMRUpdate } from 'pinia';
import { LocalStorage } from 'quasar';
import { ref, watch } from 'vue';
import debounce from 'lodash.debounce';
import { StorageKey } from 'src/constants/storageKeys';

const STORAGE_KEY = `${StorageKey.WIDGET_CONFIG_PREFIX}memo`;

export interface MemoConfig {
  fontSize: string;
  textColor: string;
}

const DEFAULT_CONFIG: MemoConfig = {
  fontSize: '1.6rem',
  textColor: '#ffffffff',
};

export const useMemoStore = defineStore('memo', () => {
  const config = ref<MemoConfig>();
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
      const stored = LocalStorage.getItem(STORAGE_KEY) as MemoConfig;
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
  import.meta.hot.accept(acceptHMRUpdate(useMemoStore, import.meta.hot));
}
