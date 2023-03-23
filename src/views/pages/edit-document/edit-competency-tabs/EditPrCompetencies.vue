<script setup>
import router from '@/router';

import { useEduProgsStore } from '@/stores/eduProgs.js'
import { onBeforeMount, reactive } from "vue";
import { useRoute } from 'vue-router'
const route = useRoute()
const eduProgsStore = useEduProgsStore()
const prCompetencies = ref([])
const selectedPrCompetencies = ref([])
const prCompetenciesValue = reactive({})
const allSelect= ref(false)
onBeforeMount(async ()=>{
  await eduProgsStore.fetchCompetencies("PR",eduProgsStore.eduProgData.speciality_code)
   await eduProgsStore.fetchSelectedCompetencies(route.params.pages,"PR")
   prCompetencies.value = eduProgsStore.getAllCompetencies
   selectedPrCompetencies.value = eduProgsStore.getSelectedCompetencies
   prCompetencies.value.forEach((comp)=>{
    if(selectedPrCompetencies.value.find(item=> item.competency_id == comp.id)){
        prCompetenciesValue[comp.id]=true
    }else{
        prCompetenciesValue[comp.id]=false
    }
   })
   allSelect.value = hasAllSelected()
})

const changeCheckbox = async (e, competencyId) => {
  if (e) {
    const newCompetency = await eduProgsStore.addCompetencyToEduprog(+route.params.pages, competencyId)
    selectedPrCompetencies.value.push(newCompetency)
  } else if (!e) {
    allSelect.value = false
    const obj = selectedPrCompetencies.value.find(item => item.competency_id === competencyId)
    selectedPrCompetencies.value = selectedPrCompetencies.value.filter(comp => comp.id != obj.id)
    await eduProgsStore.deleteCompetencyInEduprog(obj.id)
  }
  allSelect.value = hasAllSelected()
}

//Function for add all competencies or delete
const selectAll = async (event, type) => {
  if (event) {
    await eduProgsStore.addAllCompetencies(route.params.pages, "PR")
    for (let key in prCompetenciesValue) {
      prCompetenciesValue[key] = true
    }
    await eduProgsStore.fetchSelectedCompetencies(route.params.pages,"PR")
    selectedPrCompetencies.value = eduProgsStore.getSelectedCompetencies
  } else if (!event) {
    await eduProgsStore.deleteAllCompetencies(route.params.pages, "PR")
    for (let key in prCompetenciesValue) {
      prCompetenciesValue[key] = false
    }
  }
}

const hasAllSelected = () =>{
    for (let key in prCompetenciesValue) {
      if(prCompetenciesValue[key]===false){
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
          <h3>Загальні компетентності</h3>
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
              @update:modelValue="selectAll($event, 'pr')"
            />
          </div>
        </th>
      </tr>
    </thead>
    <tbody >
      <tr
        v-for="item in prCompetencies"
        :key="item.id"
      >
        <td
          class="py-3"
          style="text-align: center"
        >
          {{ "ПР"+item.code }}
        </td>
        <td class="py-3">
          {{ item.definition }}
        </td>
        <td>
          <VRow justify="center">
            <VCheckbox
              v-model="prCompetenciesValue[item.id]"
              @update:modelValue="changeCheckbox($event, item.id)"
            />
          </VRow>
        </td>
      </tr>
    </tbody>
  </VTable>
</template>


