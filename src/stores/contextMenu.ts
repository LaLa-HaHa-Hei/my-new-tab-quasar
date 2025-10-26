import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';
import type { ContextMenuItem } from 'src/types/contextMenuItem';

export const useContextMenuStore = defineStore('contextMenu', () => {
  const contextMenu = ref<ContextMenuItem[]>([]);

  function registerItem(item: ContextMenuItem) {
    contextMenu.value.push(item);
  }

  function getAllItems() {
    return contextMenu.value;
  }

  function clearAllItems() {
    contextMenu.value = [];
  }

  return {
    contextMenu,
    registerItem,
    getAllItems,
    clearAllItems,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useContextMenuStore, import.meta.hot));
}
