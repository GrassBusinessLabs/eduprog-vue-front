<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'

import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const eduProgsStore = useEduProgsStore()
const components = eduProgsStore.getEduProg.components
const generalCompetencies =ref([])
const selected = reactive({})
const valuesZK = reactive({})
const maxValue = ref(10)
const progressColor = ref('primary') 


onBeforeMount(async () => {
  await eduProgsStore.fetchCompetencies(route.params.id)
  await eduProgsStore.fetchCompetencyRelations(route.params.id)
  const relations = eduProgsStore.getCompetencyRelations.reduce((acc, cur) => {
    const competency_id = cur.competency_id;
    const component_id = cur.component_id;
    if (!acc[competency_id]) {
        acc[competency_id] = {};
    }
    acc[competency_id][component_id] = true;
    
    return acc;
}, {});
  generalCompetencies.value = eduProgsStore.getCompetencies
  generalCompetencies.value.forEach(el => {
    selected[el.id] = reactive({})
    valuesZK[el.id] = 0
    components.mandatory.forEach(comp => {
      if(relations[el.id][comp.id]){
        valuesZK[el.id]++
        selected[el.id][comp.id] = true
      }
      else{
        selected[el.id][comp.id] = false
      }
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
console.log(valuesZK)
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
                <VTooltip
                  activator="parent"
                  location="top"
                >
                  {{ component.name }}
                </VTooltip>
                <span>{{ 'ОК' + component.code }}</span>
              </div>
            </th>
          </tr>
          <tr
            v-for="item in generalCompetencies"
            :key="item.id"
          >
            <td
              colspan="1"
              style="width: 30%"
            >
              <div style="text-align: center">
                <span><h3>
                        {{ 'ЗК' + item.id }}</h3>
                  {{ item.redefinition }}
                </span>
                <VProgressLinear

                  :max="maxValue"
                  :buffer-value="value"
                  :color="progressColor"
                />
              </div>
            </td>
            <td
              v-for=" component in components.mandatory "
              :key=" component.id"
            >
              <VCheckbox
                v-model="selected[item.id][component.id]"
                style="margin-left: 47%"
                @update:modelValue="changeCheckbox($event, component.id, item.id)"
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
