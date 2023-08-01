<script setup>
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import { defineExpose, ref, defineProps, watch, nextTick } from 'vue'

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
const emit = defineEmits(['added', 'dragstart', 'delete', 'dropped'])
const sortByName = ref('norm')

const filteredData = computed(() => {
  const searchedComps = props.components.filter(comp => {
    return comp.name.toLowerCase().includes(props.searchTerm.toLowerCase())
  })
  if (sortByName.value === 'Az') {
    const filter = searchedComps.map(obj => toRaw(obj))
    console.log(filter.sort(compareByNameAz))
    console.log(searchedComps.sort(compareByNameAz))

    return searchedComps.sort(compareByNameAz).reverse()
  } else if (sortByName.value === 'Za') {
    console.log(searchedComps.reverse())

    return searchedComps.sort(compareByNameZa).reverse()
  } else {
  }

  return searchedComps
})

const compareByNameAz = (a, b) => {
  const nameA = a.name.toLowerCase()
  const nameB = b.name.toLowerCase()

  return nameA < nameB ? -1 : nameA > nameB ? 1 : 0
}

const compareByNameZa = (a, b) => {
  const nameA = a.name.toLowerCase()
  const nameB = b.name.toLowerCase()

  return nameA > nameB ? -1 : nameA < nameB ? 1 : 0
}

function sort() {
  if (sortByName.value === 'norm') {
    sortByName.value = 'Az'
  } else if (sortByName.value === 'Az') {
    sortByName.value = 'Za'
  } else {
    sortByName.value = 'Az'
  }
}

watch(filteredData, () => {
  updateGridComp()
})

let grid
const gridref = ref(null)

watch(props, (newValue, oldValue) => {
  nextTick(() => {
    grid.load(grid.getGridItems())
  })
})

onMounted(() => {
  grid = GridStack.init(
    {
      float: true,
      minRow: 1,
      column: 1,
      cellHeight: '70px',
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
  })
  console.log(grid.getGridItems())
}

function gridItem (){
  return grid.getGridItems()
}



defineExpose({ createFreeWidget, updateGridComp, gridItem })
</script>

<template>
  <VTable>
    <thead>
      <tr>
        <th @click="sort">
          Назва компонента
        </th>
        <th>Вільні кредити</th>
      </tr>
    </thead>
  </VTable>
  <div
    ref="gridref"
    class="grid-stack grid-schema"
  >
    <div
      v-if='filteredData.length >= 1'
      v-for="(component, index) in filteredData"
      :key="index"
      class="grid-stack-item"
      :gs-id="component.id"
      :gs-x="component.x"
      :gs-y="component.y"
      :gs-h="component.h"
      :gs-w="component.w"
    >
      <div
        class="grid-stack-item-content rounded-lg d-flex pa-4 align-center"
        style="overflow: hidden"
      >
        <div>
          {{ component.name }}
        </div>
        <VSpacer />
        <div>
          {{ component.free_credit}}
        </div>
      </div>
    </div>
    <div
    v-else
    class='d-flex pa-5 justify-center'
    >
      Вільні компоненти відсутні
    </div>
  </div>
</template>

<style scoped>
.grid-schema .grid-stack-item-content {
  height: 70%;
  border: 1px solid rgb(202, 202, 202);
}
</style>
