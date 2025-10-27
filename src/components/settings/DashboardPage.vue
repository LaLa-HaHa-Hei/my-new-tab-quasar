<template>
  <div class="full-width">
    <div>
      <q-btn :label="t('settings.dashboard.addWidget')" color="primary" @click="emit('navigate', 'add-widget')" />
      <q-btn class="q-ml-md" :label="t('common.button.resetToDefault')" color="warning" @click="handleResetToDefault" />
    </div>
    <div class="q-mt-md full-width">
      <q-table card-class="bg-grey-3" separator="cell" :rows="widgets" :columns="columns" row-key="id"
        :rows-per-page-options="[0]">
        <template v-slot:body-cell-w="props">
          <q-td key="w" :props="props">
            <div class="fit flex justify-center">
              <q-input type="number" :model-value="props.row.w"
                @update:model-value="handleUpdateW(props.rowIndex, $event as number)" dense counter
                style="width: 2rem;" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-h="props">
          <q-td key="h" :props="props" align="center">
            <div class="fit flex justify-center">
              <q-input type="number" :model-value="props.row.h"
                @update:model-value="handleUpdateH(props.rowIndex, $event as number)" dense counter
                style="width: 2rem;" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td align="center">
            <q-btn color="primary" dense flat icon="move_up" @click="handleMoveUp(props.rowIndex)" />
            <q-btn color="primary" dense flat icon="move_down" @click="handleMoveDown(props.rowIndex)" />
            <q-btn color="negative" dense flat icon="delete" @click="handleDelete(props.rowIndex)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from 'src/stores/dashboard'
import { useWidgetRegistryStore } from 'src/stores/widgetRegistry'
import type { WidgetItem } from 'src/types';
import { Notify } from 'quasar'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const widgetRegistry = useWidgetRegistryStore()
const dashboardStore = useDashboardStore()

const emit = defineEmits<{
  (e: 'navigate', path: string): void
}>()

const columns = computed(() => [
  { name: 'label', label: t('settings.dashboard.widget'), field: (row: WidgetItem) => widgetRegistry.getWidgetDef(row.widgetKey)!.toString(row), align: 'center' as const },
  { name: 'w', label: t('settings.dashboard.width'), field: 'w', align: 'center' as const },
  { name: 'h', label: t('settings.dashboard.height'), field: 'h', align: 'center' as const },
  { name: 'actions', label: t('settings.dashboard.action'), field: 'actions', align: 'center' as const }
])

const widgets = computed<WidgetItem[]>(() => dashboardStore.getWidgets())

function handleMoveUp(index: number) {
  dashboardStore.moveWidgetUpByIndex(index)
}
function handleMoveDown(index: number) {
  dashboardStore.moveWidgetDownByIndex(index)
}

function handleDelete(index: number) {
  dashboardStore.deleteWidgetByIndex(index)
}

function handleUpdateW(index: number, value: number) {
  dashboardStore.updateWidgetSizeByIndex(index, value, widgets.value[index]!.h);
}

function handleUpdateH(index: number, value: number) {
  dashboardStore.updateWidgetSizeByIndex(index, widgets.value[index]!.w, value);
}

function handleResetToDefault() {
  dashboardStore.resetToDefault()
  Notify.create({
    message: t('common.message.success'),
    color: 'positive',
    position: 'top',
  })
}
</script>
