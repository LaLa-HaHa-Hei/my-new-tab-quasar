<template>
  <div>
    <q-btn :label="t('common.button.resetToDefault')" color="warning" @click="handleResetToDefault" />
    <q-input class="q-mt-md" v-model="backgroundStore.config!.blurLevel" :label="t('settings.background.blurLevel')" />
    <q-input class="col" v-model="backgroundStore.config!.image" clearable :label="t('settings.background.iconUrl')" />
    <q-file class="col-3" accept="image/*" v-model="iconFile" :label="t('settings.background.uploadLocalIcon')"
      clearable filled />
  </div>
</template>

<script setup lang="ts">
import { useBackgroundStore } from 'src/stores/background';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n'
import { Notify } from 'quasar'

const { t } = useI18n()
const backgroundStore = useBackgroundStore()
const iconFile = ref<File | null>(null);

watch(iconFile, async (file) => {
  if (!file || !file.type.startsWith('image/')) {
    return
  }

  try {
    const dataUrl = await fileToBase64(file)
    backgroundStore.config!.image = dataUrl
  } catch (e) {
    console.error('fail to convert file to base64', e)
  }
})

function fileToBase64(f: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result as string
      resolve(result)
    }

    reader.onerror = () => reject(new Error('file read error'));


    reader.readAsDataURL(f)
  })
}

function handleResetToDefault() {
  backgroundStore.resetToDefault()
  Notify.create({
    message: t('common.message.success'),
    color: 'positive',
    position: 'top',
  })
}
</script>
