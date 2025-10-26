<template>
  <div class="row q-gutter-md items-start">
    <q-card v-for="widget in widgetRegistry.readonlyRegistry" :key="widget.key" class="my-card bg-secondary text-white">
      <q-card-section>
        <div class="text-h5">{{ widget.name }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="widget.description">
        <div class="text-body2">{{ widget.description }}</div>
      </q-card-section>

      <q-separator dark />
      <q-card-actions class="row justify-center">
        <q-btn flat @click="addWidget(widget)">{{ t('common.button.add') }}</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from 'src/stores/dashboard'
import { Notify } from 'quasar'
import { useWidgetRegistryStore } from 'src/stores/widgetRegistry'
import type { WidgetDef } from 'src/types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const widgetRegistry = useWidgetRegistryStore()
const dashboardStore = useDashboardStore()

async function addWidget(widget: WidgetDef) {
  try {
    const newWidget = await widget.create()
    dashboardStore.addWidget(newWidget)
    Notify.create({
      message: '添加成功',
      color: 'positive',
      position: 'top',
    })
  } catch {
    Notify.create({
      message: '取消添加',
      color: 'negative',
      position: 'top',
    })
  }
}

</script>
