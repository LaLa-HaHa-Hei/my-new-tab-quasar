import { defineStore, acceptHMRUpdate } from 'pinia';
import { LocalStorage } from 'quasar';
import { ref, watch } from 'vue';
import debounce from 'lodash.debounce';
import { StorageKey } from '../constants/storageKeys';

const STORAGE_KEY = StorageKey.CURRENT_TIME_CONFIG;

const DEFAULT_CONFIG = {
  display: true,
  paddingTop: '3rem',
  fontSize: '4rem',
  fontWeight: 'bold',
  textColor: 'rgba(255, 255, 255, 0.8)',
};

export const useCurrentTimeStore = defineStore('currentTime', () => {
  const config = ref<typeof DEFAULT_CONFIG>();
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
      const stored = LocalStorage.getItem(STORAGE_KEY) as typeof DEFAULT_CONFIG;
      if (stored) {
        config.value = stored;
      } else {
        resetToDefault();
        saveToStorage();
      }
    } catch (e) {
      console.error('加载配置失败:', e);
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
  import.meta.hot.accept(acceptHMRUpdate(useCurrentTimeStore, import.meta.hot));
}
