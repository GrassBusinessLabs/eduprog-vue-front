<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'

import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const eduProgsStore = useEduProgsStore()
const { components } = storeToRefs(eduProgsStore)
const generalCompetencies = ref([])
const selected = reactive({})
const valuesZK = reactive({})
const maxValue = ref(6)
const progressColor = ref({})
const selFk = ref([])
const selVfk = ref([])

onBeforeMount(async () => {
  await eduProgsStore.fetchCompetencyRelations(route.params.pages)
  await eduProgsStore.fetchAllCompetencies(route.params.pages)
  await eduProgsStore.fetchSelectedCompetencies(route.params.pages, 'FK')
  await eduProgsStore.fetchSelectedVfk(route.params.pages)

  const relations = eduProgsStore.getCompetencyRelations.reduce((acc, cur) => {
    const competency_id = cur.competency_id
    const component_id = cur.component_id
    if (!acc[competency_id]) {
      acc[competency_id] = {}
    }
    acc[competency_id][component_id] = true

    return acc
  }, {})

  generalCompetencies.value = eduProgsStore.getCompetencies
  generalCompetencies.value.forEach(el => {
    selected[el.id] = reactive({})
    valuesZK[el.id] = 0
    components.value.mandatory.forEach(comp => {
      try {
        if (relations[el.id][comp.id]) {
          valuesZK[el.id]++
          selected[el.id][comp.id] = true
        }
      } catch {
        selected[el.id][comp.id] = false
      }
    })
  })
  selFk.value = eduProgsStore.getSelectedCompetencies
  selVfk.value = eduProgsStore.getSelectedVfk
})

const changeCheckbox = (e, componentId, competencyId) => {
  if (e) {
    valuesZK[competencyId]++
    eduProgsStore.createCompetencyRelation(+route.params.pages, componentId, competencyId)
  } else if (!e) {
    valuesZK[competencyId]--
    eduProgsStore.deleteCompetencyRelation(+route.params.pages, componentId, competencyId)
  }
}

const updateObjectColors = obj => {
  const newObject = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value < 3) {
      newObject[key] = 'error'
    } else if (value < 6) {
      newObject[key] = 'success'
    } else {
      newObject[key] = 'warning'
    }
  }

  return newObject
}

watch(valuesZK, newValue => {
  progressColor.value = updateObjectColors(newValue)
})
</script>

<template>
  <VRow v-if="components.mandatory?.length && components.mandatory.length > 0 && selFk?.length && selFk.length > 0">
    <VCol>
      <VTable>
        <thead class="thead-light">
          <tr>
            <th class="text-center">
              <h3>Фахові компетентності</h3>
            </th>
          </tr>
        </thead>
      </VTable>
      <VTable v-if="components.mandatory.length > 0">
        <tbody>
          <tr>
            <th />
            <th
              v-for="component in components.mandatory"
              :key="component.id"
            >
              <div style="text-align: center">
                <VTooltip
                  activator="parent"
                  location="top"
                >
                  {{ component.name }}
                </VTooltip>
                <span>{{ 'ОК' + component.code }}</span>
              </div>
            </th>
          </tr>
          <tr
            v-for="item in selFk"
            :key="item.id"
          >
            <td
              colspan="1"
              style="width: 30%"
            >
              <div style="text-align: center">
                <span
                  ><h3>{{ item.type + '' + item.code }} {{ '(' + valuesZK[item.id] + ')' }}</h3>
                  {{ item.definition }}
                </span>
                <VRow
                  justify="start"
                  align="center"
                  no-gutters
                >
                  <br />
                  <VCol>
                    <VProgressLinear
                      v-model="valuesZK[item.id]"
                      :max="maxValue"
                      :buffer-value="value"
                      :color="progressColor[item.id]"
                      :height="10"
                      rounded
                    />
                  </VCol>
                </VRow>
              </div>
            </td>
            <td
              v-for="component in components.mandatory"
              :key="component.id"
            >
              <VRow justify="center">
                <VCheckbox
                  v-model="selected[item.id][component.id]"
                  @update:modelValue="changeCheckbox($event, component.id, item.id)"
                />
              </VRow>
            </td>
          </tr>
        </tbody>
      </VTable>
      <VAlert
        v-else
        border="left"
        text
        type="info"
        prominent
      >
        Поки що не додано жодного освітнього компонента до схеми.
      </VAlert>
    </VCol>
  </VRow>
  <VAlert
    v-else-if="components.mandatory?.length && components.mandatory?.length > 0 && !selZk?.length"
    border="left"
    text
    type="info"
    prominent
  >
    Поки що не додано жодної фахової компетентності до ОПП.
  </VAlert>
  <VAlert
    v-else-if="!components.mandatory?.length && selZk?.length && selZk?.length > 0"
    border="left"
    text
    type="info"
    prominent
  >
    Поки що не додано жодного основного компоненту до ОПП.
  </VAlert>
  <VRow v-if="components.mandatory?.length && components.mandatory.length > 0 && selVfk?.length && selVfk.length > 0">
    <VCol>
      <VTable class="mt-10">
        <thead class="thead-light">
          <tr>
            <th class="text-center">
              <h3>Спеціальні фахові компетентності передбачені закладом вищої освіти компетентності</h3>
            </th>
          </tr>
        </thead>
      </VTable>
      <VTable v-if="components.mandatory.length > 0">
        <tbody>
          <tr>
            <th />
            <th
              v-for="component in components.mandatory"
              :key="component.id"
            >
              <div style="text-align: center">
                <VTooltip
                  activator="parent"
                  location="top"
                >
                  {{ component.name }}
                </VTooltip>
                <span>{{ 'ОК' + component.code }}</span>
              </div>
            </th>
          </tr>
          <tr
            v-for="item in selVfk"
            :key="item.id"
          >
            <td
              colspan="1"
              style="width: 30%"
            >
              <div style="text-align: center">
                <span
                  ><h3>{{ item.type + '' + item.code }} {{ '(' + valuesZK[item.id] + ')' }}</h3>
                  {{ item.definition }}
                </span>
                <VRow
                  justify="start"
                  align="center"
                  no-gutters
                >
                  <br />
                  <VCol>
                    <VProgressLinear
                      v-model="valuesZK[item.id]"
                      :max="maxValue"
                      :buffer-value="value"
                      :color="progressColor[item.id]"
                      :height="10"
                      rounded
                    />
                  </VCol>
                </VRow>
              </div>
            </td>
            <td
              v-for="component in components.mandatory"
              :key="component.id"
            >
              <VRow justify="center">
                <VCheckbox
                  v-model="selected[item.id][component.id]"
                  @update:modelValue="changeCheckbox($event, component.id, item.id)"
                />
              </VRow>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCol>
  </VRow>
  <VAlert
    class="mt-3"
    v-else-if="components.mandatory?.length && components.mandatory?.length > 0 && !selZk?.length"
    border="left"
    text
    type="info"
    prominent
  >
    Поки що не додано жодної спеціальної фахової компетентності до ОПП.
  </VAlert>
  <VAlert
    class="mt-3"
    v-else-if="!components.mandatory?.length && selZk?.length && selZk?.length > 0"
    border="left"
    text
    type="info"
    prominent
  >
    Поки що не додано жодного основного компоненту до ОПП.
  </VAlert>
</template>
