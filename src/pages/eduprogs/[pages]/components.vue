
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
              @keyup.enter="saveComponent(item)"
              :error="ErrorName"
              :error-messages="ErrorNameM"
              @focus="EresetName"
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
              @keyup.enter="saveComponent(item)"
              :error="ErrorCredit"
              :error-messages="ErrorCreditM"
              @focus="EresetCredits"
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
              @keyup.enter="saveComponent(item)"
              :error="ErrorExam"
              :error-messages="ErrorExamM"
              @focus="EresetExam"
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
  <VTable v-if="components && components.selective">
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
    <tbody>
      <tr
        v-for="item in components.selective"
        :key="item.id"
      >
        <td>{{ 'ВБ ' + item.code }}</td>
        <td>
          <span v-if="editIndex !== item.id">
            {{ item.name }}
          </span>
          <span v-if="editIndex === item.id">

            <VTextField
              v-model="item.name"
              class="my-3"
              style="width: 50%"
              @keyup.enter="saveComponent(item)"
              :error="ErrorName"
              :error-messages="ErrorNameM"
              @focus="EresetName"
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
              @keyup.enter="saveComponent(item)"
              :error="ErrorCredit"
              :error-messages="ErrorCreditM"
              @focus="EresetCredits"
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
              @keyup.enter="saveComponent(item)"
              :error="ErrorExam"
              :error-messages="ErrorExamM"
              @focus="EresetExam"
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
              @click="remove(item, 'selective')"
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
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VTextField
                v-model="newComponent.credits"
                type="number"
                label="Кількість кредитів"
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VTextField
                v-model="newComponent.control_type"
                label="Форма підсумку контролю"
                required
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
            :disabled="!(newComponent.name && newComponent.credits && newComponent.control_type)"
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
  console.log("COMPONENTS", components)
})
const route = useRoute()
const eduProgsStore = useEduProgsStore()

const {components, creditsInfo} =storeToRefs(eduProgsStore)
const hasError = ref(false)
const errorMessage =  ref('')

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
  eduprog_id: +route.params.pages,
})

const ErrorName = ref(false)
const errorNameM =  ref('')

const ErrorCredit = ref(false)
const errorCreditM =  ref('')

const ErrorExam = ref(false)
const errorExamM =  ref('')


function  EresetName() {
  ErrorName.value = false
  errorNameM.value = ''
}

function  EresetCredits() {
  ErrorCredit.value = false
  errorCreditM.value = ''
}

function  EresetExam() {
  ErrorExam.value = false
  errorExamM.value = ''
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
    dialogCreateSelective.value = !dialogCreate.value
  }
  newComponent.name=""
  newComponent.credits=0
  newComponent.control_type=""
}

async function updateCredits(){
  await eduProgsStore.fetchCreditsInfo(route.params.pages)
  creditsInfo.value = eduProgsStore.getCreditsInfo
}
async function createComponent() {
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
  console.log("Айтем анд оригин",item, originValue)
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
    console.log('ERROR1',error.response.data)
    if (error.response.data.error === 'too much credits') {
      console.log('ERhjkhj',error.response.data)
      ErrorName.value = true
      errorNameM.value =  "Некоректне ім'я"
    }
    else if(error.response.data.error === "Key: 'UpdateEduprogcompRequest.Name' Error:Field validation for 'Name' failed on the 'gte' tag") {
      console.log('PPPPPPPPPPPP',error.response.data)
      ErrorCredit.value = true
      errorCreditM.value =  "Забагато кредитів"
    }
    else if (error.response.data.error === "Key: 'UpdateEduprogcompRequest.ControlType' Error:Field validation for 'ControlType' failed on the 'gte' tag")
      console.log('llllllllllllllll',error.response.data)
    ErrorExam.value = true
    errorExamM.value =  "Некоректне значення"
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
