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
const selectedCompetencies = ref([])
const valueComp = ref([])
const allVfkComp = ref([])
const map = new Map()
const allSelect = ref(false)
const dialogSpecialComp = ref(false)
const newCompetency = reactive({
  eduprog_id: +route.params.id,
  type: '',
  definition: '',
})
const editIndex = ref(null)
const createCompetency = async () => {
  await eduProgsStore.addCustomCompetency(newCompetency)
  newCompetency.definition = ''
  dialogSpecialComp.value = false
  await eduProgsStore.fetchVfkCompetencies(route.params.id)
  allVfkComp.value = eduProgsStore.getCompetenciesVfk
}
const deleteCustomCompetency = async id => {
  await eduProgsStore.deleteCompetencyInEduprog(id)
  await eduProgsStore.fetchVfkCompetencies(route.params.id)
  allVfkComp.value = eduProgsStore.getCompetenciesVfk
}
const saveChanges = async competency => {
  await eduProgsStore.editCustomCompetency(competency.id, competency.definition)
  editIndex.value = null
}

const selectedZkCompetencies = ref([])
const allZkCompetencies = ref([])
const ZkCompetencies = reactive({})
onBeforeMount(async () => {
  await eduProgsStore.fetchAllCompetencies(route.params.id)
  await eduProgsStore.fetchCompetencyRelations(route.params.id)
  await eduProgsStore.fetchZkCompetencies(route.params.id)
  await eduProgsStore.fetchFkCompetencies(route.params.id)
  await eduProgsStore.fetchVfkCompetencies(route.params.id)

  selectedCompetencies.value = eduProgsStore.getCompetencies
  allZkComp.value = eduProgsStore.getCompetenciesZk
  allFkComp.value = eduProgsStore.getCompetenciesFk
  allVfkComp.value = eduProgsStore.getCompetenciesVfk
  allRelations.value = allZkComp.value.concat(allFkComp.value)
  allRelations.value.forEach(obj => {
    obj.competency_id = obj.id
  })
  for (const item of selectedCompetencies.value) {
    map.set(item.competency_id, true)
  }
  for (const item of allRelations.value) {
    valueComp.value.push(map.has(item.competency_id))
  }
  valueComp.value = Object.entries(valueComp.value).reduce((acc, [key, value], index) => {
    acc[index + 1] = value
    return acc
  }, {})
  console.log(allRelations.value)

  //new code
  selectedZkCompetencies.value = await eduProgsStore.fetchSelectedCompetencies(route.params.id, 'ZK')
  allZkCompetencies.value = await eduProgsStore.fetchCompetencies('ZK')
  console.log('Селектед', selectedZkCompetencies.value)
  console.log('все', allZkCompetencies.value)
  for (let key in allZkCompetencies.value) {
    if (selectedZkCompetencies.value.find(item => item.competency_id === allZkCompetencies.value[key].id)) {
      const zkCompetency = selectedZkCompetencies.value.find(
        item => item.competency_id === allZkCompetencies.value[key].id,
      )
      zkCompetency.value = true
      ZkCompetencies[zkCompetency.competency_id] = zkCompetency
    } else {
      const zkCompetency = allZkCompetencies.value[key]
      zkCompetency.value = false
      ZkCompetencies[allZkCompetencies.value[key].id] = zkCompetency
    }
  }
  console.log(ZkCompetencies)
  console.log('Все ЗК', allZkComp.value)
  console.log('', valueComp.value)
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
const selectAll = async (event, type) => {
  if (event) {
    await eduProgsStore.addAllCompetencies(route.params.id, type)
    for (let key in valueComp.value) {
      valueComp.value[key] = true
    }
  } else if (!event) {
    await eduProgsStore.deleteAllCompetencies(route.params.id, type)
    for (let key in valueComp.value) {
      valueComp.value[key] = false
    }
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
    <tbody>
      <tr
        v-for="item in allZkComp"
        :key="item.id"
      >
        <td
          class="py-3"
          style="text-align: center"
        >
          {{ item.code }}
        </td>
        <td class="py-3">
          {{ item.definition }}
        </td>
        <td>
          <VRow justify="center">
            <VCheckbox
              v-model="valueComp[item.competency_id]"
              @update:modelValue="changeCheckbox($event, item.competency_id)"
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
        <th style="text-align: center">Опис</th>
        <th style="text-align: center">Вибрано</th>
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
              v-model="ZkCompetencies[item.competency_id]"
              @update:modelValue="changeCheckbox($event, item.competency_id)"
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
            @click=";(dialogSpecialComp = true), (newCompetency.type = 'ВФК')"
          />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in allVfkComp"
        :key="item.id"
      >
        <td class="py-3">
          <span v-if="editIndex === item.id">
            <VTextField
              class="my-3"
              v-model="item.definition"
            />
          </span>
          <span v-else>
            {{ item.definition }}
          </span>
        </td>
        <td>
          <VRow
            no-gutters
            justify="center"
            v-if="editIndex === item.id"
          >
            <VCol align="end">
              <VBtn
                icon="mdi-check-bold"
                size="x-small"
                style="margin-right: 2%"
                @click="saveChanges(item)"
              />
            </VCol>
            <VCol>
              <VBtn
                icon="mdi-close-thick"
                size="x-small"
                @click="editIndex = null"
              />
            </VCol>
          </VRow>
          <VRow
            no-gutters
            justify="center"
            v-else
          >
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
                @click="deleteCustomCompetency(item.id)"
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
                v-model="newCompetency.definition"
              />
            </VCol>
          </VRow>
        </VContainer>

        <VCardActions>
          <VSpacer />
          <VBtn
            text
            @click="dialogSpecialComp = false"
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
