
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
              :value="creditsInfo.mandatory_credits"
            >/<span>
              {{creditsInfo.mandatory_credits+creditsInfo.mandatory_free_credits}}
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
              :value="creditsInfo.selective_credits"
            >/<span>
              {{creditsInfo.selective_credits+creditsInfo.selective_free_credits}}
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

const creditsInfo = reactive(eduProgsStore.creditsInfo)
const components = eduProgsStore.getEduProg.components

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

async function createComponent() {
  if(dialogCreate.value){
    newComponent.code = String(components.mandatory.length + 1)
    newComponent.type="ОК"
    dialogCreate.value = false
  }
  else if(dialogCreateSelective.value){
    newComponent.code = String(components.selective.length + 1)
    newComponent.type="ВБ"
    dialogCreateSelective.value = false
  }
  console.log(newComponent)
  await eduProgsStore.createComponent(newComponent)
  await eduProgsStore.findEduProgById(route.params.id)
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
  await eduProgsStore.findEduProgById(route.params.id)
}

async function saveComponent(component) {
  await eduProgsStore.editComponent(component.id, component)
  await eduProgsStore.findEduProgById(route.params.id)
  console.log(eduProgsStore.creditsInfo)
  console.log(creditsInfo)
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
