
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
          <span v-if="editIndex !== index">{{ item.name }}</span>
          <span v-if="editIndex === index">
            <input
              v-model="item.name"
              class="border-solid"
            >
          </span>
        </td>
        <td>
          <span v-if="editIndex !== index">{{ item.credits }}</span>
          <span v-if="editIndex === index">
            <input
              v-model="item.credits"
              type="number"
              class="border-solid"
            >
          </span>
        </td>
        <td>
          <span v-if="editIndex !== index">{{ item.control_type }}</span>
          <span v-if="editIndex === index">
            <input
              v-model="item.control_type"
              class="border-solid"
            >
          </span>
        </td>
        <td>
          <span v-if="editIndex !== index">
            <VMenu
              bottom
              left
              activator="parent"
            >
              <template #activator="{ on, attrs }">
                <VBtn
                  dark
                  icon
                  v-bind="attrs"
                  :shaped="false"
                  size="x-small"
                  v-on="on"
                >
                  <VIcon>mdi-dots-horizontal</VIcon>
                </VBtn>
              </template>

              <VList>
                <VListItem
                  link
                  @click="edit(item, index)"
                >
                  <template #prepend>
                    <VIcon
                      class="me-2"
                      icon="mdi-pencil"
                      size="22"
                    />
                  </template>


                  <VListItemTitle>
                    Редагувати
                  </VListItemTitle>
                </VListItem>
                <VListItem
                  link
                  @click="deleteComponent(item.id)"
                >
                  <template #prepend>
                    <VIcon
                      class="me-2"
                      icon="mdi-trash-can"
                      size="22"
                    />
                  </template>

                  <VListItemTitle>
                    Видалити
                  </VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </span>
          <span v-else>
            <VMenu
              bottom
              left
              activator="parent"
            >
              <template #activator="{ on, attrs }">
                <VBtn
                  dark
                  icon
                  v-bind="attrs"
                  :shaped="false"
                  size="x-small"
                  v-on="on"
                >
                  <VIcon>mdi-dots-horizontal</VIcon>
                </VBtn>
              </template>

              <VList>
                <VListItem
                  link
                  :disabled="!(item.name && item.credits && item.control_type )"
                  @click="saveComponent(item)"
                >
                  <template #prepend>
                    <VIcon
                      class="me-2"
                      icon="mdi-pencil"
                      size="22"
                    />
                  </template>


                  <VListItemTitle>
                    Зберегти
                  </VListItemTitle>
                </VListItem>
                <VListItem
                  link
                  @click="cancel(item)"
                >
                  <template #prepend>
                    <VIcon
                      class="me-2"
                      icon="mdi-trash-can"
                      size="22"
                    />
                  </template>

                  <VListItemTitle>
                    Відмінити
                  </VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
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
              :value="creditsInfo.total_credits"
            >/180 кредитів
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
</template>

<script setup>
import { reactive } from "vue"
import { useRoute } from 'vue-router'
import { useEduProgsStore } from '@/stores/eduProgs.js'

const route = useRoute()
const eduProgsStore = useEduProgsStore()

const creditsInfo = eduProgsStore.creditsInfo
const components = eduProgsStore.getEduProg.components

const editIndex =  ref(null)
const originalData = ref(null)
const mandatoryComponents = ref(components.mandatory)
const dialogCreate = ref(false)
const newComponent = reactive({
  code: String(components.mandatory.length + 1),
  name: "",
  credits: 0,
  control_type: "",
  type: "ОК",
  sub_type: "н/д",
  category: "н/д",
  eduprog_id: +route.params.id,
})

function changeDialog() {
  dialogCreate.value = !dialogCreate.value
}

async function createComponent() {
  await eduProgsStore.createComponent(newComponent)
  await eduProgsStore.findEduProgById(route.params.id)
  dialogCreate.value = false
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

async function remove(id) {
  await eduProgsStore.deleteComponent(id)
  await eduProgsStore.findEduProgById(route.params.id)
}

async function saveComponent(component) {
  await eduProgsStore.editComponent(component.id, component)
  originalData.value = null
  editIndex.value = null
}
</script>

<style>
input[type="number"] {
  text-align: right;
}
</style>
