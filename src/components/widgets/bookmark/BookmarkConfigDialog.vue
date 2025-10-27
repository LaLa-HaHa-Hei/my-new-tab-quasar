<template>
  <q-dialog ref="dialogRef">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ t('widgets.bookmark.config.title') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-toggle v-model="bookmarkStore.config!.openInNewTab"
          :label="t('widgets.bookmark.editConfigDialog.openInNewTab')" />
        <q-toggle v-model="bookmarkStore.config!.showLabel" :label="t('widgets.bookmark.config.showLabel')" />
        <q-input v-model="bookmarkStore.config!.fontSize" :label="t('widgets.bookmark.config.fontSize')" />
        <q-input v-model="bookmarkStore.config!.labelColor" :label="t('widgets.bookmark.config.labelColor')">
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-color v-model="bookmarkStore.config!.labelColor" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input v-model="bookmarkStore.config!.hoverBgColor"
          :label="t('widgets.bookmark.config.hoverBackgroundColor')">
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-color v-model="bookmarkStore.config!.hoverBgColor" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat :label="t('common.button.resetToDefault')" color="warning" @click="bookmarkStore.resetToDefault" />
        <q-btn flat :label="t('common.button.cancel')" color="warning" @click="handleCancelClick" />
        <q-btn flat :label="t('common.button.confirm')" color="primary" @click="onDialogOK" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { useBookmarkStore } from './bookmarkStore';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const bookmarkStore = useBookmarkStore();

function handleCancelClick() {
  onDialogCancel()
}
</script>
