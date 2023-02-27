<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { reactive } from 'vue'
const eduProgsStore = useEduProgsStore()
const components = eduProgsStore.getEduProg.components

const mandatoryComponents = reactive(components.mandatory.map(component => ({
  ...component,
  items: [], // добавляем пустой массив items для каждого компонента
})))

const allComponents = ref(components.mandatory)

// вычисляемое свойство для связывания v-combobox с соответствующим массивом items
const getItems = component => computed({
  get: () => component.items,
  set: value => component.items = value,
})
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
        v-for="(component) in mandatoryComponents"
        :key="component.id"
      >
        >
        <td>{{ 'ОК ' + component.code }}</td>
        <td>
          <span>{{ component.name }}</span>
        </td> 
        <td rowspan="1">
          <VCombobox
            v-model="getItems(component).value"
            :items="allComponents.name"
            multiple
            chips
            small-chips
            class="ma-0"
            style="max-width:500px"
          />
        </td>    
      </tr>
    </tbody>
  </VTable>
</template>

