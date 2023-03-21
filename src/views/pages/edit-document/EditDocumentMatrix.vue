<script setup>
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import ZkTable from '@/views/pages/edit-document/edit-matrix-tabs/ZK-table.vue'
import FkTable from '@/views/pages/edit-document/edit-matrix-tabs/FK-table.vue'
import PrTable from '@/views/pages/edit-document/edit-matrix-tabs/PR-table.vue'


import { useEduProgsStore } from '@/stores/eduProgs.js'

const props = defineProps(['eduProg'])
const eduProgsStore = useEduProgsStore()
const route = useRoute()
const lastTab = ref('ZKt')
const activeTab = ref(localStorage.getItem('activeTab') || route.params.tab)
console.log(route.params.tab)
onBeforeRouteUpdate((to, from) => {
  activeTab.value = lastTab.value
})

const tabs = [
  {
    title: 'Загальні компетентності',
    tab: 'ZKt',
  },
  {
    title: 'Фахові компетентності',
    tab: 'FKt',
  },
  {
    title: 'Програмні результати навчання',
    tab: 'PRt',
  },
]
watch(activeTab, newValue => {

  switch (newValue){
  case undefined :
    console.log('undefined')
    localStorage.setItem('activeTab',lastTab)
    console.log(lastTab.value)
    break
  case 'ZKt' :
    console.log('Ok ZKt')
    lastTab.value = newValue
    localStorage.setItem('activeTab', newValue)
    console.log(lastTab.value)
    break
  case 'FKt' :
    console.log('Ok FKt')
    lastTab.value = newValue
    localStorage.setItem('activeTab', newValue)
    break
  case 'PRt':
    console.log('Ok Prt')
    lastTab.value = newValue
    localStorage.setItem('activeTab', newValue)
    break
  }
})
</script>

<template>
  <VTabs
    v-model="activeTab"
    show-arrows
  >
    <VTab
      v-for="item in tabs"
      :key="item.tab"
      :value="item.tab"
    >
      {{ item.title }}
    </VTab>
  </VTabs>
  <VDivider />

  <VWindow
    v-model="activeTab"
    class="mt-5 disable-tab-transition"
    :touch="false"
  >
    <VWindowItem value="ZKt">
      <template v-if="activeTab === 'ZKt'">
        <ZkTable />
      </template>
    </VWindowItem>
    <VWindowItem value="FKt">
      <template v-if="activeTab === 'FKt'">
        <FkTable />
      </template>
    </VWindowItem>
    <VWindowItem value="PRt">
      <template v-if="activeTab === 'PRt'">
        <PrTable />
      </template>
    </VWindowItem>
  </VWindow>
</template>

