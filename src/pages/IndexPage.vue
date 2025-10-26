<template>
  <q-page ref="indexPageRef">

    <Background />
    <LanguageSelector />
    <CurrentTime />
    <CurrentDate />
    <SearchBoxContainer />
    <Dashboard />

    <q-menu v-model="menuVisible" class="bg-grey-3" touch-position context-menu auto-close>
      <q-list dense separator>
        <q-item clickable @click="showSettingsDialog()" class="flex-center">
          <q-item-section class="items-center">{{ t('settings.title') }}</q-item-section>
        </q-item>
        <q-item v-for="item in contextMenuStore.getAllItems()" :key="item.label" clickable @click="item.onClick()">
          <q-item-section class="items-center">{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>

    <SettingsDialog v-model="settingsDialogVisible" :init-page="initPage" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, provide } from 'vue'
import Background from 'components/Background.vue'
import SettingsDialog from 'components/SettingsDialog.vue'
import CurrentTime from 'components/CurrentTime.vue'
import CurrentDate from 'components/CurrentDate.vue'
import SearchBoxContainer from 'components/SearchBoxContainer.vue'
import Dashboard from 'components/Dashboard.vue'
import { useContextMenuStore } from 'stores/contextMenu'
import { InjectKeys } from 'src/constants/injectKeys'
import LanguageSelector from 'components/LanguageSelector.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuVisible = ref(false)
const settingsDialogVisible = ref(false)
const initPage = ref('current-time')
const contextMenuStore = useContextMenuStore()
const indexPageRef = ref()

function showSettingsDialog(page?: string) {
  initPage.value = page || 'current-time'
  settingsDialogVisible.value = true
}

provide(InjectKeys.showSettingsDialog, showSettingsDialog)

function onContextMenuCapture() {
  contextMenuStore.clearAllItems()
}

onMounted(() => {
  indexPageRef.value.$el.addEventListener('contextmenu', onContextMenuCapture, true);
})

onBeforeUnmount(() => {
  indexPageRef.value.$el.removeEventListener('contextmenu', onContextMenuCapture, true);
})
</script>

<style scoped lang="scss"></style>
