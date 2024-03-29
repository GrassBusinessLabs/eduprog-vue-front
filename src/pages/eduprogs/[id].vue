<script setup>
import { useRoute, onBeforeRouteUpdate, useRouter } from 'vue-router'
import EditDocumentCharacteristic from '@/views/pages/edit-document/EditDocumentCharacteristic.vue'
import EditDocumentComponents from '@/views/pages/edit-document/EditDocumentComponents.vue'
import EditDocumentSchema from '@/views/pages/edit-document/EditDocumentSchema.vue'
import EditDocumentSequence from '@/views/pages/edit-document/EditDocumentSequence.vue'
import EditDocumentMatrix from '@/views/pages/edit-document/EditDocumentMatrix.vue'
import EditDocumentZK from '@/views/pages/edit-document/EditDocumentZK.vue'

import { useEduProgsStore } from '@/stores/eduProgs.js'
import axios from 'axios'
import { reactive } from 'vue'
const eduProgsStore = useEduProgsStore()
const route = useRoute()
const router = useRouter()
const activeTab = reactive({value: route.params.query?.tab})
onMounted(async () => {
  await eduProgsStore.findEduProgById(route.params.id)
  await eduProgsStore.fetchScheme(route.params.id)
})
const exportToExcel = () =>{
  eduProgsStore.exportToExcel(route.params.id)
}
const changeURL = (tab) =>{
  router.replace({path: route.path, query: {tab: tab.tab}})
  activeTab.value=tab.tab
}
const tabs = [
  {
    title: 'Загальна Характеристика',
    icon: 'mdi-format-list-bulleted',
    tab: 'characteristic',
  },
  {
    title: 'Перелік компонентів',
    icon: 'mdi-sort-variant',
    tab: 'components',
  },
  {
    title: 'Розподіл по семестрам',
    icon: 'mdi-table',
    tab: 'sequence',
  },
  {
    title: 'Структурно-логічна послідовність ОПП',
    icon: 'mdi-format-line-style',
    tab: 'schema',
  },
  {
    title: 'Вибір компетентностей',
    icon: 'mdi-archive-check-outline',
    tab: 'compZK',
  },
  {
    title: 'Матриця відповідностей',
    icon: 'mdi-matrix',
    tab: 'matrix',
  },
]
</script>

<template>
  <VRow
    justify="start"
    class="mb-3"
  >
    <VBtn
      dark
      @click="exportToExcel"
    >
      Експортувати
    </VBtn>
  </VRow>
  <div v-if="!eduProgsStore.isLoading && eduProgsStore.getEduProg && eduProgsStore.getEduProg.id != 0">
    <VTabs
      :value="activeTab.value"
      show-arrows
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
        @click="changeURL(item)"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>
    <VDivider />

    <VWindow
      v-model="activeTab.value"
      class="mt-5 disable-tab-transition"
      :touch="false"
    >
      <!-- Головна -->
      <VWindowItem value="characteristic">
        <EditDocumentCharacteristic :edu-prog="eduProgsStore.getEduProg" />
      </VWindowItem>

      <!-- Перелік компонентів -->
      <VWindowItem value="components">
        <EditDocumentComponents />
      </VWindowItem>
      <!-- Структурно логічна схема -->
      <VWindowItem value="sequence">
        <EditDocumentSchema
          @addComponentToScheme="addComponentToScheme"
          @deleteComponentFromSheme="deleteComponentFromSheme"
        />
      </VWindowItem>
      <!-- Структурно логічна послідовнсість -->
      <VWindowItem value="schema">
        <EditDocumentSequence :components="eduProgsStore.getEduProg.components" />
      </VWindowItem>

      <!--   Компоненти ЗК   -->
      <VWindowItem value="compZK">
        <EditDocumentZK />
      </VWindowItem>

      <!-- Матриця -->
      <VWindowItem value="matrix">
        <template v-if="activeTab.value === 'matrix'">
          <EditDocumentMatrix />
        </template>
      </VWindowItem>
    </VWindow>
  </div>
  <VAlert
    v-if="eduProgsStore.getEduProg.id == 0"
    border="bottom"
    colored-border
    type="warning"
    elevation="2"
  >
    ОПП з таким id не знайдено.
  </VAlert>
</template>

<route lang="yaml">
meta:
navActiveLink: pages-account-settings-tab
requiresAuth: true
</route>
