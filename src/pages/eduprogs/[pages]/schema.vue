<script setup>
import { v4 as uuidv4 } from 'uuid'
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import Gridstack from '@core/components/Gridstack.vue'
import GridstackForComponents from '@core/components/GridstackForComponents.vue'

const searchTerm = ref('')
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

let items = reactive([])

const childComponentRef = ref(null)
const childFreeCompRef = ref(null)

const freeCompSheme = ref()
const FreeCompItems = ref([])


const credits_semestr = ref({
  discipline_id: '',
  row: '',
  semester_num: '',
  eduprog_id: '',
  eduprogcomp_id: '',
  credits_per_semester: '',
})

const free_comp_id = ref()
const del_index = ref()
const last_ID = ref()

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

  await eduProgsStore.fetchFreeCompSheme(eduprogId)
  freeCompSheme.value = eduProgsStore.freeCompSheme

  console.log('SHEMA',scheme.value)

  initCopmGrid()

  initGrid()
})

function lastID(evt) {
  last_ID.value = evt.itemId
}

async function logger(evt) {
  console.log(evt)
  if (evt[0].type === 'dropped') {
    const result = FreeCompItems.value.find(item => item.id === evt[2].id)

    if (result === undefined) {
      const component = items[last_ID.value].find(item => item.id === evt[2].id)

      credits_semestr.value.discipline_id = evt.itemId,
      credits_semestr.value.row = evt[2].y + 1,
      credits_semestr.value.semester_num = evt[2].x + 1,
      credits_semestr.value.eduprog_id = Number(eduprogId),
      credits_semestr.value.eduprogcomp_id = component.eduprogcomp_id,
      credits_semestr.value.credits_per_semester = component.eduprogcomp.credits

      updateComponent()
    } else if (result !== undefined) {
      credits_semestr.value.discipline_id = evt.itemId,
      credits_semestr.value.row = evt[2].y + 1,
      credits_semestr.value.semester_num = evt[2].x + 1,
      credits_semestr.value.eduprog_id = Number(eduprogId),
      credits_semestr.value.eduprogcomp_id = result.eduprogcomp_id,
      credits_semestr.value.credits_per_semester = result.free_credit
      free_comp_id.value = evt[2]
      del_index.value = disciplines.value.findIndex(item => item.id === evt.itemId)

      await createCompToSheme()
    }
  }
  else if (evt[0].type === 'change') {
    console.log('Безобразие',evt)

    console.log(items)
    console.log(FreeCompItems.value)

    const arr = evt[1]
    console.log(arr)
    console.log(evt.itemId)
    console.log(last_ID.value)


    arr.forEach(obj => {
      const component = items[evt.itemId].find(item => item.id === obj.id)
      console.log(component)
      console.log(obj)

      // console.log(component['id'+component.w])
      console.log(component.id1)

      const moveComp = {
        discipline_id: evt.itemId,
        semester_num: obj.x + 1,
        row: obj.y + 1,
      }

      updateComponent(component.id1, moveComp)
    })
  }
  else if (evt[0].type === 'resizestop') {
    console.log('NO Безобразие',evt)
    console.log(evt.itemId)
    console.log(evt[1].gridstackNode)
    const component = items[evt.itemId].find(item => item.id === evt[1].gridstackNode.id)
    console.log(component)
    console.log(evt[1].gridstackNode.w > 1)
    console.log(evt[1].gridstackNode.w < component.w)
    if (evt[1].gridstackNode.w > component.w ){

      const n = evt[1].gridstackNode.w - component.w

      for (let i = 0; i < n; i++){
        await eduProgsStore.expandSchemecomp(component.id1)
      }
      removeObjectById(items[component.disc_id], component.id)

    } else if (evt[1].gridstackNode.w < component.w){

      const n = component.w -evt[1].gridstackNode.w

      for (let i = 0; i < n; i++){
        await eduProgsStore.shrinkSchemecomp(component.id1)
      }

      removeObjectById(items[component.disc_id], component.id)

    }
  }
  await eduProgsStore.fetchScheme(route.params.pages)
  scheme.value = eduProgsStore.scheme
  initGrid()
  childFreeCompRef.value.updateGridComp()
}





async function updateComponent(id, moveComp) {
  console.log(moveComp)
  console.log(id)

  await eduProgsStore.moveComponentInScheme(id, moveComp)

  childFreeCompRef.value.updateGridComp()
}

function initCopmGrid() {
  freeCompSheme.value.forEach((item, index) => {
    const existingWidget = FreeCompItems.value.find(widget => widget.eduprogcomp_id === item.id)
    if (existingWidget) {
      // Обновление свойств существующего элемента
      existingWidget.free_credit = item.free_credits
      existingWidget.name = item.name
    } else {
      // Добавление нового элемента в массив
      const widget = {
        w: 0,
        x: 0,
        y: 0,
        id: uuidv4(),
        free_credit: item.free_credits,
        eduprogcomp_id: item.id,
        name: item.name,
      }
      FreeCompItems.value.push(widget)
    }
  })
  console.log(FreeCompItems.value)
  console.log(childFreeCompRef.value)
  FreeCompItems.value.forEach((item, index) => childFreeCompRef.value.createFreeWidget())
}
const newScheme = ref()

function initGrid() {
  newScheme.value = groupByEduprogcompId()
  newScheme.value.forEach(item => {
    const widgetIndex = items[item.items[0].discipline_id].findIndex(w =>  w.eduprogcomp.id === item.eduprogcomp_id)
    if (widgetIndex === -1) {
      console.log(item)
      const widget = {
        w: item.items.length,
        x: item.items[0].semester_num - 1,
        y: item.items[0].row - 1,
        h: 1,
        id: uuidv4(),
        eduprogcomp: item.items[0].eduprogcomp,
        disc_id: item.items[0].discipline_id,
      }
      console.log(widget)
      addExtractedFieldsToObject(item.items, fields, widget)
      items[item.items[0].discipline_id].unshift(widget)
      disciplines.value.forEach((item, index) => childComponentRef.value[index].createWidget)
    }
  })
}

const fields = ["credits_per_semester", "id"]

function addExtractedFieldsToObject(array, fields, targetObject) {
  array.forEach((obj, index) => {
    const extractedFields = {}
    fields.forEach(field => {
      extractedFields[`${field}${index + 1}`] = obj[field]
    })
    Object.assign(targetObject, extractedFields)
  })
  
  return targetObject
}

function groupByEduprogcompId() {
  const groupedObjects = {}

  for (const obj of scheme.value) {
    const { eduprogcomp_id, ...rest } = obj

    if (!groupedObjects[eduprogcomp_id]) {
      groupedObjects[eduprogcomp_id] = {
        eduprogcomp_id,
        items: [rest],
      }
    } else {
      groupedObjects[eduprogcomp_id].items.push(rest)
    }
  }

  return Object.values(groupedObjects)
}



function initGridItems() {
  disciplines.value.map((item, index) => {
    Object.defineProperty(items, item.id, {
      value: [],
      writable: true,
    })
    Object.defineProperty(items, item.index, {
      value: index,
      writable: true,
    })
  })
  console.log(disciplines.value)
}
async function deleteDiscipline(id) {
  await eduProgsStore.deleteDiscipline(id)
  await eduProgsStore.fetchDisciplines(route.params.pages)

  await eduProgsStore.fetchScheme(eduprogId)
  scheme.value = eduProgsStore.scheme

  await eduProgsStore.fetchFreeCompSheme(eduprogId)
  freeCompSheme.value = eduProgsStore.freeCompSheme

  disciplines.value = eduProgsStore.getDisciplines

  // items.splice(id, 1)

  initGrid()
  initCopmGrid()
}

async function deleteComponent(component) {
  console.log(component)

  if (component.id1 === undefined || null || 0) {
  } else {
    await eduProgsStore.deleteComponentFromSheme(component.id1)
    await eduProgsStore.fetchScheme(route.params.pages)
    await eduProgsStore.fetchFreeCompSheme(eduprogId)
    freeCompSheme.value = eduProgsStore.freeCompSheme
    scheme.value = eduProgsStore.scheme

    removeObjectById(items[component.disc_id], component.id)

    console.log(FreeCompItems.value)
    console.log(component.eduprogcomp_id)
    console.log(items[component.disc_id])
    console.log('items[component.disc_id]', items[component.disc_id])
    console.log('items', items)
    console.log(component)

    initCopmGrid()
    initGrid()
  }
}

async function createCompToSheme() {
  console.log('credits_semestr', credits_semestr.value)
  console.log(free_comp_id.value)

  console.log(credits_semestr.value)

  await eduProgsStore.setComponentToScheme(credits_semestr.value)

  await eduProgsStore.fetchFreeCompSheme(eduprogId)
  freeCompSheme.value = eduProgsStore.freeCompSheme

  await eduProgsStore.fetchScheme(eduprogId)
  scheme.value = eduProgsStore.scheme
  console.log('childComponentRef.value', childComponentRef.value)
  childComponentRef.value[del_index.value].deleteGridComponent(free_comp_id.value)
  console.log(FreeCompItems.value)

  removeObjectById(FreeCompItems.value, free_comp_id.value.id)

  console.log(FreeCompItems.value)
  childFreeCompRef.value.updateGridComp()
  initGrid()
  initCopmGrid()
}

function removeObjectById(arr, id) {
  const index = arr.findIndex(obj => obj.id === id)
  if (index > -1) {
    arr.splice(index, 1)
  }
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

  disciplines.value.forEach((item,index) => items[item.id] = items[item.id] || [])
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
        <span class="text-h5">Створення нової Категорії</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="newDiscipline.name"
                label="Назва категорії "
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
          @keyup.enter="createNewDiscipline"
        >
          Створити
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <VRow>
    <VCol cols="2">
      <VCard
        title="Всі предмети"
        class="mb-5"
        style="max-width: 200px"
      >
        <VTextField
          v-model="searchTerm"
          style="margin: 5%; margin-top: -5%"
          append-icon="mdi-magnify"
          label="Пошук"
          single-line
          hide-details
          variant="underlined"
        />

        <GridstackForComponents
          ref="childFreeCompRef"
          :search-term="searchTerm"
          :components="FreeCompItems"
        />
      </VCard>
    </VCol>
    <VCol cols="10">
      <VTable>
        <thead>
          <tr>
            <th
              rowspan="2"
              class="text-center"
            >
              <p>Категорії</p>
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
          v-for="item in disciplines"
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
                <div style="margin-bottom: 2%">
                  <VBtn
                    icon="mdi-pencil"
                    size="x-small"
                    style="margin-right: 2%"
                    @click="edit(item)"
                  />
                  <VBtn
                    icon="mdi-trash-can"
                    size="x-small"
                    @click="deleteDiscipline(item.id)"
                  />
                </div>
              </span>
              <span v-else>
                <VBtn
                  icon="mdi-check-bold"
                  size="x-small"
                  style="margin-right: 2%"
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
              gs-current-row="item.rows"
              :grid-items="items[item.id]"
              :components="eduprogComponents"
              @added="logger"
              @resizestop="event => logger({ ...event, itemId: item.id })"
              @dropped="event => logger({ ...event, itemId: item.id })"
              @dragstart="event => lastID({ ...event, itemId: item.id })"
              @dragstop="event => logger({ ...event, itemId: item.id })"
              @change="event => logger({ ...event, itemId: item.id })"
              @delete="deleteItem"
              @delComp="deleteComponent"
              @createComp="createCompToSheme"
            />
            <hr style="transform: scaleY(0.3)">
          </div>
        </div>
      </div>
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

<route lang="yaml">
name: schema
meta:
navActiveLink: pages-account-settings-tab
requiresAuth: true
test: true
</route>
