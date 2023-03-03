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
const maxValue = ref(6)


onBeforeMount(async () => {
  await eduProgsStore.fetchCompetencies(route.params.id)
  await eduProgsStore.fetchCompetencyRelations(route.params.id)
  const relations = eduProgsStore.getCompetencyRelations.reduce((acc, cur) => {
    const competency_id = cur.competency_id
    const component_id = cur.component_id
    if (!acc[competency_id]) {
      acc[competency_id] = {}
    }
    acc[competency_id][component_id] = true
    
    return acc
  }, {})
  console.log(relations)
  generalCompetencies.value = eduProgsStore.getCompetencies
  generalCompetencies.value.forEach(el => {
    selected[el.id] = reactive({})
    valuesZK[el.id] = 0
    components.mandatory.forEach(comp => {
      try{
        if(relations[el.id][comp.id]){
          valuesZK[el.id]++
          selected[el.id][comp.id] = true
        }
      }
      catch{
        selected[el.id][comp.id] = false
      }
    })
  })
})
const changeCheckbox = (e, componentId, competencyId)=>{
  if(e){
    valuesZK[competencyId]++
    eduProgsStore.createCompetencyRelation(+route.params.id, componentId, competencyId)
  }else if(!e){
    valuesZK[competencyId]--
    eduProgsStore.deleteCompetencyRelation(+route.params.id, componentId, competencyId)
  }
}
const progressColor = ref({})




const updateObjectColors = obj => {
  const newObject = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value < 3) {
      newObject[key] = 'error'
    } else if (value < 6) {
      newObject[key] = 'success'
    } else {
      newObject[key] = 'warning'
    }
  }
  
  return newObject
}

watch(valuesZK, newValue => {
  progressColor.value = updateObjectColors(newValue)
})

console.log('progressColor',progressColor)
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
                <VRow
                  justify="start"
                  align="center"
                  no-gutters
                >
                  <VCol
                    cols="1"
                    class="p-0"
                  >
                    {{ valuesZK[item.id] }}
                  </VCol>
                  <VCol>
                    <VProgressLinear
                      v-model="valuesZK[item.id]"
                      :max="maxValue"
                      :buffer-value="value"
                      :color="progressColor[item.id]"
                      :height="10"
                      rounded
                    />
                  </VCol>
                </VRow>
              </div>
            </td>
            <td
              v-for=" component in components.mandatory "
              :key=" component.id"
            >
              <VRow justify="center">
                <VCheckbox
                  v-model="selected[item.id][component.id]"
                  @update:modelValue="changeCheckbox($event, component.id, item.id)"
                />
              </VRow>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCol>
  </VRow>
</template>

<style scoped>
</style>
