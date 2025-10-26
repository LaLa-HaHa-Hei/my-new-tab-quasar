<template>
  <q-dialog ref="dialogRef">
    <q-card>
      <q-card-section>
        <div class="text-h6">添加搜索引擎</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input v-model="searchUrl" debounce="500" label="以 %s 代替查询的 URL" />
        <q-input v-model="label" label="名称" />
        <q-input v-model="icon" clearable label="图标地址" />
        <q-file accept="image/*" v-model="iconFile" label="上传本地图标" clearable filled />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="取消" color="warning" @click="handleCancelClick" />
        <q-btn flat label="添加" color="primary" @click="handleAddClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import type { SearchBoxItem } from 'src/types'


defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const searchUrl = ref('')
const label = ref('')
const icon = ref('')
const iconFile = ref<File | null>(null)

function handleAddClick() {
  const item: SearchBoxItem = {
    id: Date.now(),
    isEnabled: true,
    searchUrl: searchUrl.value,
    label: label.value,
    icon: icon.value,
  }
  onDialogOK(item)
}

function handleCancelClick() {
  onDialogCancel()
}

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
