<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'

import { reactive } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const eduProgsStore = useEduProgsStore()
const components = eduProgsStore.getEduProg.components

console.log('dfgdfgdf',components)
const editIndex = ref(null)
const generalCompetencies = ref([
  {
    id:1,
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
</script>

<template>
  <VRow>
    <VCol>
      <VTable>
        <thead>
          <tr>
            <th
              rowspan="2"
              class="text-center"
            />
          </tr>

          <tr>
            <th
              v-for="item in generalCompetencies"
              :key="item.id"
            >
              <div style="text-align: center">
                <span v-if="editIndex !== item.id">{{ 'ЗК' + item.id }}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in generalCompetencies"
            :key="item.id"
          >
            <td>
              <div style="text-align: center">
                <span v-if="editIndex !== item.id">{{ 'ЗК' + item.id }}</span>
              </div>
            </td>
            <td />
          </tr>
        </tbody>
      </VTable>
    </VCol>
  </VRow>
</template>

