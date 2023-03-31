
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
        <th>Код <br> н/д</th>
        <th>Компонент освітньої <br> програми</th>
        <th>Кількість <br> кредитів</th>
        <th>Форма підсумку <br> контролю</th>
        <th>
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
        v-for="(item, index) in components.mandatory"
        :key="index"
      >
        <td>{{ 'ОК ' + item.code }}</td>
        <td>
          <span v-if="editIndex !== item.id">
            {{ item.name }}
          </span>
          <span v-if="editIndex === item.id">

            <VTextField
              v-model="item.name"
              class="my-3"
              style="width: 50%"
              :rules="rulesComp.nameComp"
              @keyup.enter="saveComponent(item)"
            />
          </span>
        </td>
        <td>
          <span v-if="editIndex !== item.id">
            {{ item.credits }}</span>
          <span v-if="editIndex === item.id">
            <VTextField
              v-model="item.credits"
              class="my-3"
              style="width: 50%"
              type="number"
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

            <VTextField
              v-model="item.control_type"
              class="my-3"
              style="width: 50%"
              :rules="rulesComp.typeExam"
              @keyup.enter="saveComponent(item)"
            />
          </span>
        </td>
        <td>
          <span v-if="editIndex !== item.id">
            <VBtn
              icon="mdi-pencil"
              size="x-small"
              style="margin-right:2% "
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
              style="margin-right:2% "
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
          <div style="float: left">
            Загальний обсяг обов’язкових компонентів:
          </div>
          <div style="float: left">
            <input
              class="text-right"
              disabled
              :value="creditsInfo.mandatory_credits"
            >/<span>
              {{ creditsInfo.mandatory_credits+creditsInfo.mandatory_free_credits }}
            </span>
          </div>
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
  <VTable>
    <thead class="thead-light">
      <tr>
        <th>Код <br> н/д</th>
        <th>Компонент освітньої <br> програми</th>
        <th>Кількість <br> кредитів</th>
        <th>Форма підсумку <br> контролю</th>
        <th>
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
          <h3>{{ block.block_name }}</h3>
        </th>
        <th />
      </tr>
      <tr
        v-for="(comp, compIndex) in block.comps_in_block"
        :key="'comp-' + compIndex"
      >
        <td>{{ 'ВБ ' + comp.block_num + '.'+ comp.code }}</td>
        <td>
          <span v-if="editIndex !== comp.id">
            {{ comp.name }}
          </span>
          <span v-if="editIndex === comp.id">

            <VTextField
              v-model="comp.name"
              class="my-3"
              style="width: 50%"
              :rules="rulesComp.nameComp"
              @keyup.enter="saveComponent(comp)"
            />
          </span>
        </td>
        <td>
          <span v-if="editIndex !== comp.id">
            {{ comp.credits }}</span>
          <span v-if="editIndex === comp.id">
            <VTextField
              v-model="comp.credits"
              class="my-3"
              style="width: 50%"
              type="number"
              :error="hasError"
              :error-messages="errorMessage"
              :rules="rulesComp.credits"
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

            <VTextField
              v-model="comp.control_type"
              class="my-3"
              style="width: 50%"
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
              style="margin-right:2% "
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
              style="margin-right:2% "
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
          <div style="float: left">
            Загальний обсяг вибіркових компонентів:
          </div>
          <div style="float: left">
            <input
              class="text-right"
              disabled
              :value="creditsInfo.selective_credits"
            >/<span>
              {{ creditsInfo.selective_credits+creditsInfo.selective_free_credits }}
            </span>
          </div>
        </th>
      </tr>
    </thead>
  </VTable>
  <VDialog
    v-model="dialogCreate"
    persistent
    max-width="600"
  >
    <VCard>
      <VCardTitle>Створити новий обов’язковий компонент</VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol
              cols="12"
            >
              <VTextField
                v-model="newComponent.name"
                label="Назва компонента"
                required
                :rules="rulesComp.nameComp"
                @input="check"
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VTextField
                v-model="newComponent.credits"
                type="number"
                label="Кількість кредитів"
                :rules="rulesComp.credits"
                :error="hasError"
                :error-messages="errorMessage"
                @focus="resetError"
                @input="validateCredits"
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VTextField
                v-model="newComponent.control_type"
                label="Форма підсумку контролю"
                required
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
    persistent
    max-width="600"
  >
    <VCard>
      <VCardTitle>Створити новий вибірковий компонент</VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol
              cols="12"
            >
              <VTextField
                v-model="newComponent.name"
                label="Назва компонента"
                required
                :rules="rulesComp.nameComp"
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VTextField
                v-model="newComponent.credits"
                type="number"
                label="Кількість кредитів"
                :rules="rulesComp.credits"
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VTextField
                v-model="newComponent.control_type"
                label="Форма підсумку контролю"
                required
                :rules="rulesComp.typeExam"
              />
            </VCol>
            <VCol
              cols="12"
            >
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
            :disabled="!(newComponent.name && newComponent.credits && newComponent.control_type && newComponent.block_name)"
            @click="createComponent"
          >
            Зберегти
          </VBtn>
        </VCardActions>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script setup>
import { computed, onMounted, reactive } from "vue"
import { useRoute } from 'vue-router'
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { editData } from "@/api/http/apiService"
import { storeToRefs } from "pinia"
onMounted(async()=>{
  await eduProgsStore.findEduProgById(route.params.pages)
  await eduProgsStore.fetchVBblock(route.params.pages)
  VBblock.value = eduProgsStore.getVBblock
  console.log('getVBblock',VBblock.value )
})
const route = useRoute()
const eduProgsStore = useEduProgsStore()

const {components, creditsInfo} =storeToRefs(eduProgsStore)
const VBblock = ref()

const editIndex =  ref(null)
let originValue ={}
const dialogCreate = ref(false)
const dialogCreateSelective = ref(false)
const newComponent = reactive({
  name: "",
  credits: 0,
  control_type: "",
  type: "",
  sub_type: "н/д",
  category: "н/д",
  block_name:"",
  block_num:"",
  eduprog_id: +route.params.pages,
})

const rulesComp = ref({
  nameComp: [
    value => {
      if (value) return true

      return 'Введіть назвву'   },
  ],
  credits: [
    value => {
      if (value) return true

      return 'Введіть кредити'   },
  ],
  typeExam:[
    value => {
      if (value) return true

      return 'Введіть форму підсумку контролю'},
  ],
})

const hasError = ref(false)
const errorMessage =  ref('')

function updateSelectedBlockNum() {
  const selectedBlock = VBblock.value.find(block => block.block_name === newComponent.block_name)
  if (selectedBlock) {
    newComponent.block_num = String(selectedBlock.block_num)
  }
  else if (VBblock.value.length === 0){
    newComponent.block_num = String(1)
  }
  else {
    const maxBlockNum = Math.max(...VBblock.value.map(block => block.block_num))
    newComponent.block_num = String(maxBlockNum + 1)
  }
}

function  resetError() {
  hasError.value = false
  errorMessage.value = ''
}

function changeDialog(type) {
  if(type=="ОК"){
    dialogCreate.value = !dialogCreate.value
  }
  else if(type =="ВБ"){
    dialogCreateSelective.value = !dialogCreateSelective.value
  }
  newComponent.name=""
  newComponent.credits=0
  newComponent.control_type=""
  newComponent.block_name=""
  newComponent.block_num=""
}

async function updateCredits(){
  await eduProgsStore.fetchCreditsInfo(route.params.pages)
  creditsInfo.value = eduProgsStore.getCreditsInfo
  await eduProgsStore.fetchVBblock(route.params.pages)
  VBblock.value = eduProgsStore.getVBblock
}
async function createComponent() {
  updateSelectedBlockNum()
  console.log(newComponent.block_name,newComponent.block_num)
  const createdComponent = Object.assign({}, newComponent)
  if(dialogCreate.value){
    createdComponent.type= "ОК"
    try {
      console.log(createdComponent)
      const response = await eduProgsStore.createComponent(createdComponent)
      createdComponent.id=response.id
      createdComponent.code=response.code
      console.log("Компонент",createdComponent)
      components.value.mandatory.push(createdComponent)
      dialogCreate.value = false
    } catch (error) {
      const errorFromServer =error.response.data.error
      if(errorFromServer==="eduprog component with this name already exists"){
        errorMessage.value =  'Компонент з такою назвою вже існує'
      }
      else{
        errorMessage.value =  'Забагато кредитів'
      }
      hasError.value = true
      
      return
    }
  }
  else if(dialogCreateSelective.value){
    console.log(createdComponent)
    createdComponent.type= "ВБ"
    if(components.value.selective.length){
      createdComponent.code=String(+components.value.selective[components.value.selective.length-1].code+1)
    }else{
      createdComponent.code="1"
    }
    try {
      console.log(createdComponent)
      createdComponent.id = await eduProgsStore.createComponent(createdComponent)
      components.value.selective.push(createdComponent)
      dialogCreateSelective.value = false
    } catch (error) {
      hasError.value = true
      errorMessage.value =  'Забагато кредитів'

      return
    }
  }
  newComponent.name=""
  newComponent.credits=0
  newComponent.control_type=""
  newComponent.block_name=""
  newComponent.block_num=""

  await updateCredits()
}

function edit(item) {
  originValue= Object.assign({}, item)
  editIndex.value = item.id
}

function cancel(item) {
  editIndex.value = null
  for(let key in item){
    item[key]=originValue[key]
  }
  originValue={}
}

async function remove(component, type) {
  console.log(components.value)
  await eduProgsStore.deleteComponent(component)
  components.value[type]=components.value[type].filter(obj => obj.id !== component.id)
  console.log(components.value[type])
  updateCredits()
  await eduProgsStore.findEduProgById(route.params.pages)
}

async function saveComponent(component) {
  try {

    await eduProgsStore.editComponent(component.id, component)
    updateCredits()
    editIndex.value = null

  } catch (error) {
    console.log('ERROR1', error.response.data)
    if (error.response.data.error === "too much credits") {
      console.log('PPPPPPPPPPPP', error.response.data)
      hasError.value =  true
      errorMessage.value = "Забагато кредитів"
    }
  }
}
</script>

<style>
input[type="number"] {
  text-align: right;
}
.eduprog-item{
  cursor: pointer
}
</style>

<route lang="yaml">
name: components
meta:
  navActiveLink: pages-account-settings-tab
  requiresAuth: true
</route>
