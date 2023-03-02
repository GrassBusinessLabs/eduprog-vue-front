<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'

import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const eduProgsStore = useEduProgsStore()
const components = eduProgsStore.getEduProg.components
const generalCompetencies =ref([])
const selected = reactive({})
const value = ref(10)
const progressColor = ref('primary')

watch(value, newValue => {
  if (newValue < 25) {
    progressColor.value = 'error'
  } else if (newValue < 50) {
    progressColor.value = 'warning'
  } else if (newValue < 75) {
    progressColor.value = 'info'
  } else {
    progressColor.value = 'success'
  }
})

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
console.log('sdfgdfgdf',components)
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
                  v-model="value"
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
