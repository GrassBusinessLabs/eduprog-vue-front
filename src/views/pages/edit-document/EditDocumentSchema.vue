<script setup>
import draggable from 'vuedraggable'
import { useEduProgsStore } from '@/stores/eduProgs.js'

import { reactive } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const disciplines = ref([])
onBeforeMount(async () => {
  await eduProgsStore.fetchDisciplines(route.params.id)
  disciplines.value = eduProgsStore.getDisciplines
  initData()
})
const eduProgsStore = useEduProgsStore()
const components = eduProgsStore.getEduProg.components
const scheme = eduProgsStore.getScheme

const editIndex = ref(null)
const originalData = ref(null)
const semesters = ref([...Array(8).keys()])
const changes = reactive({
  subjects: [],
  semester: '',
  discipline: '',
})
const selected = reactive({})
const enabled = ref(true)
const dragging = ref(false)

async function deleteDiscipline(id) {
  await eduProgsStore.deleteDiscipline(id)
  await eduProgsStore.fetchDisciplines(route.params.id)
  disciplines.value = eduProgsStore.getDisciplines
}

function initData() {
  console.log('дисциплина', disciplines)
  disciplines.value.forEach(el => {
    selected[el] = [[], [], [], [], [], [], [], []]
  })
  Object.keys(selected).map(key => {
    selected[key].forEach((semester, index) => {
      selected[key][index].push(...getComponentByDiscipline(key, index + 1))
    })
  })
  console.log(selected)
}
function changeDragging() {
  dragging.value = !dragging.value
}
async function addNewComponent(event, discipline, semester) {
  console.log('Ивент', event)
  const componentData = event.item.__draggable_context.element
  const newComponent = {
    discipline: discipline,
    semester_num: semester + 1,
    eduprog_id: componentData.eduprog_id,
    eduprogcomp_id: componentData.id,
    credits_per_semester: 10,
  }
  console.log(componentData)
  console.log(newComponent)
  await eduProgsStore.setComponentToScheme(newComponent)
  await eduProgsStore.fetchScheme(route.params.id)
  console.log('Схема',  scheme)
  initData()
}
async function deleteComponent(event, element) {
  console.log(event, element)
  await eduProgsStore.deleteComponentFromSheme(element.id)
  await eduProgsStore.fetchScheme(route.params.id)
}

function edit(item, index) {
  originalData.value = Object.assign({}, item)
  editIndex.value = index
}
function cancel(item) {
  console.log("fdsfs")
}

function save(item) {
  originalData.value = null
  editIndex.value = null
}
function getComponentByDiscipline(discipline, semestr) {
  let array =  scheme.filter(e => {
    if (e.discipline === discipline && e.semester_num === semestr) {
      return e.eduprogcomp.name
    }
  })
  array.map(e => {
    e.name = e.eduprogcomp.name
  })
  console.log('Масив по дисицпление', array)

  return array
}
const getSubjectsD = ref([])

const getSubjects = computed(() => getSubjectsD.value.length)

// const getSubjects = computed(() => components.mandatory.concat(components.selective))

// function getSubjects() {
//   console.log("asdfsfgsf",components.mandatory.concat(components.selective))
//
//   return components.mandatory.concat(components.selective).value
// }

function handleSubject(event, semester, discipline) {
  changes.subjects = event
  changes.semester = semester + 1
  changes.discipline = discipline
}

const createDiscipline = function dialogg() {
  dialogCreate.value=true
}
const dialogCreate = ref(false)
const newDiscipline = reactive( {
  name:"",
  eduprog_id: +route.params.id,
})

async function createNewDiscipline() {
  await eduProgsStore.createDiscipline(newDiscipline)
   await eduProgsStore.fetchDisciplines(route.params.id)
  newDiscipline.name=''
  disciplines.value = eduProgsStore.getDisciplines
  dialogCreate.value=false
}
function cancelNewDiscipline() {
  newDiscipline.name=''
  dialogCreate.value=false
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
    <VCol cols="2">
      <VCard
        title="Всі предмети"
        class="mb-5"
      >
        <VCardText cols="12">
          <Draggable
            :list="getSubjects"
            :disabled="!enabled"
            item-key="name"
            class="list-group"
            ghost-class="ghost"
            :group="{ name: 'people', pull: true, put: false }"
            :sort="false"
            @start="dragging = true"
            @end="dragging = false"
          >
            <template #item="{ element }">
              <div :class="{ 'not-draggable': !enabled }">
                <VChip class="mb-2">
                  {{ element.name }}
                </VChip>
              </div>
            </template>
          </Draggable>
        </VCardText>
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
        <tbody>
          <tr
            v-for="item in disciplines"
            :key="item.id"
          >
            <td>
              <div style="text-align: center">
                <span v-if="editIndex !== index">{{ item.name }}</span>
                <span v-if="editIndex === index">
                  <input
                    v-model="disciplines[index]"
                    class="border-solid"
                  >
                </span>
              </div>
              <div style="text-align: center; margin-top: 5%; margin-bottom: 5%">
                <span v-if="editIndex !== index">
                  <VMenu
                    bottom
                    left
                    activator="parent"
                  >
                    <template #activator="{ on, attrs }">
                      <VBtn
                        dark
                        icon
                        v-bind="attrs"
                        :shaped="false"
                        size="x-small"
                        v-on="on"
                      >
                        <VIcon>mdi-dots-horizontal</VIcon>
                      </VBtn>
                    </template>

                    <VList>
                      <VListItem
                        link
                        @click="edit(item, index)"
                      >
                        <template #prepend>
                          <VIcon
                            class="me-2"
                            icon="mdi-pencil"
                            size="22"
                          />
                        </template>

                        <VListItemTitle> Редагувати </VListItemTitle>
                      </VListItem>
                      <VListItem
                        link
                        @click="deleteDiscipline(item.id)"
                      >
                        <template #prepend>
                          <VIcon
                            class="me-2"
                            icon="mdi-trash-can"
                            size="22"
                          />
                        </template>

                        <VListItemTitle> Видалити </VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
                </span>
                <span v-else>
                  <VMenu
                    bottom
                    left
                    activator="parent"
                  >
                    <template #activator="{ on, attrs }">
                      <VBtn
                        dark
                        icon
                        v-bind="attrs"
                        :shaped="false"
                        size="x-small"
                        v-on="on"
                      >
                        <VIcon>mdi-dots-horizontal</VIcon>
                      </VBtn>
                    </template>

                    <VList>
                      <VListItem
                        link
                        @click="save(item)"
                      >
                        <template #prepend>
                          <VIcon
                            class="me-2"
                            icon="mdi-pencil"
                            size="22"
                          />
                        </template>

                        <VListItemTitle> Зберегти </VListItemTitle>
                      </VListItem>
                      <VListItem
                        link
                        @click="cancel(item)"
                      >
                        <template #prepend>
                          <VIcon
                            class="me-2"
                            icon="mdi-trash-can"
                            size="22"
                          />
                        </template>

                        <VListItemTitle> Відмінити </VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
                </span>
              </div>
            </td>
            <td
              v-for="semester in semesters"
              :key="semester"
            >
              <Draggable
                v-if="Object.keys(selected).length"
                :list="selected[item][semester]"
                :disabled="!enabled"
                item-key="name"
                class="slot-for-components"
                ghost-class="ghost"
                :group="{
                  name: 'people',
                  put: function (to, from) {
                    return from.el.children.length < 2 || true
                  },
                }"
                @start="changeDragging"
                @end="changeDragging"
                @add="addNewComponent($event, item, semester)"
              >
                <template #item="{ element }">
                  <div :class="{ 'not-draggable': !enabled }">
                    <VChip
                      class="my-2"
                      closable
                      @click:close="deleteComponent($event, element)"
                    >
                      {{ element.name }}
                    </VChip>
                  </div>
                </template>
              </Draggable>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCol>
  </VRow>
</template>


<style scoped>
.slot-for-components {
  height: 100%;
}
</style>
