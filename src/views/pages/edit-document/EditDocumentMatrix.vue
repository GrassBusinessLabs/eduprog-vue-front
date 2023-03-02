<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'

import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const eduProgsStore = useEduProgsStore()
const components = eduProgsStore.getEduProg.components
const generalCompetencies =ref([])
const selected = reactive({})
onBeforeMount(async () => {
  await eduProgsStore.fetchCompetencies(route.params.id)
  generalCompetencies.value = eduProgsStore.getCompetencies
  generalCompetencies.value.forEach(el => {
    selected[el.id] = reactive({})
    components.mandatory.forEach(comp => {
      selected[el.id][comp.id] = false
  })
})
})
const changeCheckbox = (e, componentId, competencyId)=>{
  if(e){
    eduProgsStore.createCompetencyRelation(+route.params.id, componentId, competencyId)
  }else if(!e){
    eduProgsStore.deleteCompetencyRelation(+route.params.id, componentId, competencyId)
  }
}
</script>

<template>
  <VRow>
    <VCol>
      <VTable>
        <tbody>
          <tr>
            <th />
            <th
              v-for="component in components.mandatory"
              :key="component.id"
            >
              <div style="text-align: center">
                <span>{{ 'ОК' + component.code }}</span>
              </div>
            </th>
          </tr>
          <tr
            v-for="item in generalCompetencies"
            :key="item.id"
          >
            <td colspan="1">
              <div style="text-align: center">
                <span>{{ 'ЗК' + item.id }}</span>
              </div>
            </td>
            <td
              v-for=" component in components.mandatory "
              :key=" component.id"            >
              <VCheckbox style="margin-left: 45%"
              v-model="selected[item.id][component.id]"
              @update:modelValue="changeCheckbox($event, item.id, component.id)"
              />
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCol>
  </VRow>
</template>
<style scoped>
</style>
