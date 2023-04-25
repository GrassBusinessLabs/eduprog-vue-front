<template>
  <!-- Основний компонент -->
  <VTable>
    <thead class="thead-light">
      <tr>
        <th class="text-center">
          <h3>Основний компонент ОП</h3>
        </th>
        <th />
      </tr>
    </thead>
  </VTable>
  <VTable v-if="components && components.mandatory">
    <thead class="thead-light">
      <tr>
        <th style="width: 5%">
          Код <br />
          н/д
        </th>
        <th>
          Компонент освітньої <br />
          програми
        </th>
        <th style="width: 10%">
          Кількість <br />
          кредитів
        </th>
        <th style="width: 10%">
          Форма підсумку <br />
          контролю
        </th>
        <th style="width: 10%">
          <VBtn
            icon="mdi-plus"
            size="x-small"
            @click="changeDialog('ОК')"
          />
        </th>
      </tr>
    </thead>
    <!--<tbody>
    <tr
        v-for="(item, index) in components.mandatory"
        :key="index"
        style="height: 65px"
        :class="[editIndex.id === item.id ? 'active-component' : '']"
      >
        <td style="white-space: nowrap">
          {{ 'ОК ' + item.code }}
        </td>
        <td>
          <span v-if="editIndex.id !== item.id">
            {{ item.name }}
          </span>
          <span v-if="editIndex.id === item.id">
            <VTextField
              v-model="item.name"
              variant="underlined"
              :rules="rulesComp.nameComp"
              :error="NameError"
              :error-messages="errorName"
              @keyup.enter="saveComponent(item)"
            />
          </span>
        </td>
        <td>
          <span v-if="editIndex.id !== item.id"> {{ item.credits }}</span>
          <span v-if="editIndex.id === item.id">
            <VTextField
              v-model="item.credits"
              variant="underlined"
              type="number"
              min="1"
              :error="hasError"
              :error-messages="errorMessage"
              :rules="rulesComp.credits"
              @keyup.enter="saveComponent(item)"
              @focus="resetError"
            />
          </span>
        </td>
        <td>
          <span v-if="editIndex.id !== item.id">
            {{ item.control_type }}
          </span>
          <span v-if="editIndex.id === item.id">
            <VSelect
              v-model="item.control_type"
              variant="underlined"
              :items="control_types"
              :rules="rulesComp.typeExam"
              @keyup.enter="saveComponent(comp)"
            />
          </span>
        </td>
        <td>
          <span
            v-if="editIndex.id !== item.id"
            class="my-4"
          >
            <VBtn
              icon="mdi-pencil"
              size="x-small"
              style="margin-right: 2%"
              @click="edit(item)"
            />
            <VBtn
              icon="mdi-trash-can"
              size="x-small"
              @click="remove(item, 'mandatory')"
            />
          </span>
          <span v-else>
            <VBtn
              icon="mdi-check-bold"
              size="x-small"
              style="margin-right: 2%"
              @click="saveComponent(item)"
            />
            <VBtn
              icon="mdi-close-thick"
              size="x-small"
              @click="cancel(item)"
            />
          </span>
        </td>
      </tr>
      <hr style="border: 0px">
    </tbody> -->
    <tbody>
      <th colspan="5">
        <ComponentsGridStack
          @remove="remove"
          :components="components"
        ></ComponentsGridStack>
      </th>
    </tbody>
    <thead>
      <tr>
        <th colspan="5">
          Загальний обсяг обов’язкових компонентів:
          {{ creditsInfo.mandatory_credits }}/
          {{ creditsInfo.mandatory_credits + creditsInfo.mandatory_free_credits }}
        </th>
      </tr>
    </thead>
  </VTable>
  <!-- Вибіркові компоненти -->
  <VTable>
    <thead class="thead-light">
      <tr>
        <th class="text-center">
          <h3>Вибірковий компонент ОП</h3>
        </th>
        <th style="width: 10%" />
      </tr>
    </thead>
  </VTable>
  <VTable class="table-vb-blocks">
    <thead class="thead-light">
      <tr>
        <th style="width: 5%">
          Код <br />
          н/д
        </th>
        <th>
          Компонент освітньої <br />
          програми
        </th>
        <th style="width: 10%">
          Кількість <br />
          кредитів
        </th>
        <th style="width: 10%">
          Форма підсумку <br />
          контролю
        </th>
        <th style="width: 10%">
          <VBtn
            icon="mdi-plus"
            size="x-small"
            @click="changeDialog('ВБ')"
          />
        </th>
      </tr>
    </thead>
    <tbody
      v-for="(block, index) in VBblock"
      :key="'block-' + index"
    >
      <tr :class="[editIndex.id === block.block_num ? 'active-comp-block' : '']">
        <th
          colspan="4"
          class="text-center"
        >
          <span v-if="editIndex.id !== block.block_num">
            <h3>{{ block.block_name }}</h3>
          </span>
          <span v-if="editIndex.id === block.block_num">
            <VTextField
              v-model="block.block_name"
              :rules="rulesVB.maxLength"
              class="vb-blocks-name"
              variant="plain"
              maxlength="100"
              @keyup.enter="saveBlockName(block)"
            />
          </span>
        </th>

        <th>
          <span v-if="editIndex.id !== block.block_num">
            <VBtn
              icon="mdi-pencil"
              size="x-small"
              @click="edit(block, 'Block')"
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
              @click="cancel(block)"
            />
          </span>
        </th>
      </tr>
      <tr
        v-for="(comp, compIndex) in block.comps_in_block"
        :key="'comp-' + compIndex"
        style="height: 65px"
        :class="[editIndex.id === comp.id ? 'active-component' : '']"
      >
        <td style="white-space: nowrap">
          {{ 'ВБ ' + comp.block_num + '.' + comp.code }}
        </td>
        <td>
          <span v-if="editIndex.id !== comp.id">
            {{ comp.name }}
          </span>
          <span
            v-if="editIndex.id === comp.id"
            style="display: flex; align-items: center"
          >
            <VTextField
              v-model="comp.name"
              variant="underlined"
              :rules="rulesComp.nameComp"
              :error="NameError"
              :error-messages="errorName"
              style="width: 50%"
              @keyup.enter="saveComponent(comp)"
            />

            <VCombobox
              v-model="comp.block_name"
              :items="VBblock"
              item-title="block_name"
              variant="underlined"
              style="width: 60%; margin-left: 20%; margin-right: 20%; font-size: 14px"
              @keyup.enter="saveComponent(comp)"
            />
          </span>
        </td>
        <td>
          <span v-if="editIndex.id !== comp.id"> {{ comp.credits }}</span>
          <span v-if="editIndex.id === comp.id">
            <VTextField
              v-model="comp.credits"
              variant="underlined"
              type="number"
              :error="hasError"
              :error-messages="errorMessage"
              :rules="rulesComp.credits"
              min="1"
              @keyup.enter="saveComponent(comp)"
              @focus="resetError"
            />
          </span>
        </td>
        <td>
          <span v-if="editIndex.id !== comp.id">
            {{ comp.control_type }}
          </span>
          <span v-if="editIndex.id === comp.id">
            <VSelect
              v-model="comp.control_type"
              variant="underlined"
              :items="control_types"
              :rules="rulesComp.typeExam"
              @keyup.enter="saveComponent(comp)"
            />
          </span>
        </td>
        <td>
          <span v-if="editIndex.id !== comp.id">
            <VBtn
              icon="mdi-pencil"
              size="x-small"
              style="margin-right: 2%"
              @click="edit(comp)"
            />
            <VBtn
              icon="mdi-trash-can"
              size="x-small"
              @click="remove(comp, 'selective')"
            />
          </span>
          <span v-else>
            <VBtn
              icon="mdi-check-bold"
              size="x-small"
              style="margin-right: 2%"
              @click="saveComponent(comp)"
            />
            <VBtn
              icon="mdi-close-thick"
              size="x-small"
              @click="cancel(comp)"
            />
          </span>
        </td>
      </tr>
      <hr style="border: 0px" />
    </tbody>
  </VTable>
  <VTable>
    <thead>
      <tr>
        <th colspan="5">
          Загальний обсяг вибіркових компонентів:
          {{ creditsInfo.selective_credits }}/
          {{ creditsInfo.selective_credits + creditsInfo.selective_free_credits }}
        </th>
      </tr>
    </thead>
  </VTable>
  <VDialog
    v-model="dialogCreate"
    max-width="600"
  >
    <VCard>
      <VCardTitle>Створити новий обов’язковий компонент</VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="newComponent.name"
                label="Назва компонента"
                required
                :rules="rulesComp.nameComp"
                :error="NameError"
                :error-messages="errorName"
                @input="check"
                @focus="resetErrorN"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="newComponent.credits"
                type="number"
                min="1"
                label="Кількість кредитів"
                :rules="rulesComp.credits"
                :error="hasError"
                :error-messages="errorMessage"
                @focus="resetError"
                @input="validateCredits"
              />
            </VCol>
            <VCol cols="12">
              <VSelect
                v-model="newComponent.control_type"
                label="Форма підсумку контролю"
                :items="control_types"
                :rules="rulesComp.typeExam"
              />
            </VCol>
          </VRow>
        </VContainer>

        <VCardActions>
          <VSpacer />
          <VBtn
            text
            @click="changeDialog('ОК')"
          >
            Відмінити
          </VBtn>
          <VBtn
            text
            :disabled="!(newComponent.name && newComponent.credits && newComponent.control_type)"
            @click="createComponent"
          >
            Зберегти
          </VBtn>
        </VCardActions>
      </VCardText>
    </VCard>
  </VDialog>
  <VDialog
    v-model="dialogCreateSelective"
    max-width="600"
  >
    <VCard>
      <VCardTitle>Створити новий вибірковий компонент</VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="newComponent.name"
                label="Назва компонента"
                required
                :rules="rulesComp.nameComp"
                :error="NameError"
                :error-messages="errorName"
                @focus="resetErrorN"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="newComponent.credits"
                type="number"
                min="1"
                label="Кількість кредитів"
                :rules="rulesComp.credits"
                :error="hasError"
                :error-messages="errorMessage"
                @focus="resetError"
              />
            </VCol>
            <VCol cols="12">
              <VSelect
                v-model="newComponent.control_type"
                label="Форма підсумку контролю"
                :items="control_types"
                :rules="rulesComp.typeExam"
              />
            </VCol>
            <VCol cols="12">
              <VCombobox
                v-model="newComponent.block_name"
                :items="VBblock"
                item-title="block_name"
                item-value="block_num"
                label="Назва блоку компонента"
                :rules="rulesComp.nameComp"
                outlined
                dense
              />
            </VCol>
          </VRow>
        </VContainer>

        <VCardActions>
          <VSpacer />
          <VBtn
            text
            @click="changeDialog('ВБ')"
          >
            Відмінити
          </VBtn>
          <VBtn
            text
            :disabled="
              !(newComponent.name && newComponent.credits && newComponent.control_type && newComponent.block_name)
            "
            @click="createComponent"
          >
            Зберегти
          </VBtn>
        </VCardActions>
      </VCardText>
    </VCard>
  </VDialog>

  <VDialog
    v-model="dialogDelete"
    max-width="600"
  >
    <VCard>
      <VCardTitle> Підтвердіть видалення </VCardTitle>
      <VCardText> Ви впевнені що хочете видалити компонент: {{ originValue.name }}? </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn
          color="green darken-1"
          text
          @click="dialogDelete = false"
        >
          Ні
        </VBtn>

        <VBtn
          color="green darken-1"
          text
          @click="confirmRemove"
        >
          Так
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { editData } from '@/api/http/apiService'
import { storeToRefs } from 'pinia'
import ComponentsGridStack from '@core/components/ComponentsGridStack.vue'
onMounted(async () => {
  await eduProgsStore.findEduProgById(route.params.pages)
  await eduProgsStore.fetchVBblock(route.params.pages)
  VBblock.value = eduProgsStore.getVBblock
})
const route = useRoute()
const eduProgsStore = useEduProgsStore()

const { components, creditsInfo } = storeToRefs(eduProgsStore)
const VBblock = ref()
const dialogDelete = ref(false)
const editIndex = ref({})
let originValue = {}
const dialogCreate = ref(false)
const dialogCreateSelective = ref(false)
const newComponent = reactive({
  name: '',
  credits: 0,
  control_type: '',
  type: '',
  sub_type: 'н/д',
  category: 'н/д',
  block_name: '',
  block_num: '',
  eduprog_id: +route.params.pages,
})
const control_types = ['залік', 'іспит']
const rulesComp = ref({
  nameComp: [
    value => {
      if (value) return true

      return 'Введіть назвву'
    },
  ],
  credits: [
    value => {
      if (value) return true

      return 'Введіть кредити'
    },
  ],
  typeExam: [
    value => {
      if (value) return true

      return 'Введіть форму підсумку контролю'
    },
  ],
})
const rulesVB = ref({
  maxLength: [v => v.length <= 99 || 'Максимум 100 символів', v => v.length >= 1 || 'Мінімум 1 символ'],
})
const hasError = ref(false)
const errorMessage = ref('')
const NameError = ref(false)
const errorName = ref('')

function updateSelectedBlockNum() {
  const selectedBlock = VBblock.value.find(block => block.block_name === newComponent.block_name)
  if (selectedBlock) {
    newComponent.block_num = String(selectedBlock.block_num)
  } else if (VBblock.value.length === 0) {
    newComponent.block_num = String(1)
  } else {
    const maxBlockNum = Math.max(...VBblock.value.map(block => block.block_num))
    newComponent.block_num = String(maxBlockNum + 1)
  }
}

function resetError() {
  hasError.value = false
  errorMessage.value = ''
}

function resetErrorN() {
  NameError.value = false
  errorName.value = ''
}

function changeDialog(type) {
  if (type == 'ОК') {
    dialogCreate.value = !dialogCreate.value
  } else if (type == 'ВБ') {
    dialogCreateSelective.value = !dialogCreateSelective.value
  }
  resetError()
  resetErrorN()
  setTimeout(() => {
    newComponent.name = ''
    newComponent.credits = 0
    newComponent.control_type = ''
    newComponent.block_name = ''
    newComponent.block_num = ''
  }, 500)
}

async function updateCredits() {
  await eduProgsStore.fetchCreditsInfo(route.params.pages)
  creditsInfo.value = eduProgsStore.getCreditsInfo
  await eduProgsStore.fetchVBblock(route.params.pages)
  VBblock.value = eduProgsStore.getVBblock
}
async function createComponent() {
  updateSelectedBlockNum()
  console.log(newComponent.block_name, newComponent.block_num)
  const createdComponent = Object.assign({}, newComponent)
  if (dialogCreate.value) {
    createdComponent.type = 'ОК'
    try {
      console.log(createdComponent)
      const response = await eduProgsStore.createComponent(createdComponent)
      createdComponent.id = response.id
      createdComponent.code = response.code
      console.log('Компонент', createdComponent)
      components.value.mandatory.push(createdComponent)
      dialogCreate.value = false
    } catch (error) {
      const errorFromServer = error.response.data.error
      if (errorFromServer === 'eduprog component with this name already exists') {
        errorName.value = 'Компонент з такою назвою вже існує'
        NameError.value = true
      } else {
        errorMessage.value = 'Забагато кредитів'
        hasError.value = true
      }

      return
    }
  } else if (dialogCreateSelective.value) {
    console.log(createdComponent)
    createdComponent.type = 'ВБ'
    if (components.value.selective.length) {
      createdComponent.code = String(+components.value.selective[components.value.selective.length - 1].code + 1)
    } else {
      createdComponent.code = '1'
    }
    try {
      console.log(createdComponent)
      createdComponent.id = await eduProgsStore.createComponent(createdComponent)
      components.value.selective.push(createdComponent)
      dialogCreateSelective.value = false
    } catch (error) {
      const errorFromServer = error.response.data.error
      if (errorFromServer === 'eduprog component with this name already exists') {
        errorName.value = 'Компонент з такою назвою вже існує'
        NameError.value = true
      } else {
        errorMessage.value = 'Забагато кредитів'
        hasError.value = true
      }

      return
    }
  }
  setTimeout(() => {
    newComponent.name = ''
    newComponent.credits = 0
    newComponent.control_type = ''
    newComponent.block_name = ''
    newComponent.block_num = ''
  }, 500)
  await updateCredits()
}

function edit(item, type = 'Component') {
  console.log(item)
  originValue = Object.assign({}, item)
  if (type === 'Block') {
    editIndex.value.id = item.block_num
    editIndex.value.category = 'BLOCK'
    window.addEventListener('click', closeEdit)
  } else if (type === 'Component') {
    editIndex.value.id = item.id
    editIndex.value.category = item.category
    window.addEventListener('click', closeEdit)
  }
}
function cancel(item) {
  editIndex.value.id = null
  for (let key in item) {
    item[key] = originValue[key]
  }
  originValue = {}
  window.removeEventListener('click', closeEdit)
}
async function closeEdit(e) {
  console.log('клик')
  if (
    (e && e.target.closest('.active-comp-block')) ||
    e.target.closest('.active-component') ||
    e.target.closest('button') ||
    e.target.closest('.v-list-item-title')
  ) {
    return
  }
  if (editIndex.value.category === 'BLOCK') {
    console.log('dfgdfgdf')
    await eduProgsStore.fetchVBblock(route.params.pages)
    VBblock.value = eduProgsStore.getVBblock
    editIndex.value.id = null
    window.removeEventListener('click', closeEdit)
  } else {
    console.log('че то делаем')
    const originData = await eduProgsStore.findCompById(editIndex.value.id)
    let foundComponent = {}
    switch (editIndex.value.category) {
      case 'MANDATORY':
        foundComponent = components.value.mandatory.find(item => item.id === editIndex.value.id)
        break
      case 'BLOC':
        foundComponent = findObjectById(editIndex.value.id, VBblock.value)
        console.log(foundComponent)
        break
    }
    console.log('ФАУГНД', foundComponent)
    for (let key in foundComponent) {
      foundComponent[key] = originData[key]
    }
    console.log(originData)
    editIndex.value.id = null
    window.removeEventListener('click', closeEdit)
  }
}

function findObjectById(id, arrayOfObjects) {
  for (let i = 0; i < arrayOfObjects.length; i++) {
    const object = arrayOfObjects[i]
    const result = object.comps_in_block.find(comp => comp.id === id)
    if (result) {
      return result
    }
  }

  return null
}

function remove(comp) {
  dialogDelete.value = true
  originValue = Object.assign({}, comp)
  console.log('ОРИДЖИ?', originValue.id)
}
const confirmRemove = async () => {
  console.log(originValue)
  dialogDelete.value = false
  await eduProgsStore.deleteComponent(originValue)
  let type = 'mandatory'
  if (originValue.category === 'BLOC') {
    type = 'selective'
  }
  components.value[type] = components.value[type].filter(obj => obj.id !== originValue.id)
  updateCredits()
  await eduProgsStore.findEduProgById(route.params.pages)
  originValue = {}
}

function editVBcomp(component) {
  const selectedBlock = VBblock.value.find(block => block.block_name === component.block_name)
  console.log(selectedBlock)
  if (selectedBlock) {
    component.block_num = String(selectedBlock.block_num)
    const maxVBNum = Math.max(...selectedBlock.comps_in_block.map(block => block.block_num))
    console.log(maxVBNum)
    component.code = String(maxVBNum + 1)
    console.log(component.code)
    console.log(component)
  } else {
    const maxBlockNum = Math.max(...VBblock.value.map(block => block.block_num))
    component.block_num = String(maxBlockNum + 1)
    component.code = String(1)
    console.log(component)
    console.log(component.code)
  }
}

async function saveComponent(component) {
  editVBcomp(component)
  try {
    console.log(component)
    await eduProgsStore.editComponent(component.id, component)
    updateCredits()
    editIndex.value.id = null
  } catch (error) {
    const errorFromServer = error.response.data.error
    if (errorFromServer === 'eduprog component with this name already exists') {
      errorName.value = 'Компонент з такою назвою вже існує'
      NameError.value = true
    } else {
      errorMessage.value = 'Забагато кредитів'
      hasError.value = true
    }

    return
  }
  window.removeEventListener('click', closeEdit)
  originValue = {}
}
const saveBlockName = async block => {
  if (block.block_name.length === 0) {
    return
  }
  editIndex.value.id = null
  console.log('Блок', block)
  await eduProgsStore.updateVbBlockName(route.params.pages, block.block_num, block.block_name)
  await eduProgsStore.fetchVBblock(route.params.pages)
  VBblock.value = eduProgsStore.getVBblock
  originValue = {}
}
</script>

<style>
.eduprog-item {
  cursor: pointer;
}
input.v-field__input,
.v-select__selection-text {
  font-size: 0.875rem;
}
tr td .v-field__input {
  padding: 0 !important;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}
tr td span.v-select__selection-text {
  display: flex;
  align-items: center;
}
.table-vb-blocks table tbody {
  border-top: 1px solid rgb(58, 53, 65, 0.12);
}
.vb-blocks-name .v-field__input {
  text-align: center;
  padding: 0;
  height: 80%;
}
</style>

<route lang="yaml">
name: components
meta:
  navActiveLink: pages-account-settings-tab
  requiresAuth: true
</route>
