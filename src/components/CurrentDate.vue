<template>
  <div class="row flex-center" v-if="currentDateStore.config!.display" :style="{
    fontSize: currentDateStore.config!.fontSize,
    paddingTop: currentDateStore.config!.paddingTop,
    gap: currentDateStore.config!.gap,
    color: currentDateStore.config!.textColor,
  }">
    <span>{{ dateString }}</span>
    <span>{{ weekdayString }}</span>
  </div>
</template>

<script setup lang="ts">
import { useCurrentDateStore } from 'src/stores/currentDate'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'


const currentDateStore = useCurrentDateStore()
const now = ref(new Date())
const i18n = useI18n({ useScope: 'global' })

const dateString = computed(() => {
  return new Intl.DateTimeFormat(i18n.locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(now.value)
})

const weekdayString = computed(() => {
  return new Intl.DateTimeFormat(i18n.locale.value, {
    weekday: 'long'
  }).format(now.value)
})
</script>
