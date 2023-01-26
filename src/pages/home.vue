<script setup>
import TableBasic from '@/views/user-interface/tables/TableBasic.vue'
import TableDark from '@/views/user-interface/tables/TableDark.vue'
import TableDensity from '@/views/user-interface/tables/TableDensity.vue'
import TableHeight from '@/views/user-interface/tables/TableHeight.vue'
import TableFixedHeader from '@/views/user-interface/tables/TableFixedHeader.vue'
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { computed } from 'vue-demi'
const eduProgsStore = useEduProgsStore()

//return { eduProgs: useEduProgsStore.getEduProgs }

Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

onMounted( async() => {
    await eduProgsStore.fetchEduProgs()
})

const eduProgs = computed(() => eduProgsStore.getEduProgs)
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
          {{ item.updated_date}}
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

                    <VListItemTitle>Видалити</VListItemTitle>
                </VListItem>
            </VList>
          </VMenu>
        </td>
      </tr>
    </tbody>
  </VTable>
</template>
