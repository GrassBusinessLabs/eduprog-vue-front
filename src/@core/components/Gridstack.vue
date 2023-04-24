<script setup>
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import { defineExpose, ref } from 'vue'

const props = defineProps({
  gridItems: {
    type: Object,
    required: true,
  },
  components: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['added', 'dragstart', 'resizestop', 'delete'])

const GRID_COLUMN = 8
const GRID_MIN_ROW = 1
const GRID_MAX_ROW = 1

let grid
const gridref = ref(null)
const hoveredWidget = ref(null)

onMounted(() => {
  grid = GridStack.init(
    {
      float: true,
      column: GRID_COLUMN,
      minRow: GRID_MIN_ROW,
      maxRow: GRID_MAX_ROW,
    },
    gridref.value,
  )

  grid.on('added', function(event, items) {
    emit('added', [event, items])
  })

  grid.on('dragstart', function(event, items) {
    emit('dragstart', [event, items])
  })

  grid.on('dragstop', (event, element) => {
    console.log('move event!', event, element)
  })

  grid.on('resizestop', function(event, items) {
    emit('resizestop', [event, items])
  })
})

function mouseleave() {
  hoveredWidget.value = null
}

function mouseover(idWidget) {
  hoveredWidget.value = idWidget
}
function deleteComponent(idWidget) {
  const foundWidget = grid.getGridItems()
    .find(item => item.gridstackNode.id.toString() === idWidget.toString())
  if (foundWidget) {
    grid.removeWidget(foundWidget, true)
  }
}

const createWidget = idWidget => {
  nextTick(() => {
    grid.load(grid.getGridItems())
  })
}

const isAreaEmpty = () => {
  let sumNodeWidth = 0
  grid.getGridItems().map(item => sumNodeWidth += item.gridstackNode.w)

  return sumNodeWidth < GRID_COLUMN
}

const getGridNodes = () => {
  return grid.getGridItems()
}

defineExpose({ createWidget, isAreaEmpty, getGridNodes })
</script>

<template>
  <div
    ref="gridref"
    class="grid-stack"
  >
    <div
      v-for="(component, key, index) in props.gridItems"
      :key="'component'+index"
      class="grid-stack-item"
      :gs-id="component.id"
      :gs-x="component.x"
      :gs-y="component.y"
      :gs-h="component.h"
      :gs-w="component.w"
    >
      <div
        class="grid-stack-item-content"
        @mouseover="mouseover(component.id)"
        @mouseleave="mouseleave"
      >
        <VMenu activator="parent" location="top" offset="0px">
          <template v-slot:activator="{ props }">
            <VBtn
              v-show="hoveredWidget === component.id"
              v-bind="props"
              class="grid-stack-item__edit-btn"
              density="compact"
              icon="mdi-dots-horizontal"
            />
          </template>

          <VList>
            <VListItem @click="deleteComponent(component.id)">
              Remove
            </VListItem>
            <VListItem>
              Edit
            </VListItem>
          </VList>
        </VMenu>
        <!--    :variant="hoveredWidget === component.id ? 'underlined' : 'plain'"    -->
        <VSelect
          class="grid-stack-item__select"
          variant="underlined"
          item-value="id"
          item-title="name"
          menu-icon=""
          multiple
          :items="props.components"
        />
      </div>
    </div>
  </div>
</template>

<style>
.grid-stack {

}

.grid-stack-item {
}

.grid-stack-item-content {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 3px;

}

.grid-stack-item__select {
  height: 100%;
  text-align: center;
}

.v-field__field{
  align-items: center;
}

.v-field__prepend-inner{
  align-items: center;
}

.grid-stack-item__edit-btn {
  position: absolute;
  top: 3px;
  right: 3px;
  z-index: 10000;
}
</style>
