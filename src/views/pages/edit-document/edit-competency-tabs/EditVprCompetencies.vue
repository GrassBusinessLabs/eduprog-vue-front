<script setup>
import router from '@/router'

import { useEduProgsStore } from '@/stores/eduProgs.js'
import { onBeforeMount, reactive } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const eduProgsStore = useEduProgsStore()
const editIndex = ref(null)

const vprCompetencies = ref([])
const creatingDialog = ref(false)
const newCompetency = reactive({
  eduprog_id: +route.params.pages,
  type: 'ВПР',
  definition: '',
})
onBeforeMount(async () => {
  await eduProgsStore.fetchSelectedCompetencies(route.params.pages, 'VPR')
  vprCompetencies.value = eduProgsStore.getSelectedCompetencies
})
const createCompetency = async () => {
  const newCompetencyData = await eduProgsStore.addCustomCompetency(newCompetency)
  vprCompetencies.value.push(newCompetencyData)
  creatingDialog.value = false
  newCompetency.definition=""
}
const deleteCompetency = async id => {
  await eduProgsStore.deleteCompetencyInEduprog(id)
  await eduProgsStore.fetchSelectedCompetencies(route.params.pages, 'VPR')
  vprCompetencies.value = eduProgsStore.getSelectedCompetencies
}
const saveChanges = async competency => {
  await eduProgsStore.editCustomCompetency(competency.id, competency.definition)
  editIndex.value = null
}
let originValue={}
function edit(item) {
  originValue= Object.assign({}, item)
  editIndex.value = item.id
}

function cancel(item) {
  editIndex.value = null
  for(let key in item){
    item[key]=originValue[key]
  }
  originValue={}
}
</script>
<template>
  <VTable>
    <thead class="thead-light">
      <tr>
        <th class="text-center">
          <h3>Передбачені закладом вищої освіти компетентності</h3>
        </th>
      </tr>
    </thead>
  </VTable>
  <VTable>
    <thead class="thead-light">
      <tr>
        <th style="text-align: center; width: 10%">Код</th>
        <th style="text-align: center">Опис</th>
        <th style="text-align: center; width: 20%">
          <VBtn
            icon="mdi-plus"
            size="x-small"
            @click=";(creatingDialog = true), (newCompetency.type = 'ВПР')"
          />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in vprCompetencies"
        :key="item.id"
      >
        <td
          class="py-3"
          style="text-align: center"
        >
          {{ 'ВПР' + item.code }}
        </td>
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
                @click="cancel(item)"
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
                @click="edit(item)"
              />
            </VCol>
            <VCol>
              <VBtn
                icon="mdi-trash-can"
                size="x-small"
                @click="deleteCompetency(item.id)"
              />
            </VCol>
          </VRow>
        </td>
      </tr>
    </tbody>
  </VTable>
  <VDialog
    v-model="creatingDialog"
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
            @click="creatingDialog = false"
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
