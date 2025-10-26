<template>
  <div class="full-width">
    <q-btn :label="t('common.button.resetToDefault')" color="warning" @click="currentDateStore.resetToDefault" /> <br />
    <q-toggle class="q-mt-md" v-model="currentDateStore.config!.display" :label="t('settings.currentDate.display')" />
    <q-input v-model="currentDateStore.config!.paddingTop" :label="t('settings.currentDate.paddingTop')" />
    <q-input v-model="currentDateStore.config!.gap" :label="t('settings.currentDate.gap')" />
    <q-input v-model="currentDateStore.config!.fontSize" :label="t('settings.currentDate.fontSize')" />
    <q-input v-model="currentDateStore.config!.textColor" :label="t('settings.currentDate.fontColor')">
      <template v-slot:append>
        <q-icon name="colorize" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-color v-model="currentDateStore.config!.textColor" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { useCurrentDateStore } from 'src/stores/currentDate';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const currentDateStore = useCurrentDateStore()
</script>
