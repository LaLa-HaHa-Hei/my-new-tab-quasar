import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref, computed, markRaw } from 'vue';
import type { WidgetDef } from 'src/types';

export const useWidgetRegistryStore = defineStore('widgetRegistry', () => {
  const registry = ref<Map<string, WidgetDef>>(new Map());
  const readonlyRegistry = computed<WidgetDef[]>(() => Array.from(registry.value.values()));

  function register(widget: WidgetDef) {
    // 使用属性描述符复制，保留 getter（如 name 的 getter），同时将 component 标记为 markRaw
    const descriptors = Object.getOwnPropertyDescriptors(widget);
    descriptors.component = {
      ...(descriptors.component || { enumerable: true, configurable: true, writable: true }),
      value: markRaw(widget.component),
    };
    const widgetWithRawComponent = Object.create(
      Object.getPrototypeOf(widget),
      descriptors,
    ) as WidgetDef;
    registry.value.set(widget.key, widgetWithRawComponent);
  }
  function unregister(key: string) {
    registry.value.delete(key);
  }
  function getWidgetDef(key: string): WidgetDef | null {
    if (registry.value.has(key)) return registry.value.get(key) as WidgetDef;
    else return null;
  }
  function getAllWidgetDef(): WidgetDef[] {
    return Array.from(registry.value.values());
  }

  return { register, unregister, getWidgetDef, getAllWidgetDef, readonlyRegistry };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWidgetRegistryStore, import.meta.hot));
}
