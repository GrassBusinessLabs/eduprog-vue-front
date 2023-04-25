<script setup>
import { v4 as uuidv4 } from "uuid"
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import Gridstack from '@core/components/Gridstack.vue'

const route = useRoute()
const disciplines = ref([])
const eduprogComponents = ref([])

const eduProgsStore = useEduProgsStore()
const { components } = storeToRefs(eduProgsStore)
const scheme = ref([])

const eduprogId = route.params.pages

const editIndex = ref(null)
const originalData = ref(null)

const changes = reactive({
  subjects: [],
  semester: '',
  discipline: '',
})

const enabled = ref(true)

const items = ref({})

const childComponentRef = ref(null)

function logger(evt) {
  console.log(evt)
}

onMounted(async () => {
  // Get disciplines
  await eduProgsStore.fetchDisciplines(eduprogId)
  disciplines.value = eduProgsStore.getDisciplines
  initGridItems() // TODO - delete this func

  // Get eduprog components
  await eduProgsStore.fetchComponents(eduprogId)
  eduprogComponents.value = eduProgsStore.components

  // Get components scheme
  await eduProgsStore.fetchScheme(eduprogId)
  scheme.value = eduProgsStore.scheme

  // initGrid()
  console.log('sscheme: ', scheme.value)
})

function initGrid() {
  scheme.value.map(item => {
    items.value[item.discipline_id].push({
      w: 1,
      x: item.semester_num,
      id: uuidv4(),
      eduprogcomp: item.eduprogcomp,
    })
  })
}
function initGridItems() {
   console.log("ДИСЦИПЛИНЫ",disciplines.value)
  disciplines.value.map(item => {
    Object.defineProperty(items.value, item.id, {
      value: [{
        w: Math.round(Math.random()),
        id: uuidv4(),
      }],
      writable: true,
    })
  })
  console.log("ДИСЦИПЛИНЫ",disciplines.value)
}

function addEmptyWidget(discipline, index) {
  const node = {
    w: Math.round(Math.random()),
    id: uuidv4(),
  }
  if (childComponentRef.value[index].isAreaEmpty()) {
    items.value[discipline.id].push(node)
    childComponentRef.value[index].createWidget(node.id)
  }
}

function saveChanges() {
  childComponentRef.value.map(item => {
    console.log(item.getGridNodes())
  })
}
async function deleteDiscipline(id) {

  await eduProgsStore.deleteDiscipline(id)
  await eduProgsStore.fetchDisciplines(route.params.pages)
  disciplines.value = eduProgsStore.getDisciplines
}

async function deleteComponent(event, element) {
  await eduProgsStore.deleteComponentFromSheme(element.id)
  await eduProgsStore.fetchScheme(route.params.pages)
}

function edit(item) {
  editIndex.value = item.id
}

function cancel(item) {
  editIndex.value = null
  Object.assign(item, originalData.value)
  originalData.value = null
}

function save(item) {
  originalData.value = null
  editIndex.value = null
  eduProgsStore.editDiscipline(item)
}

const createDiscipline = function dialogg() {
  dialogCreate.value = true
}
const dialogCreate = ref(false)
const newDiscipline = reactive({
  name: '',
  eduprog_id: +route.params.pages,
})

async function createNewDiscipline() {
  await eduProgsStore.createDiscipline(newDiscipline)
  await eduProgsStore.fetchDisciplines(route.params.pages)
  newDiscipline.name = ''
  disciplines.value = eduProgsStore.getDisciplines
  dialogCreate.value = false
  initGridItems()
}

function cancelNewDiscipline() {
  newDiscipline.name = ''
  dialogCreate.value = false
}

function deleteItem(event) {
  console.log(event)
}
</script>

<template>
  <VDialog
    v-model="dialogCreate"
    persistent
    max-width="600px"
  >
    <VCard>
      <VCardTitle>
        <span class="text-h5">Створення нової ОПП</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol
              cols="12"
            >
              <VTextField
                v-model="newDiscipline.name"
                label="Назва дисципліни "
                required
              />
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="blue darken-1"
          text
          @click="cancelNewDiscipline"
        >
          Закрити
        </VBtn>
        <VBtn
          text
          :disabled="!newDiscipline.name"
          @click="createNewDiscipline"
        >
          Створити
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VRow>
    <VCol cols="12">
      <VCard
        title="Всі предмети"
        class="mb-5"
      >
        <VCardText cols="12" />
      </VCard>
    </VCol>
    <VCol>
      <VTable>
        <thead>
          <tr>
            <th
              rowspan="2"
              class="text-center"
            >
              <p>Дисципліни</p>
              <VBtn
                icon="mdi-plus"
                size="x-small"
                @click="createDiscipline"
              />
            </th>
            <th
              colspan="2"
              class="text-center"
            >
              1 курс
            </th>
            <th
              colspan="2"
              class="text-center"
            >
              2 курс
            </th>
            <th
              colspan="2"
              class="text-center"
            >
              3 курс
            </th>
            <th
              colspan="2"
              class="text-center"
            >
              4 курс
            </th>
          </tr>

          <tr>
            <th class="text-center">
              1 семестр
            </th>
            <th class="text-center">
              2 семестр
            </th>
            <th class="text-center">
              3 семестр
            </th>
            <th class="text-center">
              4 семестр
            </th>
            <th class="text-center">
              5 семестр
            </th>
            <th class="text-center">
              6 семестр
            </th>
            <th class="text-center">
              7 семестр
            </th>
            <th class="text-center">
              8 семестр
            </th>
          </tr>
        </thead>
      </VTable>

      <div style="width: 100%">
        <div
          v-for="(item, index) in disciplines"
          :key="item.id"
          class="discipline-block"
        >
          <div style="width: 12%">
            <div style="text-align: center">
              <span v-if="editIndex !== item.id">{{ item.name }}</span>
              <span v-if="editIndex === item.id">
                <VTextField
                  v-model="item.name"
                  class="my-3"
                />
              </span>
            </div>
            <div style="text-align: center; margin-top: 5%; margin-bottom: 5%">
              <span v-if="editIndex !== item.id">
                <div>
                  <VBtn
                    icon="mdi-pencil"
                    size="x-small"
                    style="margin-right:2% "
                    @click="edit(item)"
                  />
                  <VBtn
                    icon="mdi-trash-can"
                    size="x-small"
                    @click="deleteDiscipline(item.id)"
                  />
                </div>
                <VBtn
                  icon="mdi-plus"
                  size="x-small"
                  @click="addEmptyWidget(item, index)"
                />
              </span>
              <span v-else>
                <VBtn
                  icon="mdi-check-bold"
                  size="x-small"
                  style="margin-right:2% "
                  @click="save(item)"
                />
                <VBtn
                  icon="mdi-close-thick"
                  size="x-small"
                  @click="cancel(item)"
                />
              </span>
            </div>
          </div>
          <div style="width: 100%">
            <Gridstack
              ref="childComponentRef"
              :grid-items="items[item.id]"
              :components="eduprogComponents"
              @added="logger"
              @dragstart="logger"
              @resizestop="logger"
              @delete="deleteItem"
            />
          </div>
        </div>
      </div>
    </VCol>
    <VCol cols="12">
      <VBtn
        class="mr-2"
        type="reset"
        color="secondary"
        variant="tonal"
      >
        Скинути
      </VBtn>
      <VBtn
        dark
        @click="saveChanges"
      >
        Зберегти зміни
      </VBtn>
    </VCol>
  </VRow>
</template>


<style scoped>
.discipline-block {
  display: flex;
  background: #fff;
  width: 100%;
}
</style>

<route lang='yaml'>
name: schema
meta:
navActiveLink: pages-account-settings-tab
requiresAuth: true
test: true
</route>
