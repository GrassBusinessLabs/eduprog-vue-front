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

const tabs = [
  {
    title: 'Загальні компетентності',
    icon: 'mdi-table',
    tab: 'ZKt',
  },
  {
    title: 'Фахові компетентності',
    icon: 'mdi-table',
    tab: 'FKt',
  },
  {
    title: 'Спеціальні фахові',
    icon: 'mdi-table',
    tab: 'VFKt',
  },
  {
    title: 'Програмні результати навчання',
    icon: 'mdi-table',
    tab: 'PRt',
  },
  {
    title: 'Спеціальні програмні результати ',
    icon: 'mdi-table',
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
      :key="item.icon"
      :value="item.tab"
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
    v-model="activeTab"
    class="mt-5 disable-tab-transition"
    :touch="false"
  >
    <!-- Головна -->
    <VWindowItem value="ZKt">
      <ZkTable />
    </VWindowItem>

    <!-- Перелік компонент -->
    <VWindowItem value="FKt">
      <FkTable />
    </VWindowItem>
    <!-- Структурно логічна схема -->
    <VWindowItem value="VFKt">
      <VfkTable />
    </VWindowItem>
    <!-- Структурно логічна послідовнсість -->
    <VWindowItem value="PRt">
      <PrTable />
    </VWindowItem>

    <!--   Компоненти ЗК   -->
    <VWindowItem value="VPRt">
      <VprTable />
    </VWindowItem>
  </VWindow>
</template>

<route lang="yaml">
meta:
navActiveLink: pages-account-settings-tab
requiresAuth: true
</route>
