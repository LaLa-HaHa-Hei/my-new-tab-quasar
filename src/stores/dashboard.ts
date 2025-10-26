import { defineStore, acceptHMRUpdate } from 'pinia';
import { LocalStorage } from 'quasar';
import { ref, watch } from 'vue';
import type { DashboardConfig, WidgetItem } from 'src/types';
import debounce from 'lodash.debounce';
import { defaultWidgets } from './defaultWidgets';
import { StorageKey } from '../constants/storageKeys';
import { useWidgetRegistryStore } from './widgetRegistry';

const STORAGE_KEY = StorageKey.DASHBOARD_CONFIG;

// 排除了 widgets，因为占用太大，额外放到 defaultWidgets 中
const DEFAULT_CONFIG: DashboardConfig = {
  display: true,
  paddingTop: '2rem',
  paddingX: '10%',
  size: '5rem',
  gap: '0.5rem',
  widgets: [],
};

const widgetRegistry = useWidgetRegistryStore();

export const useDashboardStore = defineStore('dashboard', () => {
  const config = ref<DashboardConfig>();

  function resetToDefault() {
    config.value = {
      ...DEFAULT_CONFIG,
      widgets: structuredClone(defaultWidgets),
    };
  }

  function saveToStorage() {
    LocalStorage.setItem(STORAGE_KEY, config.value);
  }

  function getWidgets() {
    return config.value?.widgets || [];
  }

  function moveWidgetUpByIndex(index: number) {
    if (index <= 0 || !config.value) return;
    const widgets = config.value.widgets;
    if (index >= widgets.length) return;
    const widget = widgets[index];
    widgets[index] = widgets[index - 1]!;
    widgets[index - 1] = widget!;
  }

  function moveWidgetDownByIndex(index: number) {
    if (index < 0 || !config.value) return;
    const widgets = config.value.widgets;
    if (index >= widgets.length - 1) return;
    const widget = widgets[index];
    widgets[index] = widgets[index + 1]!;
    widgets[index + 1] = widget!;
  }

  function deleteWidgetByIndex(index: number) {
    if (!config.value || !config.value.widgets[index]) return;

    const widgetDef = widgetRegistry.getWidgetDef(config.value.widgets[index].widgetKey);
    if (widgetDef && widgetDef.onRemove) widgetDef.onRemove(config.value.widgets[index]);
    config.value.widgets.splice(index, 1);
  }

  function updateWidgetSizeByIndex(index: number, w: number, h: number) {
    if (!config.value || !config.value.widgets[index]) return;
    config.value.widgets[index].w = w;
    config.value.widgets[index].h = h;
  }

  function updateWidgetByIndex(index: number, widget: WidgetItem) {
    if (!config.value || !config.value.widgets[index]) return;
    config.value.widgets[index] = widget;
  }

  function addWidget(widget: WidgetItem) {
    if (!config.value) return;
    config.value.widgets.push(widget);
  }

  const isInitialized = ref(false);
  function initialize() {
    if (isInitialized.value) return;
    try {
      const stored = LocalStorage.getItem(STORAGE_KEY) as DashboardConfig;
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
  return {
    config,
    resetToDefault,
    getWidgets,
    moveWidgetUpByIndex,
    moveWidgetDownByIndex,
    deleteWidgetByIndex,
    updateWidgetSizeByIndex,
    updateWidgetByIndex,
    addWidget,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDashboardStore, import.meta.hot));
}
