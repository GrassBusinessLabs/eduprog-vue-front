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
          <VContainer fluid>
            <VRow>
              <VCol cols="12">
                <VCombobox
                  v-if="Object.keys(this.selected).length"
                  :items="getSubjects()"
                  item-title="name"
                  item-value="id"
                  multiple
                  small-chips
                  @update:modelValue="handleSubject($event, semester, item)"
                  @blur="closeCombobox"
                  v-model="selected[item][semester]"
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
  props: ['scheme', 'components'],
  data() {
    return {
      editIndex: null,
      originalData: null,
      disciplines: [...new Set(this.scheme.map(e => e.discipline))],
      semesters:[...Array(8).keys()],
      changes: {
        subjects: [],
        semester: '',
        discipline: '',
      },
      selected:{},
    }
  },
mounted(){
  this.disciplines.forEach(el => {
    this.selected[el]=[[],[],[],[],[],[],[],[]];
  })
  Object.keys(this.selected).map(key => {
    this.selected[key].forEach((semester, index) =>{
      this.selected[key][index].push(...this.getComponentByDiscipline(key, index+1))
      //return [...this.getComponentByDiscipline(key, index+1)]
    })
  })
  console.log(this.selected)
},
  methods: {
    add() {
      // this.selected.forEach(element=>{
      //   element.forEach(e =>{
      //     if(getComponentByDiscipline(element, e+1)){
      //       element[e].push(getComponentByDiscipline(element, e+1))
      //     }
      //   })
      // })
      console.log(this.selected)
      this.originalData = null
      this.disciplines.push('')
      this.editIndex = this.disciplines.length
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
          return e.eduprogcomp.name
        }
      })
      array.map(e => {
          e.name=e.eduprogcomp.name
          e.id=e.eduprogcomp.id
      })
      console.log(array)
      
      return array
    },
    getSubjects(){
      return this.components.mandatory.concat(this.components.selective)
    },
    handleSubject(event, semester, discipline){
      this.changes.subjects = event
      this.changes.semester = semester+1
      this.changes.discipline = discipline

      // console.log(event, discipline, semester+1)
      // const foundedSubjects = this.scheme.find(e => {
      //   console.log(e.semester_num, semester+1, e.discipline, discipline, e.eduprogcomp_id, event[event.length-1].id)
      //   if(e.semester_num === semester+1 && e.discipline===discipline && e.eduprogcomp_id===event.id){
      //     return e
      //   }
      // })
    },
    closeCombobox(){
      console.log('селектед:', this.selected)
      const filteredScheme =this.scheme.filter(e => {
        if(e.semester_num === this.changes.semester && e.discipline === this.changes.discipline){
          return e
        }
      })
      console.log('Фильтрована схема', filteredScheme)
      const forAdd=[]
      const forDelete = []


      this.changes.subjects.forEach(element => {
        if(!filteredScheme.find(e => element.id===e.eduprogcomp.id)){
          forAdd.push(element)
        }
      })
      filteredScheme.forEach(element => {
        if (!this.changes.subjects.find(e => e.id=== element.eduprogcomp.id)){
          forDelete.push(element)
        }
      },)

      forAdd.forEach(element => {
        const newComponent = {
          discipline: this.changes.discipline,
          semester_num: this.changes.semester,
          eduprog_id: element.eduprog_id ,
          eduprogcomp_id:element.id ,
          credits_per_semester: 10
        }
        //console.log('Елемент для создания', newComponent)
        this.$emit('addComponentToScheme', newComponent)
      })
      forDelete.forEach(element => {
        //console.log('Елемент для удаления', element)
        this.$emit('deleteComponentFromSheme', element.id)
      })
      // console.log('Массив для добавления: ', forAdd)
      // console.log('Массив для delete: ', forDelete)
      // console.log('Схема просто',this.scheme)
    },
  },
}
</script>
