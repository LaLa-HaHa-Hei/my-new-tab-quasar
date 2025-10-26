<template>
  <teleport to="body">
    <div v-show="isOpen" class="fixed fixed-full" @click="isOpen = false">
    </div>
    <div v-show="isOpen" ref="dialogRef" class="settings-dialog rounded-borders column fixed"
      :style="{ left: pos.left + 'px', top: pos.top + 'px' }">
      <header @pointerdown.prevent="startDrag($event)" class="full-width">
        <q-toolbar>
          <q-btn flat icon="arrow_back" @click="goBack" :disabled="navigationStack.length === 1" @pointerdown.stop />
          <q-toolbar-title shrink class="non-selectable">{{ t('settings.title') }}</q-toolbar-title>
          <div class="col"></div>
          <q-btn flat icon="close" @click="isOpen = false" @pointerdown.stop />
        </q-toolbar>
      </header>

      <div class="col row full-width" style="min-width: 0;">
        <nav class="full-height" style="border-right: 1px solid #e0e0e0;">
          <q-tabs v-model="currentTab" vertical class="text-teal">
            <q-tab content-class="q-px-sm" v-for="tab in tabs" :key="tab.name" :name="tab.name" :label="tab.label"
              @click="navigateToPage(tab.name)" />
          </q-tabs>
        </nav>

        <q-separator vertical />

        <main class="settings-content full-height column col" style="min-height: 0;">
          <!-- 面包屑 -->
          <q-breadcrumbs class="text-h5 q-pa-md q-pb-sm">
            <template v-slot:separator>
              <q-icon size="1.2em" name="navigate_next" />
            </template>
            <q-breadcrumbs-el v-for="(label, index) in breadcrumbs" :key="label" :label="label"
              @click="navigateToBreadcrumb(index)" class="cursor-pointer" />
          </q-breadcrumbs>
          <!-- 内容 -->
          <div class="col q-pa-md q-pt-sm full-width overflow-auto" style="min-width: 0;">
            <component :is="pages[currentPage]!.component" @navigate="navigateToPage" />
          </div>
        </main>
      </div>
    </div>
  </teleport>
</template>


<script setup lang="ts">
import { ref, computed, type Component, type ComputedRef, watch, onBeforeUnmount, nextTick, markRaw } from 'vue'
import DashboardPage from './settings/DashboardPage.vue'
import SearchEnginePage from './settings/SearchEnginePage.vue'
import BackgroundPage from './settings/BackgroundPage.vue'
import AddWidgetPage from './settings/AddWidgetPage.vue'
import ConfigManagerPage from './settings/ConfigManagerPage.vue'
import CurrentTimePage from './settings/CurrentTimePage.vue'
import CurrentDatePage from './settings/CurrentDatePage.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  modelValue: Boolean,
  initPage: {
    type: String,
    default: 'background',
  }
})

const dialogRef = ref<HTMLElement | null>(null)
const pos = ref({ left: 0, top: 0 })
// 页面组件映射
const pages: ComputedRef<Record<string, { parent: string | null, component: Component, label: string }>> = computed(() => ({
  'background': { parent: null, component: markRaw(BackgroundPage), label: t('settings.pages.background') },
  'current-time': { parent: null, component: markRaw(CurrentTimePage), label: t('settings.pages.currentTime') },
  'current-date': { parent: null, component: markRaw(CurrentDatePage), label: t('settings.pages.currentDate') },
  'search-engine': { parent: null, component: markRaw(SearchEnginePage), label: t('settings.pages.searchEngine') },
  'dashboard': { parent: null, component: markRaw(DashboardPage), label: t('settings.pages.dashboard') },
  'add-widget': { parent: 'dashboard', component: markRaw(AddWidgetPage), label: t('settings.pages.addWidget') },
  'config-manager': { parent: null, component: markRaw(ConfigManagerPage), label: t('settings.pages.configManager') },
}))
const tabs = computed<{ name: string; component: Component; label: string }[]>(() =>
  Object.entries(pages.value)
    .filter(([, value]) => value.parent === null)
    .map(([key, value]) => ({
      name: key,
      component: value.component,
      label: value.label,
    }))
)


const emit = defineEmits(['update:modelValue'])
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 当前选中的根标签
const currentTab = ref(getTopParent(props.initPage))
// 当前展示的页面
const currentPage = ref(props.initPage)
// 导航栈，用于回退上一个页面
const navigationStack = ref<string[]>([currentTab.value])
// 当前页面的层级关系
const path: ComputedRef<string[]> = computed(() => {
  const chain: string[] = [];
  let current: string | null = currentPage.value;
  while (current) {
    chain.unshift(current); // 从前面插入，保持从顶层到自身
    current = pages.value[current]?.parent ?? null;
  }
  return chain;
})
// 面包屑导航
const breadcrumbs = computed(() => path.value.map((item) => pages.value[item]!.label))

let startX = 0
let startY = 0
let initLeft = 0
let initTop = 0

function startDrag(e: PointerEvent) {
  startX = e.clientX
  startY = e.clientY
  initLeft = pos.value.left
  initTop = pos.value.top

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp);
  (e.target as Element).setPointerCapture?.(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  pos.value.left = initLeft + dx
  pos.value.top = initTop + dy
}

function onPointerUp(e: PointerEvent) {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  try { (e.target as Element).releasePointerCapture?.(e.pointerId) } catch { ; }
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})

watch(isOpen, async (newVal) => {
  // 从隐藏到显示时，初始化数据
  if (newVal === true) {
    currentTab.value = getTopParent(props.initPage)
    currentPage.value = props.initPage
    navigationStack.value = [currentTab.value]

    await nextTick()
    if (dialogRef.value) {
      // 获取弹窗自身宽高
      const dialogWidth = dialogRef.value.offsetWidth
      const dialogHeight = dialogRef.value.offsetHeight

      // 计算屏幕中央位置
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      // 设置居中位置（减去自身一半尺寸）
      pos.value.left = (screenWidth - dialogWidth) / 2
      pos.value.top = (screenHeight - dialogHeight) / 2
    }
  }
})

// 导航到页面
function navigateToPage(pageName: string) {
  currentTab.value = getTopParent(pageName)
  currentPage.value = pageName
  navigationStack.value.push(pageName)
}

// 返回历史中上个页面
function goBack() {
  if (navigationStack.value.length === 1) return;
  navigationStack.value.pop();
  currentPage.value = navigationStack.value.at(-1)!;
  currentTab.value = getTopParent(currentPage.value);
}

// 点击面包屑导航
function navigateToBreadcrumb(index: number) {
  if (index < breadcrumbs.value.length - 1) {
    const pageName = path.value[index]!
    currentPage.value = pageName
    navigationStack.value.push(pageName)
  }
}

// 获取页面顶部父标签
function getTopParent(key: string): string {
  let current = key;
  while (pages.value[current]?.parent)
    current = pages.value[current]!.parent!;
  return current;
}
</script>

<style scoped lang="scss">
.settings-dialog {
  background-color: $grey-4;
  width: 50vw;
  height: 50vh;

  header {
    min-width: 0;
    cursor: move;
    border-bottom: 1px solid $grey-5;
    overflow: hidden;
  }
}

@media (min-width: 0px) and (max-width: $breakpoint-xs-max) {
  .settings-dialog {
    width: 90vw;
    height: 90vh;
  }
}

@media (min-width: $breakpoint-sm-min) and (max-width: $breakpoint-sm-max) {
  .settings-dialog {
    width: 80vw;
    height: 80vh;
  }
}

@media (min-width: $breakpoint-md-min) and (max-width: $breakpoint-md-max) {
  .settings-dialog {
    width: 70vw;
    height: 70vh;
  }
}

@media (min-width: $breakpoint-lg-min) {
  .settings-dialog {
    width: 60vw;
    height: 60vh;
  }
}
</style>
