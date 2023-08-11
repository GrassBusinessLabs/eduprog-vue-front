<script setup>
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'
import { ref, toRef, defineProps, watch, nextTick, reactive } from 'vue'
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { useRoute } from 'vue-router'
const route = useRoute()
const eduProgsStore = useEduProgsStore()
const props = defineProps({
  components: {
    type: Object,
    required: true,
    default: () => [],
  },
})
const compError = reactive({
  status: false,
  message: '',
  credits: false,
  name: false,
})
const isLoading = ref(false)
const emit = defineEmits(['remove', 'changeOrder', 'saveComponent'])
const editIndex = reactive({
  id: 0,
  value: {},
})
let grid
const gridref = ref(null)
const control_types = ref(['залік', 'іспит'])

const rules = ref({
  min_num: [v => v >= 3 || 'Мінімум 3 кредити'],
})
watch(props, (newValue, oldValue) => {
  nextTick(() => {
    grid.load(grid.getGridItems())
  })
})
const edit = comp => {
  editIndex.id = comp.id
  editIndex.value = Object.assign({}, comp)
}
function remove(comp) {
  emit('remove', comp)
}
const cancel = comp => {
  editIndex.id = 0
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
    await eduProgsStore.editComponent(editIndex.id, editIndex.value)
    await eduProgsStore.fetchCreditsInfo(route.params.pages)
    await eduProgsStore.findEduProgById(route.params.pages)
    comp = editIndex.value
    editIndex.id = 0
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

  isLoading.value = false
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
    emit('changeOrder', el.gridstackNode.id, el.gridstackNode.y)
  })
})
</script>

<template>
  <v-snackbar v-model="compError.status">
    {{ compError.message }}

    <template v-slot:actions>
      <v-btn
        color="pink"
        icon="mdi-close-thick"
        @click="compError.status = false"
      >
      </v-btn>
    </template>
  </v-snackbar>
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
              :error="compError.name"
              class="pa-0"
              v-model="editIndex.value.name"
              variant="underlined"
              @keyup.enter="saveComponent(component)"
            />
          </span>
        </div>
        <div style="width: 10%">
          <span v-if="editIndex.id !== component.id"> {{ component.credits }}</span>
          <span v-if="editIndex.id === component.id">
            <VTextField
              :error="compError.credits"
              class="pa-0"
              v-model="editIndex.value.credits"
              variant="underlined"
              type="number"
              min="3"
              :rules='rules.min_num'
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
