<script setup>
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import { defineExpose, ref, toRef, defineProps, watch, nextTick} from 'vue'

const props =defineProps({
  components: {
    type: Object,
    required: true,
    default: () => [],
  },
})

const emit = defineEmits(['added', 'dragstart', 'delete','dropped'])

let grid
const gridref = ref(null)

watch(props.components, (newValue, oldValue) => {
  nextTick(()=>{
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
    console.log(gridref.value),
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
  <div
    ref="gridref"
    class="grid-stack"
  >
    <div
      v-for="component in props.components"
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


