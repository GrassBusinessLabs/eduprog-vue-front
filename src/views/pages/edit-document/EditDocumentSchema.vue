<template>
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
                class="border-solid"
                v-model="item.DS"
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
                    @click="cancel(item)"
                    link
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
        <td v-for="semester in semesters"
        :key="semester">
          <VContainer fluid>
            <VRow>
              <VCol cols="12">
                <VCombobox
                  @update:modelValue="handleSubject($event, semester, item)"
                  @blur="closeCombobox"
                  :items="getSubjects()"
                  item-title="name"
                  item-value="id"
                  multiple
                  small-chips
                />
              </VCol>
            </VRow>
          </VContainer>
        </td>
      </tr>
    </tbody>
  </VTable>
</template>

<script>
export default {
  data() {
    return {
      editIndex: null,
      originalData: null,
      disciplines: [...new Set(this.scheme.map(e => e.discipline))],
      semesters:[...Array(8).keys()],
      changes: {
        subjects: [],
        semester: '',
        discipline: ''
      },
    }
  },
  props: ['scheme', 'components'],
  methods: {
    add() {
      this.originalData = null
      this.itemsS.push({ DS: ' ', S1: '', S2: '', S3: '', S4: '', S5: '', S6: '', S7: '', S8: '' })
      this.editIndex = this.itemsS.length - 1
      console.log(this.disciplines)
    },
    edit(item, index) {
      this.originalData = Object.assign({}, item)
      this.editIndex = index
    },
    cancel(item) {
      this.editIndex = null
      if (!this.originalData) {
        this.itemsS.splice(this.itemsS.indexOf(item), 1)

        return
      }
      Object.assign(item, this.originalData)
      this.originalData = null
    },
    remove(item, index) {
      this.itemsS.splice(index, 1)
    },
    save(item) {
      this.originalData = null
      this.editIndex = null
    },
    getComponentByDiscipline(discipline, semestr){
      let array = this.scheme.filter(e => {
        if(e.discipline===discipline && e.semester_num === semestr){
          return e
        }
      })
      array.map(e => {
        e.title=e.eduprogcomp.name
        e.value=e.eduprogcomp.id
      })
      console.log(array)
      return array
    },
    getSubjects(){
      console.log(this.components.mandatory.concat(this.components.selective))
      return this.components.mandatory.concat(this.components.selective)
    },
    handleSubject(event, semester, discipline){
      this.changes.subjects = event;
      this.changes.semester = semester+1;
      this.changes.discipline = discipline;
      // console.log(event, discipline, semester+1)
      // const foundedSubjects = this.scheme.find(e => {
      //   console.log(e.semester_num, semester+1, e.discipline, discipline, e.eduprogcomp_id, event[event.length-1].id)
      //   if(e.semester_num === semester+1 && e.discipline===discipline && e.eduprogcomp_id===event.id){
      //     return e
      //   }
      // })
    },
    closeCombobox(){
      console.log(this.changes)
      console.log('схема:', this.scheme)
      const filteredScheme =this.scheme.filter(e => {
        console.log(e.semester_num, this.changes.semester, e.discipline, this.changes.discipline)
        if(e.semester_num === this.changes.semester && e.discipline === this.changes.discipline){
          return e
        }
      })
      console.log('Фильтрована схема', filteredScheme)
      const forAdd=[];
      this.changes.subjects.forEach(element => {
      if(!this.scheme.find(e => element.id===e.eduprogcomp.id)){
        forAdd.push(element)
      }
      });
      console.log('Массив для добавления: ', forAdd)
    }
  },
}
</script>