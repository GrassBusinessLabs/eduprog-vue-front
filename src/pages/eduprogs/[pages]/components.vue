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
    <tbody>
      <tr
        style="height: 65px"
        v-for="(item, index) in components.mandatory"
        :key="index"
      >
        <td style="white-space: nowrap">{{ 'ОК ' + item.code }}</td>
        <td>
          <span v-if="editIndex !== item.id">
            {{ item.name }}
          </span>
          <span v-if="editIndex === item.id">
            <VTextField
              variant="underlined"
              v-model="item.name"
              :rules="rulesComp.nameComp"
              :error="NameError"
              :error-messages="errorName"
              @keyup.enter="saveComponent(item)"
            />
          </span>
        </td>
        <td>
          <span v-if="editIndex !== item.id"> {{ item.credits }}</span>
          <span v-if="editIndex === item.id">
            <VTextField
              variant="underlined"
              v-model="item.credits"
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
          <span v-if="editIndex !== item.id">
            {{ item.control_type }}
          </span>
          <span v-if="editIndex === item.id">
            <VSelect
              variant="underlined"
              v-model="item.control_type"
              :items="control_types"
              :rules="rulesComp.typeExam"
              @keyup.enter="saveComponent(comp)"
            />
          </span>
        </td>
        <td>
          <span
            class="my-4"
            v-if="editIndex !== item.id"
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
        <th />
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
      <tr>
        <th
          colspan="4"
          class="text-center"
        >
          <span v-if="editIndex !== block.block_num">
            <h3>{{ block.block_name }}</h3>
          </span>
          <span v-if="editIndex === block.block_num">
            <VTextField
              :rules="rulesVB.maxLength"
              class="vb-blocks-name"
              variant="underlined"
              v-model="block.block_name"
              @keyup.enter="saveComponent(item)"
              maxlength="100"
            />
          </span>
        </th>

        <th>
          <span v-if="editIndex !== block.block_num">
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
              @click="saveBlockName(block)"
              :disabled="!block.block_name"
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
        style="height: 65px"
        v-for="(comp, compIndex) in block.comps_in_block"
        :key="'comp-' + compIndex"
      >
        <td style="white-space: nowrap">{{ 'ВБ ' + comp.block_num + '.' + comp.code }}</td>
        <td>
          <span v-if="editIndex !== comp.id">
            {{ comp.name }}
          </span>
          <span v-if="editIndex === comp.id">
            <VTextField
              variant="underlined"
              v-model="comp.name"
              :rules="rulesComp.nameComp"
              :error="NameError"
              :error-messages="errorName"
              @keyup.enter="saveComponent(comp)"
            />
          </span>
        </td>
        <td>
          <span v-if="editIndex !== comp.id"> {{ comp.credits }}</span>
          <span v-if="editIndex === comp.id">
            <VTextField
              variant="underlined"
              v-model="comp.credits"
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
          <span v-if="editIndex !== comp.id">
            {{ comp.control_type }}
          </span>
          <span v-if="editIndex === comp.id">
            <VSelect
              variant="underlined"
              v-model="comp.control_type"
              :items="control_types"
              :rules="rulesComp.typeExam"
              @keyup.enter="saveComponent(comp)"
            />
          </span>
        </td>
        <td>
          <span v-if="editIndex !== comp.id">
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
    max-width="290"
  >
    <VCard>
      <VCardTitle> Підтвердіть видалення </VCardTitle>
      <VCardText> Ви впевнені що хочете видалити компонент: {{ originValue.name }}? </VCardText>

      <VCardActions>
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
onMounted(async () => {
  await eduProgsStore.findEduProgById(route.params.pages)
  await eduProgsStore.fetchVBblock(route.params.pages)
  VBblock.value = eduProgsStore.getVBblock
  console.log('getVBblock', VBblock.value)
})
const route = useRoute()
const eduProgsStore = useEduProgsStore()

const { components, creditsInfo } = storeToRefs(eduProgsStore)
const VBblock = ref()
const dialogDelete = ref(false)
const editIndex = ref(null)
let originValue = ref({})
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
  originValue = Object.assign({}, item)
  if (type === 'Block') {
    editIndex.value = item.block_num
  } else if (type === 'Component') {
    editIndex.value = item.id
  }
}

function cancel(item) {
  editIndex.value = null
  for (let key in item) {
    item[key] = originValue[key]
  }
  originValue = {}
}

function remove(comp) {
  dialogDelete.value = true
  originValue = Object.assign({}, comp)
  console.log("ОРИДЖИ?",originValue.id)
}
const confirmRemove = async () => {
  console.log(originValue)
  dialogDelete.value = false
  await eduProgsStore.deleteComponent(originValue)
  let type='mandatory'
  if(originValue.category==='BLOC'){
    type='selective'
  }
  components.value[type] = components.value[type].filter(obj => obj.id !== originValue.id)
  updateCredits()
  await eduProgsStore.findEduProgById(route.params.pages)
  originValue={}
}
async function saveComponent(component) {
  try {
    await eduProgsStore.editComponent(component.id, component)
    updateCredits()
    editIndex.value = null
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
  originValue = {}
}
const saveBlockName = async block => {
  editIndex.value = null
  console.log('Блок', block)
  await eduProgsStore.updateVbBlockName(route.params.pages, block.block_num, block.block_name)
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
}
tr td span.v-select__selection-text {
  display: flex;
  align-items: center;
}
.table-vb-blocks table tbody {
  border-top: 1px solid rgb(58, 53, 65, 0.12);
}
.table-vb-blocks table {
  border-collapse: collapse;
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
