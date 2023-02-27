<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { reactive } from 'vue'
const eduProgsStore = useEduProgsStore()
const components = eduProgsStore.getEduProg.components
const loading = ref(false)
const mandatoryComponents = reactive(
  components.mandatory.map(component => ({
    ...component,
    items: [], // добавляем пустой массив items для каждого компонента
  })),
)
const allComponents = ref(components.mandatory)
const sortedComponents = component => {
  return components.mandatory.filter(el => {
    return el.id !== component.id
  })
}
const selectedComponents = reactive({})
// вычисляемое свойство для связывания v-combobox с соответствующим массивом items
const getItems = component =>
  computed({
    get: () => component.items,
    set: value => (component.items = value),
  })
onBeforeMount(async () => {
  loading.value = true
  await components.mandatory.forEach(el => {
    eduProgsStore.fetchPossibleRelations(el.eduprog_id, el.id).then(res => {
      selectedComponents[el.id] = res
    })
  })
  loading.value = false
})
</script>

<template>
  <VTable>
    <thead class="thead-light">
      <tr>
        <th class="text-center">Назва документу</th>
      </tr>
    </thead>
  </VTable>
  <VTable>
    <thead class="thead-light">
      <tr>
        <th>Код н/д</th>
        <th>Назва КОП</th>
        <th>Залежності</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="component in components.mandatory"
        :key="component.id"
      >
        <td>{{ 'ОК ' + component.code }}</td>
        <td>
          <span>{{ component.name }}</span>
        </td>
        <td rowspan="1">
          <VCombobox
            v-if="selectedComponents[component.id]?.length"
            @click="call"
            :items="selectedComponents[component.id]"
            item-title="name"
            multiple
            chips
            clearable
            class="ma-0, my-4"
            style="width: 100%"
          />
          <v-alert
            v-else
            type="info"
            text="Вибачте, але щоб тут зявилися можливі звязки, потрібно спочатку заповнити сторінку схеми"
            variant="tonal"
            class="my-4"
          ></v-alert>
        </td>
      </tr>
    </tbody>
  </VTable>
</template>
