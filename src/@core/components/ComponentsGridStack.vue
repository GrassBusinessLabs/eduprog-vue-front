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
const componentsRef =toRef(props, 'components');
// const emit = defineEmits(['added', 'dragstart', 'resizestop', 'delete'])
const emit = defineEmits(['remove'])
const editIndex = {
  id: 0,
}
let grid
const gridref = ref(null)

function remove(comp) {
  emit('remove', comp)
}
watch(props, (newValue, oldValue) => {
  console.log(`Значение изменилось с ${oldValue} на ${newValue}`);
  nextTick(()=>{
    grid.load(grid.getGridItems())
  })
});

onMounted(() => {
  grid = GridStack.init(
    {
      float: false,
      column: 1,
      cellHeight: '65px',
      disableResize: true,
    },
    gridref.value,
  )
  console.log("ПРООПСЫ",componentsRef.value)
  // grid.on('added', function(event, items) {
  //   emit('added', [event, items])
  // })

  // grid.on('dragstart', function(event, items) {
  //   emit('dragstart', [event, items])
  // })

  // grid.on('dragstop', (event, element) => {
  //   console.log('move event!', event, element)
  // })

  // grid.on('resizestop', function(event, items) {
  //   emit('resizestop', [event, items])
  // })
})

// function mouseleave() {
//   hoveredWidget.value = null
// }

// function mouseover(idWidget) {
//   hoveredWidget.value = idWidget
// }
// function deleteComponent(idWidget) {
//   const foundWidget = grid.getGridItems()
//     .find(item => item.gridstackNode.id.toString() === idWidget.toString())
//   if (foundWidget) {
//     grid.removeWidget(foundWidget, true)
//   }
// }

// const createWidget = idWidget => {
//   nextTick(() => {
//     grid.load(grid.getGridItems())
//   })
// }

// const isAreaEmpty = () => {
//   let sumNodeWidth = 0
//   grid.getGridItems().map(item => (sumNodeWidth += item.gridstackNode.w))

//   return sumNodeWidth < GRID_COLUMN
// }

// const getGridNodes = () => {
//   return grid.getGridItems()
// }

//defineExpose({ createWidget, isAreaEmpty, getGridNodes })
</script>

<template>
  <div
    ref="gridref"
    class="grid-stack"
  >
    <div
      v-for="component in props.components.mandatory"
      :key="component.id"
      class="grid-stack-item"
      :gs-id="component.id"
      :gs-x="0"
      :gs-y="component.code - 1"
      :gs-h="1"
      :gs-w="1"
      
    >
      <div class="grid-stack-item-content" style="overflow: hidden">
        <div style="width: 5%; white-space: nowrap">
          {{ 'OK ' + component.code }}
        </div>
        <div style="width: 65%">
          {{ component.name }}
        </div>
        <div style="width: 10%">
          {{ component.credits }}
        </div>
        <div style="width: 10%">
          {{ component.control_type }}
        </div>
        <div style="width: 10%" class="my-4 grid-stack-item-buttons">
          <VBtn
            icon="mdi-pencil"
            size="x-small"
            style="margin-right: 2%"
            @click="edit(item)"
          />
          <VBtn
            icon="mdi-trash-can"
            size="x-small"
            @click="remove(component)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.grid-stack {
  display: flex;
  width: 100%;
}

.grid-stack-item{
  width: 100% !important;
} 
.grid-stack-item-buttons{
  display: flex;
}
.grid-stack-item-content {
  display: flex;
  align-items: center;
  font-weight: normal;
  font-size: 14px;
  border-bottom: 1px solid rgb(202, 202, 202);
  top: 0 !important;
  left: 0 !important;
  height: 100%;
  width: 100% !important}
.grid-stack-item-content div{
  text-align: left;
  padding: 0 16px;
}
.v-field__field {
  align-items: center;
}

.v-field__prepend-inner {
  align-items: center;
}
</style>
