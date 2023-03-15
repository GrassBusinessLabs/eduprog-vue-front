<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { reactive } from 'vue'
const props = defineProps(['eduProg'])
const route = useRoute()
import { useRoute } from 'vue-router'
const eduProgsStore = useEduProgsStore()
const allRelations = ref([])
const allZkComp = ref([])
const allFkComp = ref([])
const selectedCompetencies =ref([])
const valueComp = ref([])
const map = new Map()
const allSelect = ref(false)
const dialogSpecialComp =ref(false)
const newCompetency=reactive({
  eduprog_id: +route.params.id,
  type:"",
  redefinition:""
})
const createCompetency = async() =>{
  await eduProgsStore.addCustomCompetency(newCompetency)
  newCompetency.redefinition=""
  dialogSpecialComp.value=false
}
onBeforeMount(async () => {
  await eduProgsStore.fetchCompetencies(route.params.id)
  await eduProgsStore.fetchCompetencyRelations(route.params.id)
  await eduProgsStore.fetchZkCompetencies(route.params.id)
  await eduProgsStore.fetchFkCompetencies(route.params.id)
  selectedCompetencies.value = eduProgsStore.getCompetencies
  allZkComp.value = eduProgsStore.getCompetenciesZk
  allFkComp.value = eduProgsStore. getCompetenciesFk
  allRelations.value = allZkComp.value.concat(allFkComp.value)
  allRelations.value.forEach(obj =>{
    obj.competency_id=obj.id
  })
  for (const item of  selectedCompetencies.value) {
    map.set(item.competency_id, true)
  }
  for (const item of allRelations.value) {
    valueComp.value.push(map.has(item.competency_id))
  }
  valueComp.value = Object.entries(valueComp.value).reduce((acc, [key, value], index) => {
    acc[index + 1] = value
    return acc
  }, {})
})


const changeCheckbox = async (e, competencyId) => {
  if (e) {
    const newCompetency = await eduProgsStore.addCompetencyToEduprog(+route.params.id, competencyId)
    selectedCompetencies.value.push(newCompetency)
  } else if (!e) {
    allSelect.value = false
    const obj = selectedCompetencies.value.find(item => item.competency_id === competencyId)
    selectedCompetencies.value = selectedCompetencies.value.filter(comp => comp.id != obj.id)
    await eduProgsStore.deleteCompetencyInEduprog(obj.id)
  }
}
const changeObjectValues = async (obj, start, end, value) => {
  for (let id = start; id <= end; id++) {
    if (!obj[id] && value) {
      await eduProgsStore.addCompetencyToEduprog(+route.params.id, id)
    } else if (obj[id] && !value) {
      console.log('удалем', id)
      const deleted = selectedCompetencies.value.find(item => item.competency_id === id)
      await eduProgsStore.deleteCompetencyInEduprog(deleted.id)
    }
    obj[id] = value
  }
}

const selectAll = async (event, type) => {
  let firstCompetencyId, lastCompetencyId
  switch (type) {
    case 'ZK':
      firstCompetencyId = allZkComp.value[0].id
      lastCompetencyId = allZkComp.value[allZkComp.value.length - 1].id
      if (event) {
        await changeObjectValues(valueComp.value, firstCompetencyId, lastCompetencyId, true)
      } else if (!event) {
        await changeObjectValues(valueComp.value, firstCompetencyId, lastCompetencyId, false)
      }
    case 'FK':
      firstCompetencyId = allFkComp.value[0].id
      lastCompetencyId = allFkComp.value[allFkComp.value.length - 1].id
  }
  await eduProgsStore.fetchCompetencies(route.params.id)
  selectedCompetencies.value = eduProgsStore.getCompetencies
  console.log(selectedCompetencies.value)
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
        <th style="text-align: center">Опис</th>
        <th style="text-align: center; width: 20%">
          <VRow
            justify="center"
            no-gutters
            align="center"
          >
            <VCol> Обрати все </VCol>
            <VCol>
              <VCheckbox
                v-model="allSelect"
                @update:modelValue="selectAll($event, 'ZK')"
              />
            </VCol>
          </VRow>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in allZkComp"
        :key="item.id"
      >
        <td class="py-3">
          {{ item.definition }}
        </td>
        <td>
          <VRow justify="center">
            <VCheckbox
              v-model="valueComp[item.competency_id]"
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
        v-for="item in allFkComp"
        :key="item.id"
      >
        <td class="py-3">
          {{ item.definition }}
        </td>
        <td>
          <VRow justify="center">
            <VCheckbox
              v-model="valueComp[item.competency_id]"
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
          <h3>Спеціальні передбачені закладом вищої освіти компетентності</h3>
        </th>
      </tr>
    </thead>
  </VTable>
  <VTable>
    <thead class="thead-light">
      <tr>
        <th style="text-align: center">Опис</th>
        <th style="text-align: center; width: 20%">
          <VBtn
            icon="mdi-plus"
            size="x-small"
            @click="dialogSpecialComp = true, newCompetency.type='ВФК'"
          />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in allFkComp"
        :key="item.id"
      >
        <td class="py-3">
          {{ item.definition }}
        </td>
        <td >
          <VRow no-gutters  justify="center" >
            <VCol align="end">
            <VBtn
              icon="mdi-pencil"
              size="x-small"
              style="margin-right: 2%"
              @click="editIndex = item.id"
            />
            </VCol>
            <VCol>
            <VBtn
              icon="mdi-trash-can"
              size="x-small"
              @click="remove(item, 'selective')"
            />
            </VCol>
          </VRow>
        </td>
      </tr>
    </tbody>
  </VTable>
  <VDialog
    v-model="dialogSpecialComp"
    persistent
    max-width="600"
  >
    <VCard>
      <VCardTitle>Створити нову компетентність</VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol>
              <VTextField
                label="Опис компетентності"
                required
                v-model="newCompetency.redefinition"
              />
            </VCol>
          </VRow>
        </VContainer>

        <VCardActions>
          <VSpacer />
          <VBtn
            text
            @click="dialogSpecialComp=false"
          >
            Відмінити
          </VBtn>
          <VBtn
            text
            @click="createCompetency"
          >
            Створити
          </VBtn>
        </VCardActions>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style></style>
