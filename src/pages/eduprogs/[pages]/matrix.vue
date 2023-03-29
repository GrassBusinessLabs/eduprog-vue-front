<script setup>
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import ZkTable from '@/views/pages/edit-document/edit-matrix-tabs/ZK-table.vue'
import FkTable from '@/views/pages/edit-document/edit-matrix-tabs/FK-table.vue'
import PrTable from '@/views/pages/edit-document/edit-matrix-tabs/PR-table.vue'
import { useEduProgsStore } from '@/stores/eduProgs.js'
onMounted(async () => {
  await eduProgsStore.findEduProgById(route.params.pages)
})
const props = defineProps(['eduProg'])
const eduProgsStore = useEduProgsStore()
const route = useRoute()
const lastTab = ref('ZKt')
const activeTab = ref('ZKt')

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
        <ZkTable />
    </VWindowItem>
    <VWindowItem value="FKt">
        <FkTable />
    </VWindowItem>
    <VWindowItem value="PRt">
        <PrTable />
    </VWindowItem>
  </VWindow>
</template>
<route lang="yaml">
name: matrix
meta:
  navActiveLink: pages-account-settings-tab
  requiresAuth: true
  test: true
</route>