<template>
  <q-dialog ref="dialogRef">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ t('widget.bookmark.addItemDialog.title') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input v-model="url" debounce="500" :label="t('widget.bookmark.addItemDialog.url')" />
        <q-input v-model="label" :label="t('widget.bookmark.addItemDialog.label')" />
        <div class="row items-center">
          <q-input class="col" v-model="icon" clearable :label="t('widget.bookmark.addItemDialog.iconUrl')" />
          <q-img style="width: 48px; height: 48px; border: 1px solid #ccc;" :src="icon" fit="contain" />
        </div>
        <q-file class="col-3" accept="image/*" v-model="iconFile"
          :label="t('widget.bookmark.addItemDialog.uploadLocalIcon')" clearable filled />


        <div class="row items-center">
          <div>{{ t('widget.bookmark.addItemDialog.tryDetectOfficialIcon') }}<br />{{
            t('widget.bookmark.addItemDialog.rightClickSaveToLocal') }}</div>
          <q-img style="width: 48px; height: 48px; border: 1px solid #ccc;" :src="officialIcon || ''" fit="contain" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat :label="t('common.button.cancel')" color="warning" @click="handleCancelClick" />
        <q-btn flat :label="t('common.button.add')" color="primary" @click="handleAddClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
// import { useDashboardStore } from 'src/stores/dashboard'
// import Bookmark from './Bookmark.vue'
import { useDialogPluginComponent } from 'quasar'
import type { WidgetItem } from 'src/types'
import type { BookmarkData } from './bookmarkData'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
// const dashboardStore = useDashboardStore()
const url = ref('')
const label = ref('')
const icon = ref('')
const iconFile = ref<File | null>(null)
const relativeIconUrls = ['/favicon.svg', '/favicon-128x128.png', '/favicon-96x96.png', '/favicon-32x32.png', '/favicon.png', '/favicon.ico']
const officialIcon = ref<string | null>(null)

function isValidUrl(str: string): boolean {
  try {
    new URL(str.startsWith('http') ? str : `http://${str}`)
    return true
  } catch {
    return false
  }
}

function getRootUrl(str: string): string | null {
  try {
    const urlObj = new URL(str.startsWith('http') ? str : `http://${str}`)
    return `${urlObj.protocol}//${urlObj.hostname}`
  } catch {
    return null
  }
}

async function tryLoadIcons(baseUrl: string) {
  for (let i = 0; i < relativeIconUrls.length; i++) {
    const testUrl = baseUrl + relativeIconUrls[i]
    const isLoaded = await new Promise<boolean>((resolve) => {
      const img = new window.Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = testUrl
    })
    if (isLoaded) {
      officialIcon.value = testUrl
      return
    }
  }
  // 没有可用图标，清空图标
  officialIcon.value = null
}

function handleAddClick() {
  const bookmarkData: BookmarkData = {
    url: url.value,
    label: label.value,
    icon: icon.value,
  }
  const widget: WidgetItem = {
    id: Date.now(),
    widgetKey: 'bookmark',
    w: 1,
    h: 1,
    data: bookmarkData,
  }
  onDialogOK(widget)
}

function handleCancelClick() {
  onDialogCancel()
}

let lastValidRootUrl: string = ''
watch(url, async (newVal) => {
  if (!newVal || !isValidUrl(newVal)) {
    officialIcon.value = null
    return
  }
  const baseUrl = getRootUrl(newVal)
  // 域名相同，图标获取不变
  if (baseUrl === null || baseUrl === lastValidRootUrl)
    return
  lastValidRootUrl = baseUrl
  officialIcon.value = null
  await tryLoadIcons(baseUrl)
})

// 当选择本地图标文件时，把文件转换为 base64 并赋值给 icon
watch(iconFile, async (file) => {
  if (!file || !file.type.startsWith('image/')) {
    return
  }

  try {
    const dataUrl = await fileToBase64(file)
    icon.value = dataUrl
  } catch (e) {
    console.error('转换文件为 base64 失败', e)
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
</script>
