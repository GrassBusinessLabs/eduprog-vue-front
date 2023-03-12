<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
const props = defineProps(['eduProg'])
const route = useRoute()
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { getData } from '@/api/http/apiService'
const eduProgsStore = useEduProgsStore()

const allRelations = ref([])
const selectedCompetencies =ref([])
const result = ref([])
const map = new Map()

onBeforeMount(async () => {
  await eduProgsStore.fetchCompetencies(route.params.id)
  await eduProgsStore.fetchCompetencyRelations(route.params.id)
  await eduProgsStore.fetchCompetencyAllRelations(route.params.id)
  selectedCompetencies.value = eduProgsStore.getCompetencies
  allRelations.value = eduProgsStore.getCompetencyAllRelations
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
    <body>
      <tr>
        <th class="table-cell table-header">
          Компонент ЗК
        </th>
        <th class="table-cell table-header">
          Опис
        </th>
        <th class="table-cell table-header">
          Вибрано
        </th>
      </tr>
      <tr
        v-for="item in allRelations"
        :key="item.id"
      >
        <td
          class="table-cell"
          style="text-align: center; width: 12%"
        >
          {{ item.competency_id + " " + item.type }}
        </td>
        <td class="table-cell" >
          {{ item.definition }}
        </td>
        <td
          class="table-cell"
          style="text-align: center; width: 10%"
        >
          <VRow style="margin-left: 45%; width: 15%" justify="center" >
            <VCheckbox
              v-model="result[item.competency_id]"
              @update:modelValue="changeCheckbox($event,item.competency_id)"
            />
          </VRow>
        </td>
      </tr>
    </body>
  </VTable>
</template>

<style>
.table-cell {
  border-bottom: 1px solid #ccc;
  padding-bottom:5px ;
  text-align: center;
  vertical-align: middle;
}

.table-header {
  font-weight: bold;
}
</style>
