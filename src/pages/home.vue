<script setup>
import TableBasic from '@/views/user-interface/tables/TableBasic.vue'
import TableDark from '@/views/user-interface/tables/TableDark.vue'
import TableDensity from '@/views/user-interface/tables/TableDensity.vue'
import TableHeight from '@/views/user-interface/tables/TableHeight.vue'
import TableFixedHeader from '@/views/user-interface/tables/TableFixedHeader.vue'
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { computed, reactive } from 'vue-demi'
import moment from 'moment'
import router from '../router'
const eduProgsStore = useEduProgsStore()
const specialities = ref([])

//return { eduProgs: useEduProgsStore.getEduProgs }
const education_level = ref([])
onMounted( async () => {
  await eduProgsStore.fetchEduProgs()
  await eduProgsStore.fetchLevelsList()
  await eduProgsStore.fetchSpecialities()
  education_level.value= eduProgsStore.getLevels
  specialities.value = eduProgsStore.getSpecialities
  sortedEduProgsByYear ()

  if (localStorage.getItem('TabValue').length>0){
    selectedYear.value =Number( localStorage.getItem('TabValue'))
  } else {
    selectedYear.value = years.value[0]
  }
})
const checkValue=    ref('')
let currentEduProg = null
let newNameEduProg = ref(null)
const eduProgs = computed(() => eduProgsStore.getEduProgs)

const deleteEduProg =( async id => {
  await eduProgsStore.deleteEduProg(id)
  await eduProgsStore.fetchEduProgs()
  sortedEduProgsByYear ()
})
const editNameEduProg =( async() => {
  currentEduProg.name = newNameEduProg.value
  await eduProgsStore.editNameEduProg(currentEduProg, currentEduProg.id)
  newNameEduProg.value=null
  dialogRename.value=false
})
const createEduProg =( async() => {
  updateSelectedSpeciality()
  newEduProg.approval_year = Number(newEduProg.approval_year)
  await eduProgsStore.createEduProg(newEduProg)
  dialogCreate.value=false
  await eduProgsStore.fetchEduProgs()
  localStorage.setItem('TabValue', newEduProg.approval_year)
})

const CopyEduProg =( async item => {
  await eduProgsStore.copyEduprog(item.id)
  await eduProgsStore.fetchEduProgs()
  sortedEduProgsByYear ()
})


const cancelCreate = () =>{
  dialogCreate.value=false
}

// const createEduProg =( async() => {
//   console.log(newEduProg)
//   await eduProgsStore.createEduProg(newEduProg)
// })

// const props = defineProps({
//   modelValue: {
//     type: [Boolean],
//     default: false
//   }
// })
// const emit = defineEmits(['update:modelValue'])
// let dialog = computed({
//   get () {
//     return props.modelValue
//   },
//   set (value) {
//     return emit('update:modelValue', value)
//   }
// })


const dialogCreate = ref(false)
const dialogRename = ref(false)
const dialogDelete = ref(false)
const createEduProgDialog = function dialogg() {
  dialogCreate.value=true
}
const renameEduProgDialog = function dialogg(id) {
  dialogRename.value=true
  currentEduProg = id
}
const deleteEduProgDialog= function dialogg(id) {
  dialogDelete.value=true
  currentEduProg = id
}
const editEduProg = function edit(event, id) {
  console.log(event)
  router.replace('/eduprogs/'+id+'/characteristic')
}

function updateSelectedSpeciality() {
  console.log(newEduProg.speciality_code)
  const selectedSpes = specialities.value.find(spes => spes.name === newEduProg.speciality_code)
  newEduProg.speciality_code = String(selectedSpes.code)
  console.log(newEduProg.speciality_code)
}

console.log(eduProgs.value)

const newEduProg = reactive({
  name:'',
  education_level :'',
  speciality_code :'',
  approval_year: null,
})

const sortedByYear = ref()
const selectedYear = ref()
const years = ref([])

async function sortedEduProgsByYear (){
  years.value = [...new Set(eduProgs.value.map(obj => obj.approval_year))].sort()

  sortedByYear.value = eduProgs.value.reduce((acc, obj) => {
    if (!acc[obj.approval_year]) {
      acc[obj.approval_year] = []
    }
    acc[obj.approval_year].push(obj)
    
    return acc
  }, {})

}

const chooseYear = Array.from({ length: 21 }, (v, i) => new Date().getFullYear() - 10 + i)

function onTabChanged(){
  const TabValue = ref(localStorage.getItem('TabValue'))
  localStorage.setItem('TabValue', selectedYear.value)
  TabValue.value = localStorage.getItem('TabValue')
}
</script>

<template>
  <VBtn
    dark
    class="mb-3"
    @click="createEduProgDialog"
  >
    Створити ОПП
  </VBtn>


  <VDialog
    v-model="dialogCreate"
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
                v-model="newEduProg.name"
                label="Назва документу "
                required
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VCombobox
                v-model="newEduProg.education_level"
                :items="education_level"
                item-title="level"
                item-value="level"
                label="Освітній рівень"
                outlined
                dense
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VCombobox
                v-model="newEduProg.speciality_code"
                :items="specialities"
                item-value="code"
                item-title="name"
                label="Спеціальність"
                required
                outlined
                dense
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VSelect
                v-model="newEduProg.approval_year"
                :items="chooseYear"
                label="Рік затвердження"
                required
                density="comfortable"
                :menu-props="{maxHeight: '400'}"
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
          @click="cancelCreate"
        >
          Закрити
        </VBtn>
        <VBtn
          text
          :disabled="!(newEduProg.speciality_code && newEduProg.name &&newEduProg.education_level &&newEduProg.approval_year)"
          @click="createEduProg"
        >
          Створити
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>


  <VTabs
    v-model="selectedYear"
    @click="onTabChanged()"
  >
    <VTab
      v-for="year in years"
      :key="year"
      :value="year"
    >
      {{ year }}
    </VTab>
  </VTabs>
  <VWindow
    v-if="eduProgs.length>0"
    v-model="selectedYear"
  >
    <VWindowItem
      v-for="year in years"
      :key="year"
      :value="year"
    >
      <VTable>
        <thead>
          <tr>
            <th class="text-uppercase">
              Назва
            </th>
            <th class="text-center text-uppercase">
              Спеціальність
            </th>
            <th class="text-center text-uppercase">
              Рівень знань
            </th>
            <th class="text-center text-uppercase">
              Дата редагування
            </th>
            <th class="text-center text-uppercase" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in sortedByYear[year]"
            :key="item.name"
            class="eduprog-item"
            @click="editEduProg($event, item.id)"
          >
            <td>{{ item.name }}</td>
            <td class="text-center">
              {{ item.speciality }}
            </td>
            <td class="text-center">
              {{ item.education_level }}
            </td>
            <td class="text-center">
              {{ moment(item.updated_date).format('DD.MM.YYYY HH:mm:ss') }}
            </td>
            <td class="text-center">
              <VBtn
                icon="mdi-pencil"
                size="x-small"
                style="margin-right:2%"
                @click.stop="renameEduProgDialog(item)"
              />
              <VBtn
                style="margin-right:2%"
                icon="mdi-trash-can"
                size="x-small"
                @click.stop="deleteEduProgDialog(item)"
              />
              <VBtn
                icon="mdi-content-copy"
                size="x-small"
                @click.stop="CopyEduProg(item)"
              />
            </td>
          </tr>
        </tbody>
      </VTable>
    </VWindowItem>
  </VWindow>
  <VAlert
    v-else
    border="left"
    text
    type="info"
    prominent
  >
    Поки що не створено жодної освітньо-професійної програми.
  </VAlert>
  <VDialog
    v-model="dialogRename"
    max-width="600"
  >
    <VCard>
      <VCardTitle>Перейменувати ОПП</VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol
              cols="12"
            >
              <VTextField
                v-model="newNameEduProg"
                label="Введіть нову назву ОПП"
                required
              />
            </VCol>
          </VRow>
        </VContainer>

        <VCardActions>
          <VSpacer />
          <VBtn
            text
            @click="dialogRename = false"
          >
            Відмінити
          </VBtn>
          <VBtn
            text
            @click="editNameEduProg(); 
                    dialogRename = false"
          >
            Зберегти
          </VBtn>
        </VCardActions>
      </VCardText>
    </VCard>
  </VDialog>


  <VDialog
    v-model="dialogDelete"
    max-width="290"
  >
    <VCard>
      <VCardTitle>
        Підтвердіть видалення
      </VCardTitle>
      <VCardText>
        Ви впевнені  що хочете видалити ОПП: {{ currentEduProg.name }}?
      </VCardText>

      <VCardActions>
        <VBtn
          color="green darken-1"
          text
          @click="dialogDelete = false"
        >
          Ні
        </VBtn>

        <VBtn
          color="green darken-1"
          text
          @click="deleteEduProg(currentEduProg.id); dialogDelete = false"
        >
          Так
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>
.eduprog-item{
  cursor: pointer;
}
</style>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
