<script setup>
import { v4 as uuidv4 } from 'uuid'
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import Gridstack from '@core/components/Gridstack.vue'
import GridstackForComponents from '@core/components/GridstackForComponents.vue'
import { it } from 'vuetify/locale'

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

const edu_id = ref()

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

  initCopmGrid()

  initGrid()
})

function lastID(evt) {
  last_ID.value = evt.itemId
}

function logger(evt) {
  if (evt[0].type === 'dropped') {
    const result = FreeCompItems.value.find(item => item.id === evt[2].id)

    if (result === undefined) {
      const component = items[last_ID.value].find(item => item.id === evt[2].id)

      ;(credits_semestr.value.discipline_id = evt.itemId),
        (credits_semestr.value.row = evt[2].y + 1),
        (credits_semestr.value.semester_num = evt[2].x + 1),
        (credits_semestr.value.eduprog_id = Number(eduprogId)),
        (credits_semestr.value.eduprogcomp_id = component.eduprogcomp_id),
        (credits_semestr.value.credits_per_semester = component.eduprogcomp.credits)

      updateComponent()
    } else if (result !== undefined) {
      ;(credits_semestr.value.discipline_id = evt.itemId),
        (credits_semestr.value.row = evt[2].y + 1),
        (credits_semestr.value.semester_num = evt[2].x + 1),
        (credits_semestr.value.eduprog_id = Number(eduprogId)),
        (credits_semestr.value.eduprogcomp_id = result.eduprogcomp_id),
        (credits_semestr.value.credits_per_semester = result.free_credit)
      free_comp_id.value = evt[2]
      del_index.value = disciplines.value.findIndex(item => item.id === evt.itemId)

      createCompToSheme()
    }
  } else if (evt[0].type === 'change') {
    const arr = evt[1]

    arr.forEach(obj => {
      const component = items[last_ID.value].find(item => item.id === obj.id)

      edu_id.value = component.eduprogcomp_id
      ;(credits_semestr.value.discipline_id = evt.itemId),
        (credits_semestr.value.row = obj.y + 1),
        (credits_semestr.value.semester_num = obj.x + 1),
        (credits_semestr.value.eduprog_id = Number(eduprogId)),
        (credits_semestr.value.eduprogcomp_id = component.eduprogcomp.id),
        (credits_semestr.value.credits_per_semester = component.eduprogcomp.credits)

      updateComponent()
    })
  }
}

async function updateComponent() {
  await eduProgsStore.UpdateComponentInScheme(edu_id.value, credits_semestr.value)
}

async function updateContent() {
  // Get eduprog components
  await eduProgsStore.fetchComponents(eduprogId)
  eduprogComponents.value = eduProgsStore.components

  // Get components scheme
  await eduProgsStore.fetchScheme(eduprogId)
  scheme.value = eduProgsStore.scheme

  initGrid()
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

function initGrid() {
  scheme.value.forEach(item => {
    const widgetIndex = items[item.discipline_id].findIndex(w => w.eduprogcomp_id === item.id)
    if (widgetIndex === -1) {
      const widget = {
        w: Math.round(Math.random()),
        x: item.semester_num - 1,
        y: item.row - 1,
        h: 1,
        id: uuidv4(),
        eduprogcomp: item.eduprogcomp,
        eduprogcomp_id: item.id,
        disc_id: item.discipline_id,
      }
      console.log(items)
      console.log(scheme.value)
      items[item.discipline_id].unshift(widget)
      disciplines.value.forEach((item, index) => childComponentRef.value[index].createWidget())
    }
  })
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

function addEmptyWidget(discipline, index) {
  const node = {
    w: Math.round(Math.random()),
    id: uuidv4(),
    disc_id: discipline.id,
  }
  if (childComponentRef.value[index].isAreaEmpty()) {
    items[discipline.id].push(node)
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

async function deleteComponent(component) {
  console.log(component)

  if (component.eduprogcomp_id === undefined || null || 0) {
  } else {
    await eduProgsStore.deleteComponentFromSheme(component.eduprogcomp_id)
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
  initGridItems()
  initGrid()
}

function cancelNewDiscipline() {
  newDiscipline.name = ''
  dialogCreate.value = false
}

function deleteItem(event) {
  console.log(event)
}

// const filteredData = computed(() => {

//   console.log(FreeCompItems.value)
//   if (!searchTerm.value) {
//     return FreeCompItems.value
//   }

//   return FreeCompItems.value.filter(item => {

//     return Object.values(item).some(value =>
//       String(value).toLowerCase().includes(searchTerm.value.toLowerCase()),
//     )
//   })
// })

// watch(filteredData, () => {
//   childFreeCompRef.value.updateGridComp()
// })
</script>

<template>
  <VDialog
    v-model="dialogCreate"
    persistent
    max-width="600px"
  >
    <VCard>
      <VCardTitle>
        <span class="text-h5">Створення нової Дисципліни</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol cols="12">
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
          :searchTerm="searchTerm"
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
            <th class="text-center">1 семестр</th>
            <th class="text-center">2 семестр</th>
            <th class="text-center">3 семестр</th>
            <th class="text-center">4 семестр</th>
            <th class="text-center">5 семестр</th>
            <th class="text-center">6 семестр</th>
            <th class="text-center">7 семестр</th>
            <th class="text-center">8 семестр</th>
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
              @resizestop="logger"
              @dropped="event => logger({ ...event, itemId: item.id })"
              @dragstart="event => lastID({ ...event, itemId: item.id })"
              @dragstop="event => logger({ ...event, itemId: item.id })"
              @change="event => logger({ ...event, itemId: item.id })"
              @delete="deleteItem"
              @delComp="deleteComponent"
              @createComp="createCompToSheme"
            />
            <hr style="transform: scaleY(0.3)" />
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
