<template>
  <div class="full-width">
    <div>
      <q-btn :label="t('settings.searchEngine.addSearchEngine')" color="primary" @click="handleAdd" />
      <q-btn class="q-ml-md" :label="t('common.button.resetToDefault')" color="warning" @click="handleResetToDefault" />
    </div>
    <div>
      <q-list bordered separator class="rounded-borders q-mt-md">
        <q-expansion-item expand-separator :label="t('settings.searchEngine.searchBoxContainerConfig')">
          <q-card class="bg-grey-3">
            <q-card-section>
              <q-toggle v-model="searchBoxContainerStore.config!.display" :label="t('settings.searchEngine.display')" />
              <q-input v-model="searchBoxContainerStore.config!.paddingTop"
                :label="t('settings.searchEngine.paddingTop')" />
              <q-input v-model="searchBoxContainerStore.config!.paddingX"
                :label="t('settings.searchEngine.paddingX')" />
              <q-input v-model.number="searchBoxContainerStore.config!.columnCount"
                :label="t('settings.searchEngine.columnCount')" type="number" />
              <q-input v-model="searchBoxContainerStore.config!.gap" :label="t('settings.searchEngine.gap')" />
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item expand-separator :label="t('settings.searchEngine.searchBoxItemConfig')">
          <q-card class="bg-grey-3">
            <q-card-section>
              <q-toggle v-model="searchBoxStore.config!.openInNewTab"
                :label="t('settings.searchEngine.openInNewTab')" />
              <q-toggle v-model="searchBoxStore.config!.clearAfterSearch"
                :label="t('settings.searchEngine.clearAfterSearch')" />
              <q-input v-model="searchBoxStore.config!.bgColor" :label="t('settings.searchEngine.bgColor')">
                <template v-slot:append>
                  <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-color v-model="searchBoxStore.config!.textColor" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input v-model="searchBoxStore.config!.focusBgColor" :label="t('settings.searchEngine.focusBgColor')">
                <template v-slot:append>
                  <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-color v-model="searchBoxStore.config!.focusBgColor" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input v-model="searchBoxStore.config!.height" :label="t('settings.searchEngine.height')" />
              <q-input v-model="searchBoxStore.config!.borderRadius" :label="t('settings.searchEngine.borderRadius')" />
              <q-input v-model="searchBoxStore.config!.borderColor" :label="t('settings.searchEngine.borderColor')">
                <template v-slot:append>
                  <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-color v-model="searchBoxStore.config!.borderColor" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input v-model="searchBoxStore.config!.paddingLeft" :label="t('settings.searchEngine.paddingLeft')" />
              <q-input v-model="searchBoxStore.config!.paddingRight" :label="t('settings.searchEngine.paddingRight')" />
              <q-input v-model="searchBoxStore.config!.fontSize" :label="t('settings.searchEngine.fontSize')" />
              <q-input v-model="searchBoxStore.config!.textColor" :label="t('settings.searchEngine.fontColor')">
                <template v-slot:append>
                  <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-color v-model="searchBoxStore.config!.textColor" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input v-model="searchBoxStore.config!.iconSize" :label="t('settings.searchEngine.iconSize')" />
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
    <div class="q-mt-md full-width">
      <q-table card-class="bg-grey-3" separator="cell" :rows="items" :columns="columns" row-key="id"
        :rows-per-page-options="[0]">
        <template v-slot:body-cell-isEnabled="props">
          <q-td key="h" :props="props" align="center">
            <q-toggle dense :model-value="props.row.isEnabled"
              @update:model-value="handleSetEnabled(props.rowIndex, $event)" />
          </q-td>
        </template>
        <template v-slot:body-cell-icon="props">
          <q-td key="h" :props="props" align="center">
            <q-img :src="props.row.icon" />
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td align="center">
            <q-btn color="primary" dense flat icon="edit" @click="handleEdit(props.rowIndex)" />
            <q-btn color="primary" dense flat icon="move_up" @click="handleMoveUp(props.rowIndex)" />
            <q-btn color="primary" dense flat icon="move_down" @click="handleMoveDown(props.rowIndex)" />
            <q-btn color="negative" dense flat icon="delete" @click="handleDelete(props.rowIndex)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearchBoxContainerStore } from 'src/stores/searchBoxContainer'
import { Notify, Dialog } from 'quasar'
import type { SearchBoxItem } from 'src/types'
import { computed } from 'vue'
import AddSearchBoxDialog from 'src/components/AddSearchBoxDialog.vue'
import EditSearchBoxDialog from 'src/components/EditSearchBoxDialog.vue'
import { useSearchBoxStore } from 'src/stores/searchBox'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const searchBoxStore = useSearchBoxStore()
const searchBoxContainerStore = useSearchBoxContainerStore()

const columns = computed(() => [
  { name: 'isEnabled', label: t('settings.searchEngine.isEnabled'), field: 'isEnabled', align: 'center' as const },
  { name: 'label', label: t('settings.searchEngine.name'), field: 'label', align: 'center' as const },
  { name: 'searchUrl', label: t('settings.searchEngine.searchUrl'), field: 'searchUrl' },
  { name: 'icon', label: t('settings.searchEngine.icon'), field: 'icon', align: 'center' as const },
  { name: 'actions', label: t('settings.searchEngine.action'), field: 'actions', align: 'center' as const }
])

const items = computed<SearchBoxItem[]>(() => searchBoxContainerStore.getItems())

function handleAdd() {
  Dialog.create({
    component: AddSearchBoxDialog,
  })
    .onOk((item: SearchBoxItem) => {
      searchBoxContainerStore.addItem(item)
      Notify.create({
        message: '添加成功',
        color: 'positive',
        position: 'top',
      })
    })
    .onCancel(() => {
    })
    .onDismiss(() => {
    });
}

function handleEdit(index: number) {
  Dialog.create({
    component: EditSearchBoxDialog,
    componentProps: {
      item: items.value[index],
    }
  })
    .onOk((item: SearchBoxItem) => {
      searchBoxContainerStore.setItem(index, item)
      Notify.create({
        message: '编辑成功',
        color: 'positive',
        position: 'top',
      })
    })
    .onCancel(() => {
    })
    .onDismiss(() => {
    });
}

function handleMoveUp(index: number) {
  searchBoxContainerStore.moveItemUp(index)
}
function handleMoveDown(index: number) {
  searchBoxContainerStore.moveItemDown(index)
}

function handleDelete(index: number) {
  searchBoxContainerStore.deleteItem(index)
}

function handleSetEnabled(index: number, enabled: boolean) {
  searchBoxContainerStore.setItemEnabled(index, enabled)
}

function handleResetToDefault() {
  searchBoxContainerStore.resetToDefault()
  searchBoxStore.resetToDefault()
  Notify.create({
    message: t('settings.searchEngine.resetToDefaultSuccess'),
    color: 'positive',
    position: 'top',
  })
}
</script>
