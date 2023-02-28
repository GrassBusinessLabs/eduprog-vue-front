
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
            @click="changeDialog"
          />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in mandatoryComponents"
        :key="index"
      >
        <td>{{ 'ОК ' + item.code }}</td>
        <td>
          <span v-if="editIndex !== item.id">
            {{item.name}}
          </span>
          <span v-if="editIndex === item.id">

            <VTextField
            class="my-3"
              v-model="item.name"
              style="width: 50%"
            />
          </span>
        </td>
        <td>
          <span v-if="editIndex !== item.id">
            {{item.credits}}</span>
          <span v-if="editIndex === item.id">
            <VTextField
            class="my-3"
              v-model="item.credits"
              style="width: 50%"
              type='number'
            />
          </span>
        </td>
        <td>
          <span v-if="editIndex !== item.id">
            {{item.control_type}}
          </span>
          <span v-if="editIndex === item.id">

            <VTextField
              class="my-3"
              v-model="item.control_type"
              style="width: 50%"
            />
          </span>
        </td>
        <td>
          <span v-if="editIndex !== item.id">
            <VBtn
              icon="mdi-pencil"
              size="x-small"
              style="margin-right:2% "
              @click="editIndex = item.id"
            />
            <VBtn
              icon="mdi-trash-can"
              size="x-small"
              @click="remove(item)"
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
              :value="eduProgsStore.creditsInfo.mandatory_credits"
            >/<span>
              {{eduProgsStore.creditsInfo.mandatory_credits+eduProgsStore.creditsInfo.mandatory_free_credits}}
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
            @click="dialogCreateSelective = true"
          />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in selectiveComponents"
        :key="item.id"
      >
        <td>{{ 'ВБ ' + item.code }}</td>
        <td>
          <span v-if="editIndex !== item.id">
            {{item.name}}
          </span>
          <span v-if="editIndex === item.id">

            <VTextField
            class="my-3"
              v-model="item.name"
              style="width: 50%"
            />
          </span>
        </td>
        <td>
          <span v-if="editIndex !== item.id">
            {{item.credits}}</span>
          <span v-if="editIndex === item.id">
            <VTextField
            class="my-3"
              v-model="item.credits"
              style="width: 50%"
              type='number'
            />
          </span>
        </td>
        <td>
          <span v-if="editIndex !== item.id">
            {{item.control_type}}
          </span>
          <span v-if="editIndex === item.id">

            <VTextField
              class="my-3"
              v-model="item.control_type"
              style="width: 50%"
            />
          </span>
        </td>
        <td>
          <span v-if="editIndex !== item.id">
            <VBtn
              icon="mdi-pencil"
              size="x-small"
              style="margin-right:2% "
              @click="editIndex = item.id"
            />
            <VBtn
              icon="mdi-trash-can"
              size="x-small"
              @click="remove(item)"
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
              :value="eduProgsStore.creditsInfo.selective_credits"
            >/<span>
              {{eduProgsStore.creditsInfo.selective_credits+eduProgsStore.creditsInfo.selective_free_credits}}
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
            @click="changeDialog"
          >
            Відмінити
          </VBtn>
          <VBtn
            text
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
            @click="dialogCreateSelective = false"
          >
            Відмінити
          </VBtn>
          <VBtn
            text
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
import { computed, reactive } from "vue"
import { useRoute } from 'vue-router'
import { useEduProgsStore } from '@/stores/eduProgs.js'

const route = useRoute()
const eduProgsStore = useEduProgsStore()

const components =  reactive(eduProgsStore.getEduProg.components)

const editIndex =  ref(null)
const originalData = ref(null)
const mandatoryComponents = ref(components.mandatory)
const selectiveComponents = ref(components.selective)
const dialogCreate = ref(false)
const dialogCreateSelective = ref(false)
const newComponent = reactive({
  code: String(components.mandatory.length + 1),
  name: "",
  credits: 0,
  control_type: "",
  type: "",
  sub_type: "н/д",
  category: "н/д",
  eduprog_id: +route.params.id,
})
function changeDialog() {
  dialogCreate.value = !dialogCreate.value
}

// async function createComponent() {
//   if(dialogCreate.value){
//     newComponent.code = String(components.mandatory.length + 1)
//     newComponent.type="ОК"
//     dialogCreate.value = false
//     components.mandatory.push(newComponent)
//   }
//   else if(dialogCreateSelective.value){
//     newComponent.code = String(components.selective.length + 1)
//     newComponent.type="ВБ"
//     dialogCreateSelective.value = false
//     components.selective.push(newComponent)
//   }
//   console.log("sdhjiidfg",components.mandatory)
//   await eduProgsStore.createComponent(newComponent)
//
//   // await eduProgsStore.findEduProgById(route.params.id)
//
// }
async function createComponent() {
  if(dialogCreate.value){
    const mandatoryComponent = {
      code: String(components.mandatory.length + 1),
      name: newComponent.name,
      credits: newComponent.credits,
      control_type: newComponent.control_type,
      type: "ОК",
      sub_type: newComponent.sub_type,
      category: newComponent.category,
      eduprog_id: newComponent.eduprog_id,
    }
    components.mandatory.push(mandatoryComponent)
    await eduProgsStore.createComponent(mandatoryComponent)

    dialogCreate.value = false

  } else if(dialogCreateSelective.value){
    const selectiveComponent = {
      code: String(components.selective.length + 1),
      name: newComponent.name,
      credits: newComponent.credits,
      control_type: newComponent.control_type,
      type: "ВБ",
      sub_type: newComponent.sub_type,
      category: newComponent.category,
      eduprog_id: newComponent.eduprog_id,
    }

    components.selective.push(selectiveComponent)
    await eduProgsStore.createComponent(selectiveComponent)

    dialogCreateSelective.value = false
  }
  newComponent.code = 0
  newComponent.name = ""
  newComponent.credits = 0
  newComponent.control_type = ""
  newComponent.type = ""
  newComponent.sub_type = "н/д"
  newComponent.category = "н/д"
  newComponent.eduprog_id = +route.params.id
}



function edit(item, index) {
  originalData.value = Object.assign({}, item)
  console.log(originalData.value)
  editIndex.value = index
}

function cancel(item) {
  editIndex.value = null
  Object.assign(item, originalData.value)
  originalData.value = null
}

async function remove(component) {
  await eduProgsStore.deleteComponent(component)

  const index =  mandatoryComponents.value.findIndex(item => item.id === component.id)
  if (index !== -1) {
    mandatoryComponents.value.splice(index, 1)
  }

  // await eduProgsStore.findEduProgById(route.params.id)

}

async function saveComponent(component) {
  await eduProgsStore.editComponent(component.id, component)

  // await eduProgsStore.findEduProgById(route.params.id)

  console.log(eduProgsStore.creditsInfo)
  originalData.value = null
  editIndex.value = null
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
