<template>
  <div ref="dashboardRef" v-if="dashboardStore.config!.display" class="grid-container" :style="{
    paddingLeft: dashboardStore.config!.paddingX,
    paddingRight: dashboardStore.config!.paddingX,
    paddingTop: dashboardStore.config!.paddingTop,
    gridTemplateColumns: `repeat(auto-fill, ${dashboardStore.config!.size})`,
    gridAutoRows: `${dashboardStore.config!.size}`,
    gap: dashboardStore.config!.gap
  }">
    <div class="grid-item fit" v-for="(widget, index) in widgets" :key="widget.id"
      :style="{ gridColumn: `span ${widget.w}`, gridRow: `span ${widget.h}` }" :data-widget-index="index">
      <component :is="widgetRegistry.getWidgetDef(widget.widgetKey)!.component" :widget="widget" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from 'src/stores/dashboard'
import { useWidgetRegistryStore } from 'src/stores/widgetRegistry'
import type { WidgetItem, WidgetDef } from 'src/types'
import { computed, onMounted, ref, onBeforeUnmount, inject } from 'vue'
import { useContextMenuStore } from 'src/stores/contextMenu'
import { Notify } from 'quasar'
import { InjectKeys } from 'src/constants/injectKeys'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const showSettingsDialog = inject(InjectKeys.showSettingsDialog) as (page?: string) => void
const contextMenuStore = useContextMenuStore()
const dashboardStore = useDashboardStore()
const widgetRegistry = useWidgetRegistryStore()
const dashboardRef = ref<HTMLDivElement>()

const widgets = computed<WidgetItem[]>(() => dashboardStore.config!.widgets)

function handleContextMenu(event: MouseEvent) {
  contextMenuStore.registerItem({
    label: t('settings.dashboard.addWidget'),
    onClick: () => {
      showSettingsDialog('add-widget')
    }
  })

  const target = event.target as HTMLElement
  const widgetEl = target.closest('.grid-item')

  if (widgetEl instanceof HTMLElement && widgetEl.dataset.widgetIndex) {
    const widgetIndex = Number(widgetEl.dataset.widgetIndex)
    const widget = widgets.value[widgetIndex] as WidgetItem
    const widgetDef = widgetRegistry.getWidgetDef(widget.widgetKey) as WidgetDef
    if (widgetDef.editItem) {
      contextMenuStore.registerItem({
        label: t('components.dashboard.editItem'),
        onClick: () => {
          widgetDef.editItem?.(widget).then((newWidget: WidgetItem) => {
            dashboardStore.updateWidgetByIndex(widgetIndex, newWidget)
            Notify.create({
              message: t('components.dashboard.editItemSuccess'),
              color: 'positive',
              position: 'top',
            })
          }).catch(() => {
            Notify.create({
              message: t('components.dashboard.editItemFailed'),
              color: 'positive',
              position: 'top',
            })
          })
        }
      })
    }
    if (widgetDef.editConfig) {
      contextMenuStore.registerItem({
        label: t('components.dashboard.editConfig'),
        onClick: () => {
          widgetDef.editConfig?.()
        }
      })
    }
    contextMenuStore.registerItem({
      label: t('components.dashboard.deleteItem'),
      onClick: () => {
        dashboardStore.deleteWidgetByIndex(widgetIndex)
      }
    })
  }
}

onMounted(() => {
  dashboardRef.value!.addEventListener('contextmenu', handleContextMenu, true);

})

onBeforeUnmount(() => {
  dashboardRef.value!.removeEventListener('contextmenu', handleContextMenu, true);
})
</script>

<style scoped lang="scss">
.grid-container {
  display: grid;
  justify-content: center;

  .grid-item {
    max-height: 100%;
    max-width: 100%;
  }
}
</style>
