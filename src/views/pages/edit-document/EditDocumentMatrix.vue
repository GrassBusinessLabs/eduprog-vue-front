<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'

import { reactive } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const eduProgsStore = useEduProgsStore()
const components = eduProgsStore.getEduProg.components

const editIndex = ref(null)
const generalCompetencies = ref([
  {
    id:7,
    description:'jkkfjgjl',
  },
  {
    id:2,
    description:'iogkkllv',
  },
  {
    id:3,
    description:'fjghjkhj',
  },
  {
    id:4,
    description:'jhjikljk',
  },
])
const selected = reactive({})
generalCompetencies.value.forEach(el => {
    selected[el.id] = reactive({})
    components.mandatory.forEach(comp => {
      selected[el.id][comp.id] = false
    })
})
console.log(selected)
</script>

<template>
<div></div><div></div><div></div><div></div><div></div>
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
                <span>{{ 'ОК' + component.code }}</span>
              </div>
            </th>
          </tr>
          <tr
            v-for="item in generalCompetencies"
            :key="item.id"
          >
            <td colspan="1">
              <div style="text-align: center">
                <span>{{ 'ЗК' + item.id }}</span>
              </div>
            </td>
            <td
              v-for=" component in components.mandatory "
              :key=" component.id"
            >
              <VCheckbox style="margin-left: 45%"
              v-model="selected[item.id][component.id]"/>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCol>
  </VRow>
</template>
<style scoped>
</style>
