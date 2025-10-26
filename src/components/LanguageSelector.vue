<template>
  <div class="language-selector cursor-pointer">
    <q-btn flat icon="language" padding="xs">
      <q-menu v-model="menuVisible" class="bg-grey-3" anchor="bottom middle" self="top middle" color="grey-3">
        <q-list dense separator>
          <q-item v-for="item in localeOptions" :key="item.value" clickable @click="changeLocale(item.value)">
            <q-item-section class="items-center">{{ item.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { LocalStorage } from 'quasar'
import { StorageKey } from 'src/constants/storageKeys'
import { Notify } from 'quasar'

const menuVisible = ref(false)
const { locale } = useI18n({ useScope: 'global' })
const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'zh-CN', label: '简体中文' }
]

function changeLocale(newLocale: string) {
  locale.value = newLocale
  LocalStorage.set(StorageKey.LANGUAGE, locale.value)
  menuVisible.value = false
  Notify.create({
    message: 'Language changed',
    color: 'positive',
    position: 'top'
  })
}
</script>

<style scoped lang="scss">
.language-selector {
  position: absolute;
  top: 2rem;
  right: 3rem;
  color: rgba(255, 255, 255, 0.5);
}
</style>
