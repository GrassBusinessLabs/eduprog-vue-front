<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
const props = defineProps(['eduProg'])
const route = useRoute()
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { getData } from '@/api/http/apiService'
const eduProgsStore = useEduProgsStore()

const allRelations = ref([])
const allZkRel = ref([])
const allFkRel = ref([])
const selectedCompetencies =ref([])
const result = ref([])
const map = new Map()

onBeforeMount(async () => {
  await eduProgsStore.fetchCompetencies(route.params.id)
  await eduProgsStore.fetchCompetencyRelations(route.params.id)
  await eduProgsStore.fetchZkCompetencies(route.params.id)
  await eduProgsStore.fetchFkCompetencies(route.params.id)
  selectedCompetencies.value = eduProgsStore.getCompetencies
  allZkRel.value = eduProgsStore.getCompetenciesZk
  allFkRel.value = eduProgsStore. getCompetenciesFk
  allRelations.value = allZkRel.value.concat(allFkRel.value)
  allRelations.value.forEach(obj =>{
    obj.competency_id=obj.id
  })
  for (const item of  selectedCompetencies.value) {
    map.set(item.competency_id, true)
  }
  for (const item of allRelations.value) {
    result.value.push(map.has(item.competency_id))
  }
  result.value = Object.entries(result.value).reduce((acc, [key, value], index) => {
    acc[index + 1] = value

    return acc
  }, {})
})

const changeCheckbox = async (e, competencyId)=>{
  if(e){
    const newCompetency = await eduProgsStore.addCompetencyToEduprog(+route.params.id, competencyId)
    selectedCompetencies.value.push(newCompetency)
    console.log('Add', selectedCompetencies.value)
    console.log(' allFkRelations',  allRelations.value)
  }else if(!e){
    console.log( ' selectedCompetencies.value',selectedCompetencies.value)
    const obj =  selectedCompetencies.value.find(item => item.competency_id === competencyId)
    selectedCompetencies.value=selectedCompetencies.value.filter(comp => comp.id!=obj.id)
    console.log("Собираемся удалять",obj)
    await  eduProgsStore.deleteCompetencyInEduprog(obj.id)
  }
}
</script>

<template>
  <VTable>
    <thead class="thead-light">
      <tr>
        <th class="text-center">
          <h3>Загальні компетентності</h3>
        </th>
      </tr>
    </thead>
  </VTable>
  <VTable>
    <thead class="thead-light">
      <tr>
        <th style="text-align: center">
          Опис
        </th>
        <th style="text-align: center">
          Вибрано
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in allZkRel"
        :key="item.id"
      >
        <td class="py-3">
          {{ item.definition }}
        </td>
        <td>
          <VRow justify="center">
            <VCheckbox
              v-model="result[item.competency_id]"
              @update:modelValue="changeCheckbox($event,item.competency_id)"
            />
          </VRow>
        </td>
      </tr>
    </tbody>
  </VTable>
  <VTable class="mt-10">
    <thead class="thead-light">
      <tr>
        <th class="text-center">
          <h3>Фахові компетентності</h3>
        </th>
      </tr>
    </thead>
  </VTable>
  <VTable>
    <thead class="thead-light">
      <tr>
        <th style="text-align: center">
          Опис
        </th>
        <th style="text-align: center">
          Вибрано
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in allFkRel"
        :key="item.id"
      >
        <td class="py-3">
          {{ item.definition }}
        </td>
        <td>
          <VRow justify="center">
            <VCheckbox
              v-model="result[item.competency_id]"
              @update:modelValue="changeCheckbox($event,item.competency_id)"
            />
          </VRow>
        </td>
      </tr>
    </tbody>
  </VTable>
</template>
