<script setup>
import router from '@/router';

import { useEduProgsStore } from '@/stores/eduProgs.js'
import { onBeforeMount, reactive } from "vue";
import { useRoute } from 'vue-router'
const route = useRoute()
const eduProgsStore = useEduProgsStore()
const zkCompetencies = ref([])
const selectedZkCompetencies = ref([])
const zkCompetenciesValue = reactive({})
const allSelect= ref(false)
onBeforeMount(async ()=>{
   await eduProgsStore.fetchCompetencies("ZK")
   await eduProgsStore.fetchSelectedCompetencies(route.params.id,"ZK")
   zkCompetencies.value = eduProgsStore.getAllCompetencies
   selectedZkCompetencies.value = eduProgsStore.getSelectedCompetencies
   zkCompetencies.value.forEach((comp)=>{
    if(selectedZkCompetencies.value.find(item=> item.competency_id == comp.id)){
        zkCompetenciesValue[comp.id]=true
    }else{
        zkCompetenciesValue[comp.id]=false
    }
   })
   allSelect.value = hasAllSelected()
})

const changeCheckbox = async (e, competencyId) => {
  if (e) {
    const newCompetency = await eduProgsStore.addCompetencyToEduprog(+route.params.id, competencyId)
    selectedZkCompetencies.value.push(newCompetency)
  } else if (!e) {
    allSelect.value = false
    const obj = selectedZkCompetencies.value.find(item => item.competency_id === competencyId)
    selectedZkCompetencies.value = selectedZkCompetencies.value.filter(comp => comp.id != obj.id)
    await eduProgsStore.deleteCompetencyInEduprog(obj.id)
  }
  allSelect.value = hasAllSelected()
}

//Function for add all competencies or delete
const selectAll = async (event, type) => {
  if (event) {
    await eduProgsStore.addAllCompetencies(route.params.id, "ZK")
    for (let key in zkCompetenciesValue) {
      zkCompetenciesValue[key] = true
    }
    await eduProgsStore.fetchSelectedCompetencies(route.params.id,"ZK")
    selectedZkCompetencies.value = eduProgsStore.getSelectedCompetencies
  } else if (!event) {
    await eduProgsStore.deleteAllCompetencies(route.params.id, "ZK")
    for (let key in zkCompetenciesValue) {
      zkCompetenciesValue[key] = false
    }
  }
}

const hasAllSelected = () =>{
    for (let key in zkCompetenciesValue) {
      if(zkCompetenciesValue[key]===false){
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
              @update:modelValue="selectAll($event, 'ZK')"
            />
          </div>
        </th>
      </tr>
    </thead>
    <tbody >
      <tr
        v-for="item in zkCompetencies"
        :key="item.id"
      >
        <td
          class="py-3"
          style="text-align: center"
        >
          {{ "ЗК"+item.code }}
        </td>
        <td class="py-3">
          {{ item.definition }}
        </td>
        <td>
          <VRow justify="center">
            <VCheckbox
              v-model="zkCompetenciesValue[item.id]"
              @update:modelValue="changeCheckbox($event, item.id)"
            />
          </VRow>
        </td>
      </tr>
    </tbody>
  </VTable>
</template>


