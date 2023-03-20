<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { onBeforeMount, onMounted, reactive } from 'vue'
import EditZkCompetencies from '@/views/pages/edit-document/edit-competency-tabs/EditZkCompetencies.vue'
import EditFkCompetencies from '@/views/pages/edit-document/edit-competency-tabs/EditFkCompetencies.vue'
import EditPrCompetencies from '@/views/pages/edit-document/edit-competency-tabs/EditPrCompetencies.vue'
import EditVfkCompetencies from '@/views/pages/edit-document/edit-competency-tabs/EditVfkCompetencies.vue'
import EditVprCompetencies from '@/views/pages/edit-document/edit-competency-tabs/EditVprCompetencies.vue'
import { useRoute } from 'vue-router'
const props = defineProps(['eduProg'])
const route = useRoute()
const eduProgsStore = useEduProgsStore()
const activeTab = ref(route.params.tab)
const tabs = [
  {
    title: 'Загальні компетентності',
    tab: 'zk',
  },
  {
    title: 'Фахові компетентності',
    tab: 'fk',
  },
  {
    title: 'Спеціальні передбачені вищим закладом',
    tab: 'vfk',
  },
  {
    title: 'Програмні результати навчання',
    tab: 'pr',
  },
    {
    title: 'Передбачені закладом вищої освіти',
    tab: 'vpr',
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
    <!-- Головна -->
    <VWindowItem value="zk">
      <EditZkCompetencies />
    </VWindowItem>
    <VWindowItem value="fk">
      <EditFkCompetencies />
    </VWindowItem>
    <VWindowItem value="pr">
      <EditPrCompetencies />
    </VWindowItem>
    <VWindowItem value="vpr">
      <EditVprCompetencies />
    </VWindowItem>
    <VWindowItem value="vfk">
      <EditVfkCompetencies />
    </VWindowItem>
  </VWindow>
</template>

<style></style>
