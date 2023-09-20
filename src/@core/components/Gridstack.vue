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
  update: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['added', 'dragstart', 'resizestop', 'delete', 'change'])

const GRID_COLUMN = 8
const GRID_MIN_ROW = 1

let grid
const gridref = ref(null)
const hoveredWidget = ref(null)
const gridItems = ref()

watch(props, (newValue, oldValue) => {
  gridItems.value = props.gridItems
  gridItems.value.forEach(item => item.eduprogcomp.name = UpperCase(item.eduprogcomp.name))
  nextTick(() => {
    grid.load(grid.getGridItems())
  })
})

onMounted(() => {
  grid = GridStack.init(
    {
      cellHeight: '90px',
      float: false,
      column: GRID_COLUMN,
      minRow: GRID_MIN_ROW,
      acceptWidgets: '.grid-stack-item',
      disableOneColumnMode: true,
      resizable: {
        handles: 'e,w',
      },
    },
    gridref.value,
  )

  grid.on('added', function(event, items) {
    emit('added', [event, items])

    const extraArray = grid.getGridItems().filter(object => !props.gridItems.find(firstObject => firstObject.id === object.gridstackNode.id))

    extraArray.forEach(object => {
      grid.removeWidget(object, true)
    })

  })

  grid.on('dragstart', function(event, items) {
    emit('dragstart', [event, items])
  })

  grid.on('dragstop', (event, element) => {
    emit('dragstop', [event, element])
  })

  grid.on('change', function(event, items) {
    emit('change', [event, items])
  })

  grid.on('resizestop', function(event, items) {
    emit('resizestop', [event, items])
  })
  grid.on('dropped', function(event, previousWidget, newWidget) {
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
  grid.load(grid.getGridItems())
}

const isAreaEmpty = () => {
  let sumNodeWidth = 0
  grid.getGridItems().map(item => (sumNodeWidth += item.gridstackNode.w))

  return sumNodeWidth < GRID_COLUMN
}

const getGridNodes = () => {
  return grid.getGridItems()
}

function editWidget(component) {
  grid.load(grid.getGridItems())
}

function UpperCase(item) {
  item = item.split(' ').map(word => {
    if (word.length <= 2) {
      return word
    } else if (word.match(/\(/g)) {
      word = word.slice(0, 1) + word[1].toUpperCase() + word.slice(2)

      return word.replace(/[а-ї'" "]/g, '')
    } else if (word.indexOf('-') !== -1) {
      const index = word.indexOf('-')
      const secondCharacter = word[index + 1]
      const upperCaseSecondCharacter = secondCharacter.toUpperCase()
      word = word.slice(0, index) + '-' + upperCaseSecondCharacter + word.slice(index + 2)

      return word.replace(/[а-ї'" "]/g, '')

    } else {
      word = word.charAt(0).toUpperCase() + word.slice(1)

      return word.replace(/[а-ї'" "]/g, '')
    }
  }).join('')

  return item
}

function maxRow(credits) {
  const sum = credits / 3
  if (sum <= 8) {
    return sum
  } else {
    return 8
  }
}

defineExpose({ createWidget, isAreaEmpty, getGridNodes, deleteGridComponent })
</script>

<template>
  <div
    ref='gridref'
    class='grid-stack grid-schema'
    @click='editWidget'
  >
    <div
      v-for='item in props.gridItems'
      :key='item.w'
      class='grid-stack-item rounded-lg'
      :gs-id='item.id'
      :gs-x='item.x'
      :gs-y='item.y'
      :gs-h='item.h'
      :gs-w='item.w'
      :gs-max-w='maxRow(item.eduprogcomp.credits)'
      @mouseover='mouseover(item.id)'
      @mouseleave='mouseleave'
    >
      <VBtn
        v-show='hoveredWidget === item.id'
        v-bind='props'
        class='grid-stack-item__edit-btn'
        density='compact'
        icon='mdi-trash-can'
        @click='deleteGridComponent(item)'
      />

      <!--      <VMenu -->
      <!--        activator="parent" -->
      <!--        location="top" -->
      <!--      > -->
      <!--        <template #activator="{ props }"> -->
      <!--          <VBtn -->
      <!--            v-show="hoveredWidget === component.id" -->
      <!--            v-bind="props" -->
      <!--            class="grid-stack-item__edit-btn" -->
      <!--            density="compact" -->
      <!--            icon="mdi-dots-horizontal" -->
      <!--          /> -->
      <!--        </template> -->
      <!--        <VCol style='max-width: 150px'> -->
      <!--          <VList> -->
      <!--            <VListItem @click="deleteGridComponent(component)"> -->
      <!--              Remove -->
      <!--            </VListItem> -->
      <!--            <VListItem @click="editWidget(component)"> -->
      <!--              Edit -->
      <!--            </VListItem> -->
      <!--          </VList> -->
      <!--        </VCol> -->
      <!--      </VMenu> -->


      <div class='justify-center rounded-lg grid-stack-item-content text-center d-flex flex-column'>
        <span class='text-body-2 mb-1'>
          {{item.eduprogcomp.name}}
          <VTooltip
            activator='parent'
            location='top'
          >
            {{ item.name }}
          </VTooltip>
        </span>
        <div class='d-flex justify-space-around text-body-2 w-100'>
          <span v-if='item.credits_per_semester1'>
            {{ item.credits_per_semester1 }}
          </span>
          <span v-if='item.credits_per_semester2'>
            {{ item.credits_per_semester2 }}
          </span>
          <span v-if='item.credits_per_semester3'>
            {{ item.credits_per_semester3 }}
          </span>
          <span v-if='item.credits_per_semester4'>
            {{ item.credits_per_semester4 }}
          </span>
          <span v-if='item.credits_per_semester5'>
            {{ item.credits_per_semester5 }}
          </span>
          <span v-if='item.credits_per_semester6'>
            {{ item.credits_per_semester6 }}
          </span>
          <span v-if='item.credits_per_semester7'>
            {{ item.credits_per_semester7 }}
          </span>
          <span v-if='item.credits_per_semester8'>
            {{ item.credits_per_semester8 }}
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

.grid-stack-item-content {
  cursor: grab;
}

:active {
  cursor: grabbing;
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
