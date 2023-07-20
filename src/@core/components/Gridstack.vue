<script setup>
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import { defineExpose, nextTick, ref, watch } from 'vue'

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

const emit = defineEmits(['added', 'dragstart', 'resizestop', 'delete', 'change'])

const GRID_COLUMN = 8
const GRID_MIN_ROW = 1
const GRID_MAX_ROW = 5

let grid
const gridref = ref(null)
const hoveredWidget = ref(null)

watch(props, (newValue, oldValue) => {
  nextTick(() => {
    grid.load(grid.getGridItems())
    console.log(props.gridItems)
  })
})

onMounted(() => {
  grid = GridStack.init(
    {
      cellHeight: '80px',
      float: false,
      column: GRID_COLUMN,
      minRow: GRID_MIN_ROW,
      maxRow: GRID_MAX_ROW,
      acceptWidgets: '.grid-stack-item',
    },
    gridref.value,
    console.log(gridref.value),
  )

  grid.on('added', function (event, items) {
    emit('added', [event, items])
  })

  grid.on('dragstart', function (event, items) {
    emit('dragstart', [event, items])
  })

  grid.on('dragstop', (event, element) => {
    emit('dragstop', [event, element])
  })

  grid.on('change', function (event, items) {
    emit('change', [event, items])
  })

  grid.on('resizestop', function (event, items) {
    emit('resizestop', [event, items])
  })
  grid.on('dropped', function (event, previousWidget, newWidget) {
    emit('dropped', [event, previousWidget, newWidget])
  })
})

function mouseleave() {
  hoveredWidget.value = null
}

function mouseover(idWidget) {
  hoveredWidget.value = idWidget
}

function deleteGridComponent(component) {
  emit('delComp', component)
  nextTick(() => {
    grid.load(grid.getGridItems())
  })
}

const createWidget = () => {
  nextTick(() => {
    grid.load(grid.getGridItems())
  })
}

const isAreaEmpty = () => {
  console.log(grid.getRow())
  let sumNodeWidth = 0
  grid.getGridItems().map(item => (sumNodeWidth += item.gridstackNode.w))

  return sumNodeWidth < GRID_COLUMN
}

const getGridNodes = () => {
  return grid.getGridItems()
}

function editWidget(component) {
  console.log(component.id)
}

function change(component) {
  console.log(component)
  console.log(component.id)
  const items = this.grid.getGridItems()
  const item = items.find(item => item.gridstackNode.id === component.id)
  console.log('Widget с мисива на прямую', items[0].gridstackNode)
  console.log('Widget который нашел ', item)

  const newComp = {
    discipline_id: component.disc_id,
    row: item.gridstackNode.y + 1,
    semester_num: item.gridstackNode.x + 1,
    eduprog_id: 0,
    eduprogcomp_id: component.eduprogcomp,
    credits_per_semester: 0,
  }
  emit('createComp', newComp)
}

function init() {
  grid.initAll()
}

defineExpose({ createWidget, isAreaEmpty, getGridNodes, deleteGridComponent, init })
</script>

<template>
  <div
    ref="gridref"
    class="grid-stack grid-schema"
  >
    <div
      v-for="(component, key, index) in props.gridItems"
      :key="'component' + index"
      class="grid-stack-item rounded-lg"
      :gs-id="component.id"
      :gs-x="component.x"
      :gs-y="component.y"
      :gs-h="component.h"
      :gs-w="component.w"
      @mouseover="mouseover(component.id)"
      @mouseleave="mouseleave"
    >
      <VMenu
        activator="parent"
        location="top"
        offset="0px"
      >
        <template #activator="{ props }">
          <VBtn
            v-show="hoveredWidget === component.id"
            v-bind="props"
            class="grid-stack-item__edit-btn"
            density="compact"
            icon="mdi-dots-horizontal"
          />
        </template>

        <VList>
          <VListItem @click="deleteGridComponent(component)"> Remove </VListItem>
          <VListItem @click="editWidget(component)"> Edit </VListItem>
        </VList>
      </VMenu>
      <!--    :variant="hoveredWidget === component.id ? 'underlined' : 'plain'"    -->

      <div class="justify-center rounded-lg grid-stack-item-content text-center d-flex flex-column">
        <span class="text-body-2 mb-1">
          {{ component.eduprogcomp.name }}
        </span>
        <div class="d-flex justify-space-around text-body-2 w-100">
          <span v-if="component.credits_per_semester1">
            {{ component.credits_per_semester1 }}
          </span>
          <span v-if="component.credits_per_semester2">
            {{ component.credits_per_semester2 }}
          </span>
          <span v-if="component.credits_per_semester3">
            {{ component.credits_per_semester3 }}
          </span>
          <span v-if="component.credits_per_semester4">
            {{ component.credits_per_semester4 }}
          </span>
          <span v-if="component.credits_per_semester5">
            {{ component.credits_per_semester5 }}
          </span>
          <span v-if="component.credits_per_semester6">
            {{ component.credits_per_semester6 }}
          </span>
          <span v-if="component.credits_per_semester7">
            {{ component.credits_per_semester7 }}
          </span>
          <span v-if="component.credits_per_semester8">
            {{ component.credits_per_semester8 }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-schema .grid-stack-item-content {
  height: 80%;
  border: 1px solid rgb(202, 202, 202);
}

.grid-schema .grid-stack-item__select {
  height: 100%;
  text-align: center;
}

.v-field__field {
  align-items: center;
}
.v-field__prepend-inner {
  align-items: center;
}

.grid-stack-item__edit-btn {
  position: absolute;
  top: 3px;
  right: 3px;
  z-index: 10000;
}
</style>
