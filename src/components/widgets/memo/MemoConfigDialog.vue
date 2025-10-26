<template>
  <q-dialog ref="dialogRef">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ t('widget.memo.editConfigDialog.title') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input v-model="memoStore.config!.fontSize" :label="t('widget.memo.editConfigDialog.fontSize')" />
        <q-input v-model="memoStore.config!.textColor" :label="t('widget.memo.editConfigDialog.labelColor')">
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-color v-model="memoStore.config!.textColor" />
              </q-popup-proxy>
            </q-icon>
          </template></q-input>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat :label="t('common.button.resetToDefault')" color="warning" @click="memoStore.resetToDefault" />
        <q-btn flat :label="t('common.button.cancel')" color="warning" @click="handleCancelClick" />
        <q-btn flat :label="t('common.button.confirm')" color="primary" @click="onDialogOK" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { useMemoStore } from './memoStore';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const memoStore = useMemoStore();

function handleCancelClick() {
  onDialogCancel()
}
</script>
