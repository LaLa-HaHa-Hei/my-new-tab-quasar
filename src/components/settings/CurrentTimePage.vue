<template>
  <div class="full-width">
    <q-btn :label="t('common.button.resetToDefault')" color="warning" @click="handleResetToDefault" /> <br />
    <q-toggle class="q-mt-md" v-model="currentTimeStore.config!.display" :label="t('settings.currentTime.display')" />
    <q-input v-model="currentTimeStore.config!.paddingTop" :label="t('settings.currentTime.paddingTop')" />
    <q-input v-model="currentTimeStore.config!.fontSize" :label="t('settings.currentTime.fontSize')" />
    <q-input v-model="currentTimeStore.config!.textColor" :label="t('settings.currentTime.fontColor')">
      <template v-slot:append>
        <q-icon name="colorize" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="currentTimeStore.config!.textColor" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { useCurrentTimeStore } from 'src/stores/currentTime';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const currentTimeStore = useCurrentTimeStore()

function handleResetToDefault() {
  currentTimeStore.resetToDefault()
  Notify.create({
    message: t('common.message.success'),
    color: 'positive',
    position: 'top',
  })
}
</script>
