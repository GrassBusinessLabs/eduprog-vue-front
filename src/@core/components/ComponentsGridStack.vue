<script setup>
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import { ref, toRef, defineProps, watch, nextTick, reactive } from 'vue'
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
const emit = defineEmits(['remove', 'changeOrder', 'saveComponent'])
const editIndex = reactive({
  id: 0,
  value: {},
})
let grid
const gridref = ref(null)
const control_types = ref(['залік', 'іспит'])

watch(props, (newValue, oldValue) => {
  console.log(`Значение изменилось с ${oldValue} на ${newValue}`)
  nextTick(() => {
    grid.load(grid.getGridItems())
  })
})
const edit = comp => {
  console.log(comp)
  editIndex.id = comp.id
  editIndex.value = Object.assign({}, comp)
}
function remove(comp) {
  emit('remove', comp)
}
const cancel = comp => {
  console.log(comp)
  editIndex.id = 0
  editIndex.value = {}
}
const saveComponent = comp => {
  emit('saveComponent', editIndex)
  console.log(comp.value)
  comp.value = editIndex.value
  // editIndex.id = 0
  // editIndex.value = {}
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
  grid.on('dragstop', function (event, el) {
    console.log('ЕЛЕМЕНТ', el.gridstackNode.id, el.gridstackNode.y)
    emit('changeOrder', el.gridstackNode.id, el.gridstackNode.y)
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
          <span v-if="editIndex.id !== component.id">
            {{ component.name }}
          </span>
          <span v-if="editIndex.id === component.id">
            <VTextField
              class="pa-0"
              v-model="editIndex.value.name"
              variant="underlined"
              @keyup.enter="saveComponent(comp)"
            />
          </span>
        </div>
        <div style="width: 10%">
          <span v-if="editIndex.id !== component.id"> {{ component.credits }}</span>
          <span v-if="editIndex.id === component.id">
            <VTextField
              class="pa-0"
              v-model="editIndex.value.credits"
              variant="underlined"
              type="number"
              min="1"
              @keyup.enter="saveComponent(component)"
              @focus="resetError"
            />
          </span>
        </div>
        <div style="width: 10%">
          <span v-if="editIndex.id !== component.id">
            {{ component.control_type }}
          </span>
          <span v-if="editIndex.id === component.id">
            <VSelect
              class="pa-0"
              v-model="editIndex.value.control_type"
              variant="underlined"
              :items="control_types"
              @keyup.enter="saveComponent(component)"
            />
          </span>
        </div>
        <div
          style="width: 10%"
          class="my-4"
        >
          <span
            v-if="editIndex.id !== component.id"
            class="d-flex"
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
          </span>
          <span v-else>
            <VBtn
              icon="mdi-check-bold"
              size="x-small"
              style="margin-right: 2%"
              @click="saveComponent(component)"
            />
            <VBtn
              icon="mdi-close-thick"
              size="x-small"
              @click="cancel(component)"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-stack {
  display: flex;
  width: 100%;
}

.grid-stack-item {
  width: 100% !important;
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
