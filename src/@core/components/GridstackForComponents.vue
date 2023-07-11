<script setup>
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import { defineExpose, ref, toRef, defineProps, watch, nextTick } from 'vue'

const props = defineProps({
  components: {
    type: Object,
    required: true,
    default: () => [],
  },
  searchTerm: {
    type: String,
    required: true,
  },
})
const sortByName = ref(false)
const filteredData = computed(() => {
  const searchedComps = props.components.filter(comp => {
    return comp.name.toLowerCase().includes(props.searchTerm.toLowerCase())
  })
  if (sortByName) {
    console.log(searchedComps.sort())
    return searchedComps.sort()
  }
  return searchedComps
})
watch(filteredData, () => {
  updateGridComp()
})
console.log('ФИЛЬТРОВАНАЯ ДАТА', filteredData)
const emit = defineEmits(['added', 'dragstart', 'delete', 'dropped'])

let grid
const gridref = ref(null)

watch(props.components, (newValue, oldValue) => {
  nextTick(() => {
    grid.load(grid.getGridItems())
  })
})

onMounted(() => {
  grid = GridStack.init(
    {
      float: false,
      column: 1,
      cellHeight: '65px',
      disableResize: true,
      acceptWidgets: '.grid-stack-item',
    },
    gridref.value,
  )
  grid.on('added', function (event, items) {
    emit('added', [event, items])
  })

  grid.on('dragstart', function (event, items) {
    emit('dragstart', [event, items])
  })

  grid.on('dragstop', (event, element) => {
    console.log('move event!', event, element)
  })

  grid.on('dropped', function (event, previousWidget, newWidget) {
    emit('dropped', [event, previousWidget, newWidget])
  })
  console.log(props.components)
})

const createFreeWidget = () => {
  nextTick(() => {
    grid.load(grid.getGridItems())
  })
}

const updateGridComp = () => {
  nextTick(() => {
    grid.load(grid.getGridItems())
    grid.compact(grid.getGridItems())
    console.log(props.components)
  })
}

defineExpose({ createFreeWidget, updateGridComp })
</script>

<template>
  <VTable>
    <thead>
      <tr>
        <th @click="sortByName = !sortByName">Назва компонента</th>
        <th>Вільні кредити</th>
      </tr>
    </thead>
  </VTable>
  <div
    ref="gridref"
    class="grid-stack"
  >
    <div
      v-for="component in filteredData"
      :key="component.id"
      class="grid-stack-item"
      :gs-id="component.id"
      :gs-x="component.x"
      :gs-y="component.y"
      :gs-h="component.h"
      :gs-w="component.w"
    >
      <div
        class="grid-stack-item-content"
        style="overflow: hidden"
      >
        <div style="width: 65%; margin-left: 10%">
          {{ component.name }}
        </div>
        <div style="width: 10%">
          {{ component.free_credit }}
        </div>
      </div>
    </div>
  </div>
</template>
