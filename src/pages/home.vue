<script setup>
import TableBasic from '@/views/user-interface/tables/TableBasic.vue'
import TableDark from '@/views/user-interface/tables/TableDark.vue'
import TableDensity from '@/views/user-interface/tables/TableDensity.vue'
import TableHeight from '@/views/user-interface/tables/TableHeight.vue'
import TableFixedHeader from '@/views/user-interface/tables/TableFixedHeader.vue'
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { computed } from 'vue-demi'
import moment from 'moment'
const eduProgsStore = useEduProgsStore()

//return { eduProgs: useEduProgsStore.getEduProgs }

onMounted( async () => {
    await eduProgsStore.fetchEduProgs()
})

let currentEduProg = null
let newNameEduProg = ref(null)
const eduProgs = computed(() => eduProgsStore.getEduProgs)

const deleteEduProg =( async(id) => {
  await eduProgsStore.deleteEduProg(id)
  await eduProgsStore.fetchEduProgs()
})
const editNameEduProg =( async() => {
  currentEduProg.name = newNameEduProg.value
  await eduProgsStore.editNameEduProg(currentEduProg, currentEduProg.id)
  newNameEduProg.value=null
  dialog2.value=false
})
const createEduProg =( async() => {
  await eduProgsStore.createEduProg(newEduProg.value)
  dialog.value=false
  await eduProgsStore.fetchEduProgs()
})
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


const dialog = ref(false)
const dialog2 = ref(false)
const dialogCheck = function dialogg() {
  dialog.value=true
}
const dialogCheck2 = function dialogg(id) {
  dialog2.value=true
  currentEduProg = id
}


const newEduProg = ref({
  name :'',
  education_level :'',
  stage :'',
  speciality :'',
  knowledge_field :'',
})

</script>

<template>
  <VCardText>
    <VBtn @click="dialogCheck" dark>
      Створити ОПП
    </VBtn>  
  </VCardText>
  
  
  <VDialog v-model="dialog"
           persistent
           max-width="600px">
    <VCard>
      <VCardTitle>
        <span class="text-h5">Створення нової ОПП</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol
              cols="12">
              <VTextField
                label="Назва документу "
                v-model="newEduProg.name"
                required
              ></VTextField>
            </VCol>
            <VCol
              cols="12">
              <VTextField
                label="Освітній рівень"
                v-model="newEduProg.education_level"
              ></VTextField>
            </VCol>
            <VCol
              cols="12">
              <VTextField
                label="Освітній ступінь"
                required
                v-model="newEduProg.stage"
              ></VTextField>
            </VCol>
            <VCol
              cols="12">
              <VTextField
                label="Спеціальність"
                required
                v-model="newEduProg.speciality"
              ></VTextField>
            </VCol>
            <VCol
              cols="12">
              <VTextField
                label="Галузь знань"
                required
                v-model="newEduProg.knowledge_field"
              ></VTextField>
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>

      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn
          color="blue darken-1"
          text
          @click="dialog = false"
        >
          Закрити
        </VBtn>
        <VBtn
          color="blue darken-1"
          text
          @click="createEduProg"
        >
          Створити
        </VBtn>
      </VCardActions>

    </VCard>
  
  </VDialog>


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
        <th class="text-center text-uppercase">
          
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in eduProgs"
        :key="item.id"
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
          <VMenu
            bottom
            left
            activator="parent"
          >
            <template v-slot:activator="{ on, attrs }">
              <VBtn
                dark
                icon
                v-bind="attrs"
                v-on="on"
                :shaped="false"
                size="small"
              >
                <VIcon>mdi-dots-horizontal</VIcon>
              </VBtn>
            </template>

            <VList>
              <VListItem link>
                <template #prepend>
                  <VIcon
                    class="me-2"
                    icon="mdi-pencil"
                    size="22"
                  />
                </template>
                        

                <VListItemTitle @click="dialogCheck2(item)">Перейменувати</VListItemTitle>
              </VListItem>
              <VListItem link>
                <template #prepend>
                  <VIcon
                    class="me-2"
                    icon="mdi-trash-can"
                    size="22"
                  />
                </template>

                <VListItemTitle @click="deleteEduProg(item.id)">Видалити</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </td>
      </tr>
    </tbody>
  </VTable>
  <!-- <v-dialog
      v-model:is-open="dialog"
      persistent
      max-width="290"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Open Dialog
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">
          Підтверждення видалення
        </v-card-title>
        <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Disagree
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->


   
  <VDialog v-model="dialog2"
            persistent
           max-width="600">
    <VCard>
      <VCardTitle>Перейменувати ОПП</VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol
              cols="12">
              <VTextField
                label="Введіть нову назву ОПП"
                required
                v-model="newNameEduProg"
              ></VTextField>
            </VCol>
          </VRow>    
          </VContainer> 
        
          <VCardActions>
               <VSpacer></VSpacer>
        <VBtn
          text
          @click="dialog2 = false"
        >
          Відмінити
        </VBtn>
        <VBtn
          text
          @click="editNameEduProg()"
        >
          Зберегти
        </VBtn>
      </VCardActions>
      </VCardText>
    </VCard>
  </VDialog>

</template>
