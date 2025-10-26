import { defineStore, acceptHMRUpdate } from 'pinia';
import { LocalStorage } from 'quasar';
import { ref, watch } from 'vue';
import type { SearchBoxConfig } from 'src/types';
import debounce from 'lodash.debounce';

import { StorageKey } from '../constants/storageKeys';

const STORAGE_KEY = StorageKey.SEARCH_BOX_CONFIG;

const DEFAULT_CONFIG: SearchBoxConfig = {
  openInNewTab: false,
  clearAfterSearch: true,
  bgColor: 'rgba(255, 255, 255, 0.1)',
  focusBgColor: 'rgba(255, 255, 255, 0.6)',
  height: '3rem',
  borderRadius: '1.5rem',
  borderColor: 'rgba(255, 255, 255, 0.3)',
  paddingLeft: '0.7rem',
  paddingRight: '0.5rem',
  fontSize: '1.4rem',
  textColor: '#ffffffff',
  iconSize: '2.3rem',
};

export const useSearchBoxStore = defineStore('searchBox', () => {
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
      console.error('Load background config failed:', e);
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
  import.meta.hot.accept(acceptHMRUpdate(useSearchBoxStore, import.meta.hot));
}
