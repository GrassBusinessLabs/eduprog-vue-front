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

const editNameEduProg =( async() => {
  currentEduProg.name = newNameEduProg.value
  await eduProgsStore.editNameEduProg(currentEduProg, currentEduProg.id)
  newNameEduProg.value=null
  dialogRename.value=false
})
const createEduProg =( async() => {
  await eduProgsStore.createEduProg(newEduProg.value)
  dialogCreate.value=false
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
    <VBtn @click="createEduProgDialog" dark>
      ???????????????? ??????
    </VBtn>
  </VCardText>


  <VDialog v-model="dialogCreate"
           persistent
           max-width="600px">
    <VCard>
      <VCardTitle>
        <span class="text-h5">?????????????????? ?????????? ??????</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol
              cols="12">
              <VTextField
                label="?????????? ?????????????????? "
                v-model="newEduProg.name"
                required
              ></VTextField>
            </VCol>
            <VCol
              cols="12">
              <VTextField
                label="???????????????? ????????????"
                v-model="newEduProg.education_level"
              ></VTextField>
            </VCol>
            <VCol
              cols="12">
              <VTextField
                label="???????????????? ??????????????"
                required
                v-model="newEduProg.stage"
              ></VTextField>
            </VCol>
            <VCol
              cols="12">
              <VTextField
                label="??????????????????????????"
                required
                v-model="newEduProg.speciality"
              ></VTextField>
            </VCol>
            <VCol
              cols="12">
              <VTextField
                label="???????????? ??????????"
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
          @click="dialogCreate = false"
        >
          ??????????????
        </VBtn>
        <VBtn
          text
          :disabled="!(newEduProg.knowledge_field && newEduProg.speciality && newEduProg.name &&newEduProg.education_level && newEduProg.stage)"
          @click="createEduProg"><!--Need fix, user need to reload page for check new EduProg -->
          ????????????????
        </VBtn>
      </VCardActions>

    </VCard>

  </VDialog>


  <VTable>
    <thead>
    <tr>
      <th class="text-uppercase">
        ??????????
      </th>
      <th class="text-center text-uppercase">
        ??????????????????????????
      </th>
      <th class="text-center text-uppercase">
        ???????????? ??????????
      </th>
      <th class="text-center text-uppercase">
        ???????? ??????????????????????
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


              <VListItemTitle @click="renameEduProgDialog(item)">??????????????????????????</VListItemTitle>
            </VListItem>
            <VListItem link>
              <template #prepend>
                <VIcon
                  class="me-2"
                  icon="mdi-trash-can"
                  size="22"
                />
              </template>

              <VListItemTitle @click="deleteEduProgDialog(item)">????????????????</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </td>
    </tr>
    </tbody>
  </VTable>


  <VDialog v-model="dialogRename"
           persistent
           max-width="600">
    <VCard>
      <VCardTitle>?????????????????????????? ??????</VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol
              cols="12">
              <VTextField
                label="?????????????? ???????? ?????????? ??????"
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
            @click="dialogRename = false"
          >
            ??????????????????
          </VBtn>
          <VBtn
            text
            @click="editNameEduProg(); dialogRename = false"
          >
            ????????????????
          </VBtn>
        </VCardActions>
      </VCardText>
    </VCard>
  </VDialog>


  <VDialog  v-model="dialogDelete"
            max-width="290">
    <VCard>
      <VCardTitle>
        ?????????????????????? ??????????????????
      </VCardTitle>
      <v-card-text>
        ???? ????????????????  ???? ???????????? ???????????????? ??????: {{ currentEduProg.name }}?
      </v-card-text>

      <VCardActions>
        <v-btn
          color="green darken-1"
          text
          @click="dialogDelete = false"
        >
          ????
        </v-btn>

        <v-btn
          color="green darken-1"
          text
          @click="deleteEduProg(currentEduProg.id); dialogDelete = false"
        >
          ??????
        </v-btn>
      </VCardActions>
    </VCard>

  </VDialog>

</template>
<route lang="yaml">
meta:
  requiresAuth: true
</route>
