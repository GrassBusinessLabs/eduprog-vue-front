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

const emit = defineEmits(['added', 'dragstart', 'resizestop', 'delete'])

let grid
const gridref = ref(null)

watch(props, (newValue, oldValue) => {
  console.log(`Значение изменилось с ${oldValue} на ${newValue}`)
  nextTick(()=>{
    grid.load(grid.getGridItems())
  })
})

const GRID_COLUMN = 20
const GRID_MIN_ROW = 1


onMounted(() => {
  grid = GridStack.init(
    {
      float: false,
      column: GRID_COLUMN,
      minRow: GRID_MIN_ROW,
      acceptWidgets: '.grid-stack-item',
      dragIn: '.grid-stack',
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

  grid.on('resizestop', function(event, items) {
    emit('resizestop', [event, items])
  })
})
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
      :gs-x="0"
      :gs-y="component.code - 1"
      :gs-h="1"
      :gs-w="1"
    >
      <div
        class="grid-stack-item-content"
        style="overflow: hidden"
      >
        <div style="width: 65%">
          {{ component.name }}
        </div>
        <div style="width: 10%">
          {{ component.credits }}
        </div>
      </div>
    </div>
  </div>
</template>


