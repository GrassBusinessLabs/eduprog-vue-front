<script setup>
import router from '@/router';

import { useEduProgsStore } from '@/stores/eduProgs.js'
import { onBeforeMount, reactive } from "vue";
import { useRoute } from 'vue-router'
const route = useRoute()
const eduProgsStore = useEduProgsStore()
const fkCompetencies = ref([])
const selectedFkCompetencies = ref([])
const fkCompetenciesValue = reactive({})
const allSelect= ref(false)
onBeforeMount(async ()=>{
  await eduProgsStore.fetchCompetencies("FK",eduProgsStore.eduProgData.speciality_code)
   await eduProgsStore.fetchSelectedCompetencies(route.params.pages,"FK")
   fkCompetencies.value = eduProgsStore.getAllCompetencies
   selectedFkCompetencies.value = eduProgsStore.getSelectedCompetencies
   fkCompetencies.value.forEach((comp)=>{
    if(selectedFkCompetencies.value.find(item=> item.competency_id == comp.id)){
        fkCompetenciesValue[comp.id]=true
    }else{
        fkCompetenciesValue[comp.id]=false
    }
   })
   allSelect.value = hasAllSelected()
})

const changeCheckbox = async (e, competencyId) => {
  if (e) {
    const newCompetency = await eduProgsStore.addCompetencyToEduprog(+route.params.pages, competencyId)
    selectedFkCompetencies.value.push(newCompetency)
  } else if (!e) {
    allSelect.value = false
    const obj = selectedFkCompetencies.value.find(item => item.competency_id === competencyId)
    selectedFkCompetencies.value = selectedFkCompetencies.value.filter(comp => comp.id != obj.id)
    await eduProgsStore.deleteCompetencyInEduprog(obj.id)
  }
  allSelect.value = hasAllSelected()
}

//Function for add all competencies or delete
const selectAll = async (event, type) => {
  if (event) {
    await eduProgsStore.addAllCompetencies(route.params.pages, "FK")
    for (let key in fkCompetenciesValue) {
      fkCompetenciesValue[key] = true
    }
    await eduProgsStore.fetchSelectedCompetencies(route.params.pages,"FK")
    selectedFkCompetencies.value = eduProgsStore.getSelectedCompetencies
  } else if (!event) {
    await eduProgsStore.deleteAllCompetencies(route.params.pages, "FK")
    for (let key in fkCompetenciesValue) {
      fkCompetenciesValue[key] = false
    }
  }
}

const hasAllSelected = () =>{
    for (let key in fkCompetenciesValue) {
      if(fkCompetenciesValue[key]===false){
        return false
      }
    }
    return true
}
</script>
<template>
<VTable>
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
        <th style="text-align: center">Код</th>
        <th style="text-align: center">Опис</th>
        <th style="text-align: center; width: 20%">
          <div class="mt-2" style="display: flex; flex-direction: column; align-items: center; justify-content: center">
            <span>Обрати все</span>
            <VCheckbox
              v-model="allSelect"
              @update:modelValue="selectAll($event, 'fk')"
            />
          </div>
        </th>
      </tr>
    </thead>
    <tbody >
      <tr
        v-for="item in fkCompetencies"
        :key="item.id"
      >
        <td
          class="py-3"
          style="text-align: center"
        >
          {{ "ФК"+item.code }}
        </td>
        <td class="py-3">
          {{ item.definition }}
        </td>
        <td>
          <VRow justify="center">
            <VCheckbox
              v-model="fkCompetenciesValue[item.id]"
              @update:modelValue="changeCheckbox($event, item.id)"
            />
          </VRow>
        </td>
      </tr>
    </tbody>
  </VTable>
</template>


