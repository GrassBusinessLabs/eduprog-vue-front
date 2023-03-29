<template>
    <VBtn
      dark
      @click="exportToExcel"
    >
      Експортувати
    </VBtn>
</template>
<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
const route = useRoute()
import { useRoute } from 'vue-router'
const eduProgsStore = useEduProgsStore()
const exportToExcel = () => {
  eduProgsStore.exportToExcel(route.params.pages)
}
</script>
