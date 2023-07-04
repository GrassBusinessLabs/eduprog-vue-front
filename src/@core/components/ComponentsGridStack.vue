<script setup>
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import { ref, toRef, defineProps, watch, nextTick } from 'vue'
import { useEduProgsStore } from '@/stores/eduProgs.js'
const eduProgsStore = useEduProgsStore()
const props = defineProps({
  components: {
    type: Object,
    required: true,
    default: () => [],
  },
})
const componentsRef = toRef(props, 'components')
// const emit = defineEmits(['added', 'dragstart', 'resizestop', 'delete'])
const emit = defineEmits(['remove', 'changeOrder'])
const editIndex = {
  id: 0,
}
let grid
const gridref = ref(null)

function remove(comp) {
  emit('remove', comp)
}
watch(props, (newValue, oldValue) => {
  console.log(`Значение изменилось с ${oldValue} на ${newValue}`)
  nextTick(() => {
    grid.load(grid.getGridItems())
  })
})
const edit = comp => {
  editIndex.id = comp.id
}
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
  // grid.on('dragstop', function (event, el) {
  //   console.log('Ивент', event)
  //   console.log('El', el.gridstackNode)
  //   emit('changeOrder', el.gridstackNode.id, el.gridstackNode.y)
  // })
  grid.on('dragstop', function (event, newGrid) {
    console.log('GRID', grid.engine.nodes)
  })
})
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
      :gs-name="component.name"
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
        <div
          style="width: 10%"
          class="my-4 grid-stack-item-buttons"
        >
          <VBtn
            icon="mdi-pencil"
            size="x-small"
            style="margin-right: 2%"
            @click="edit(component)"
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

.grid-stack-item {
  width: 100% !important;
}
.grid-stack-item-buttons {
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
  width: 100% !important;
}
.grid-stack-item-content div {
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
