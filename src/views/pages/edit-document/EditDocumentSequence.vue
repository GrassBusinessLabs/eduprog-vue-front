<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { reactive } from 'vue'
const eduProgsStore = useEduProgsStore()
const components = eduProgsStore.getEduProg.components

const prost = ['Філософія','Математика','qwewqewqeqw','ewqeqwewq']
const items = ref([])

const mandatoryComponents = reactive(components.mandatory)
console.log("mandatoryComponents",mandatoryComponents)
console.log("components.mandatory",components.mandatory)
</script>

<template>
  <VTable>
    <thead class="thead-light">
    <tr>
      <th class="text-center">
        Назва документу
      </th>
    </tr>
  </thead>
  </VTable>
  <VTable>
    <thead class="thead-light">
      <tr>
        <th>Код н/д</th>
        <th>Назва КОП</th>
        <th>Залежності</th>     
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item) in mandatoryComponents"
        :key="item.id"
      >
      <td>{{ 'ОК ' + item.code }}</td>
        <td >
          <span>{{ item.name }}</span>
         </td> 
         <td>
          <VContainer>
                <v-combobox
                  v-model="items"
                  :items="prost"
                  multiple
                  style='width: 300px'
                ></v-combobox>
          </VContainer>
         </td>    
    </tr>
    </tbody>
  </VTable>
</template>

