<script setup>
import { useRoute } from 'vue-router'
import ZkTable from '@/views/pages/edit-document/edit-matrix-tabs/ZK-table.vue'
import FkTable from '@/views/pages/edit-document/edit-matrix-tabs/FK-table.vue'
import VfkTable from '@/views/pages/edit-document/edit-matrix-tabs/VFK-table.vue'
import PrTable from '@/views/pages/edit-document/edit-matrix-tabs/PR-table.vue'
import VprTable from '@/views/pages/edit-document/edit-matrix-tabs/VPR-table.vue'

import { useEduProgsStore } from '@/stores/eduProgs.js'

const props = defineProps(['eduProg'])
const eduProgsStore = useEduProgsStore()
const route = useRoute()
const activeTab = ref(route.params.tab)

const changeURL = tab => {
  console.log('АКТИВ', activeTab.value)
}

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
    title: 'Спеціальні фахові',
    tab: 'VFKt',
  },
  {
    title: 'Програмні результати навчання',
    tab: 'PRt',
  },
  {
    title: 'Спеціальні програмні результати ',
    tab: 'VPRt',
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
      @click="changeURL(item)"
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
        <VWindowItem value="VFKt">
      <VfkTable />
    </VWindowItem>
    <VWindowItem value="PRt">
      <PrTable />
    </VWindowItem>
    <VWindowItem value="VPRt">
      <VprTable />
    </VWindowItem>
    <!-- Структурно логічна послідовнсість -->

    <!--   Компоненти ЗК   -->
  </VWindow>
</template>

<route lang="yaml">
meta:
navActiveLink: pages-account-settings-tab
requiresAuth: true
</route>
