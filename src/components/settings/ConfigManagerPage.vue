<template>
  <div>
    <div>
      <q-btn :label="t('settings.configManager.importConfigFromClipboard')" color="primary"
        @click="handleImportConfigFromClipboard" />
      <q-btn class="q-ml-md" :label="t('settings.configManager.exportConfigToClipboard')" color="primary"
        @click="handelExportConfigToClipboard" />
    </div>
    <div class="q-mt-md">
      <q-btn :label="t('settings.configManager.importConfigFromFile')" color="primary"
        @click="handleImportConfigFromFile" />
      <q-btn class="q-ml-md" :label="t('settings.configManager.exportConfigToFile')" color="primary"
        @click="handleExportConfigToFile" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBackgroundStore } from 'src/stores/background';
import { useCurrentTimeStore } from 'src/stores/currentTime';
import { useCurrentDateStore } from 'src/stores/currentDate';
import { useSearchBoxContainerStore } from 'src/stores/searchBoxContainer';
import { useSearchBoxStore } from 'src/stores/searchBox';
import { useDashboardStore } from 'src/stores/dashboard';
import { useWidgetRegistryStore } from 'src/stores/widgetRegistry';
import { useI18n } from 'vue-i18n'
import { Notify } from 'quasar'

const { t } = useI18n()
const backgroundStore = useBackgroundStore()
const currentTimeStore = useCurrentTimeStore()
const currentDateStore = useCurrentDateStore()
const searchBoxContainerStore = useSearchBoxContainerStore()
const searchBoxStore = useSearchBoxStore()
const dashboardStore = useDashboardStore()
const widgetRegistryStore = useWidgetRegistryStore()

function showSuccess() {
  Notify.create({
    message: t('common.message.success'),
    color: 'positive',
    position: 'top',
  })
}

function showFailed() {
  Notify.create({
    message: t('common.message.failed'),
    color: 'negative',
    position: 'top',
  })
}

function exportConfig(): string {
  const config = {
    background: backgroundStore.config,
    currentTime: currentTimeStore.config,
    currentDate: currentDateStore.config,
    searchBoxContainer: searchBoxContainerStore.config,
    searchBox: searchBoxStore.config,
    dashboard: dashboardStore.config,
    widgets: {} as Record<string, unknown>,
  }
  for (const widget of widgetRegistryStore.getAllWidgetDef()) {
    if (widget.exportConfig)
      config.widgets[widget.key] = widget.exportConfig()
  }

  return JSON.stringify(config, null, 4)
}

function importConfig(config: string) {
  const configObj = JSON.parse(config)
  backgroundStore.config = configObj.background
  currentTimeStore.config = configObj.currentTime
  currentDateStore.config = configObj.currentDate
  searchBoxContainerStore.config = configObj.searchBoxContainer
  searchBoxStore.config = configObj.searchBox
  dashboardStore.config = configObj.dashboard

  for (const widget of widgetRegistryStore.getAllWidgetDef()) {
    if (widget.importConfig && configObj.widgets[widget.key]) {
      widget.importConfig(configObj.widgets[widget.key])
    }
  }
}

async function exportConfigToClipboard() {
  const configStr = exportConfig();
  await navigator.clipboard.writeText(configStr);
}

function handelExportConfigToClipboard() {
  exportConfigToClipboard()
    .then(showSuccess)
    .catch(err => {
      showFailed()
      console.error('导出配置到剪贴板失败:', err)
    })
}

function exportConfigToFile(filename = 'my-new-tab-config.json') {
  const configStr = exportConfig();
  const blob = new Blob([configStr], { type: 'application/json;charset=utf-8' });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

function handleExportConfigToFile() {
  try {
    exportConfigToFile()
    showSuccess()
  } catch (err) {
    showFailed()
    console.error('导出配置到文件失败:', err)
  }
}

async function importConfigFromClipboard() {
  const text = await navigator.clipboard.readText();
  importConfig(text);
}

function handleImportConfigFromClipboard() {
  importConfigFromClipboard()
    .then(showSuccess)
    .catch(err => {
      showFailed()
      console.error('导入配置失败:', err)
    })
}

async function importConfigFromFile(file?: File) {
  const targetFile =
    file ||
    (await new Promise<File>((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,.txt';
      input.onchange = () => {
        if (input.files && input.files[0]) resolve(input.files[0]);
        else reject(new Error('No file selected'));
      };
      input.click();
    }));

  const text = await targetFile.text();
  importConfig(text);
}

function handleImportConfigFromFile() {
  importConfigFromFile()
    .then(showSuccess)
    .catch(err => {
      showFailed()
      console.error('导入配置失败:', err)
    })
}
</script>
