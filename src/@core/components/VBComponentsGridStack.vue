<template>
  <thead class="VB-thead">
    <tr :class="[editIndexName.block_num === props.block.block_num ? 'active-comp-block' : '']">
      <th
        style="border-left: 2px solid rgba(41, 37, 45, 0.1); border-top: 2px solid rgba(41, 37, 45, 0.1)"
        colspan="4"
        class="text-center"
      >
        <span v-if="editIndexName.block_num !== props.block.block_num">
          <h3>{{ props.block.block_name }}</h3>
        </span>
        <span v-if="editIndexName.block_num === props.block.block_num">
          <VTextField
            v-model="editIndexName.block_name"
            class="vb-blocks-name"
            variant="plain"
            maxlength="100"
            :rules="rulesVB.length"
            @keyup.enter="saveBlockName(block)"
          />
        </span>
      </th>

      <th
        style="border-top: 2px solid rgba(41, 37, 45, 0.1); border-right:2px solid rgba(41, 37, 45, 0.1);
}"
      >
        <span v-if="editIndexName.block_num !== props.block.block_num">
          <VBtn
            icon="mdi-pencil"
            size="x-small"
            @click="editBlock(block)"
          />
        </span>
        <span v-else>
          <VBtn
            icon="mdi-check-bold"
            size="x-small"
            style="margin-right: 2%"
            :disabled="!block.block_name"
            @click="saveBlockName(block)"
          />
          <VBtn
            icon="mdi-close-thick"
            size="x-small"
            @click="cancelB(block)"
          />
        </span>
      </th>
    </tr>
  </thead>
  <tbody>
    <th colspan="5">
      <div
        ref="gridref"
        class="grid-stack"
      >
        <div
          v-for="component in props.block.comps_in_block"
          :key="component.id"
          class="grid-stack-item grid-stack-vb-item"
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
              {{ `ВБ ${component.block_num}.${component.code}` }}
            </div>
            <div style="width: 65%">
              <span v-if="editIndex.id !== component.id">
                {{ component.name }}
              </span>
              <span v-if="editIndex.id === component.id">
                <VTextField
                  v-model="editIndex.name"
                  :error="compError.name"
                  class="pa-0"
                  variant="underlined"
                  @keyup.enter="saveComponent(component)"
                />
              </span>
            </div>
            <div style="width: 10%">
              <span v-if="editIndex.id !== component.id"> {{ component.credits }}</span>
              <span v-if="editIndex.id === component.id">
                <VTextField
                  v-model="editIndex.credits"
                  :error="compError.credits"
                  class="pa-0"
                  variant="underlined"
                  type="number"
                  min="3"
                  :rules="rulesVB.min_num"
                  @keyup.enter="saveComponent(component)"
                />
              </span>
            </div>
            <div style="width: 10%">
              <span v-if="editIndex.id !== component.id">
                {{ component.control_type }}
              </span>
              <span v-if="editIndex.id === component.id">
                <VSelect
                  v-model="editIndex.control_type"
                  class="pa-0"
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
                  :loading="isLoading"
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
    </th>
  </tbody>
</template>

<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { GridStack } from 'gridstack'
import { nextTick, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const control_types = ref(['залік', 'іспит'])
const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['saveBlockName','update','dropped','dragstop','remove'])
let grid
const gridref = ref(null)
onMounted(() => {
  grid = GridStack.init(
    {
      float: false,
      column: 1,
      cellHeight: '65px',
      disableResize: true,
      acceptWidgets: '.grid-stack-vb-item',
      minRow: 1,
    },
    gridref.value,
  )
  grid.on('dropped', function (event, previousWidget, newWidget) {
    emit('dropped', [event, previousWidget, newWidget])
  })
  grid.on('dragstop', function (event, element) {
    emit('dragstop', [event, element])
  })
})

const eduProgsStore = useEduProgsStore()
const editIndexName = ref({})
const editIndex = ref({})
const rulesVB = ref({
  length: [v => v.length <= 99 || 'Максимум 100 символів', v => v.length >= 1 || 'Мінімум 1 символ'],
  min_num: [v => v >= 3 || 'Мінімум 3 кредити'],
})
watch(props, (newValue, oldValue) => {
  nextTick(() => {
    grid.load(grid.getGridItems())
  })
})
const compError = reactive({
  status: false,
  message: '',
  credits: false,
  name: false,
})
const isLoading = ref(false)

const edit = component => {
  editIndex.value = JSON.parse(JSON.stringify(component))
  console.log(editIndex.value)
}

function editBlock(item) {
  editIndexName.value = JSON.parse(JSON.stringify(item))
}

function cancelB(item) {
  editIndexName.value.block_num = null
}

const saveBlockName = async block => {
  if (editIndexName.value.block_name.length === 0) {
    return
  }
  emit('saveBlockName', editIndexName.value)
  editIndexName.value.block_num = null
}
function remove(comp) {
  emit('remove', comp)
}
const cancel = comp => {
  editIndex.value.id = 0
  editIndex.value = {}
}
const saveComponent = async comp => {
  if (!editIndex.value.name.length) {
    compError.message = 'Назва компоненту не може бути порожньою'
    compError.status = true
    compError.name = true
    
    return
  }
  if (editIndex.value.credits <= 2){

    return
  }
  isLoading.value = true
  try {

    console.log(editIndex.value)
    await eduProgsStore.editComponent(comp.id, editIndex.value)
    await eduProgsStore.fetchCreditsInfo(route.params.pages)
    await eduProgsStore.findEduProgById(route.params.pages)
    comp = editIndex.value
    editIndex.value = {}
    compError.name = false
    compError.credits = false
  } catch (error) {
    console.log(error.response.data.error)
    const errMessage = error.response.data.error
    switch (errMessage) {
    case 'eduprog component with this name already exists':
      compError.message = 'Компонент з такою назвою вже існує'
      compError.name = true
      break
    case 'too much credits':
      compError.message = 'Забагато кредитів'
      compError.credits = true
      break
    }
    if (!compError.message.length) {
      compError.message = 'Щось пішло не так'
    }
    compError.status = true
  }
  emit('update','update')
  isLoading.value = false
}

// async function closeEdit(e) {
//   if (
//     (e && e.target.closest('.active-comp-block')) ||
//     e.target.closest('.active-component') ||
//     e.target.closest('button') ||
//     e.target.closest('.v-list-item-title')
//   ) {
//     return
//   }
//   await eduProgsStore.fetchVBblock(route.params.pages)
//   VBblock.value = eduProgsStore.getVBblock
//   editIndex.value.id = null
//   window.removeEventListener('click', closeEdit)
// }
</script>

<style scoped>
.ui-droppable {
  border-right: 2px solid rgba(41, 37, 45, 0.1);
  border-left: 2px solid rgba(41, 37, 45, 0.1);
}

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
