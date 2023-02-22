<template>
  <VRow>
    <VCol cols="2">
      <VCard
        title="Всі предмети"
        class="mb-5"
      >
        <VCardText cols="12">
          <Draggable
            :list="getSubjects()"
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
              @click="add"
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
        <tbody>
        <tr
          v-for="(item, index) in disciplines"
          :key="index"
        >
          <td>
            <div style="text-align: center">
              <span v-if="editIndex !== index">{{ item }}</span>
              <span v-if="editIndex === index">
                  <input
                    v-model="disciplines[index]"
                    class="border-solid"
                  />
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
                        @click="remove(item, index)"
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

<script setup>
import draggable from 'vuedraggable'
import { useEduProgsStore } from '@/stores/eduProgs.js'

import { reactive } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

onBeforeMount(() => {
  initData()
})
const eduProgsStore = useEduProgsStore()
const components = eduProgsStore.getEduProg.components
const scheme = eduProgsStore.getScheme

const editIndex = ref(null)
const originalData = ref(null)
const disciplines = ref([...new Set(scheme.map(e => e.discipline))])
const semesters = ref([...Array(8).keys()])
const changes = reactive({
  subjects: [],
  semester: '',
  discipline: '',
})
const selected = reactive({})
const enabled = ref(true)
const dragging = ref(false)

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
function add() {
  console.log(selected.value)
  originalData.value = null
  disciplines.value.push('')
  editIndex.value = disciplines.value.length
}
function edit(item, index) {
  originalData.value = Object.assign({}, item)
  editIndex.value = index
}
function cancel(item) {
  editIndex.value = null
  Object.assign(item, originalData.value)
  originalData.value = null
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

function getSubjects() {
  console.log("asdfsfgsf",components.mandatory.concat(components.selective))

  return components.mandatory.concat(components.selective).value
}

function handleSubject(event, semester, discipline) {
  changes.subjects = event
  changes.semester = semester + 1
  changes.discipline = discipline
}
</script>

<style scoped>
.slot-for-components {
  height: 100%;
}
</style>
