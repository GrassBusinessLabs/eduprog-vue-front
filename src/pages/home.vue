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


const eduProgs = computed(() => eduProgsStore.getEduProgs)

const deleteEduProg =( async(id) => {
  await eduProgsStore.deleteEduProg(id)
  await eduProgsStore.fetchEduProgs()
})
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



// let currentEduProg = null
// const deleteEduProg =( (id) => {
//   currentEduProg = id;
//   dialog = true;
// })


</script>

<template>
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
                        

                    <VListItemTitle>Перейменувати</VListItemTitle>
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
</template>
