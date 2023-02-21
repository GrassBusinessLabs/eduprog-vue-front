
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
            @click="dialogCreate.value = true"
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
  <VTable>
    <!-- Вибірковий компонент -->

    <thead>
      <tr>
        <th
          style="text-align: center"
          colspan="4"
        >
          <h3>
            Вибірковий компонент ОП
          </h3>
        </th>
        <th>
          <VBtn
            icon="mdi-plus"
            size="x-small"
            @click="add_VB"
          />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in itemsVB"
        :key="index"
      >
        <td
          style="text-align: center"
          colspan="4"
        >
          {{ 'Вибірковий блок ' + (index +1) }}( <input
            class="border-solid"
            style="width: 15%"
          > )
        </td>
        <td>
          <VBtn
            icon="mdi-plus"
            size="x-small"
            @click="add_VB"
          />
        </td>
      </tr>
    </tbody>
    <tbody>
      <tr
        v-for="(item, index) in itemsVB"
        :key="index"
      >
        <td>{{ 'ВБ ' + (index +1) }}</td>
        <td>
          <span v-if="editIndex !== index">{{ item.COP_VB }}</span>
          <span v-if="editIndex === index">
            <input
              v-model="item.COP_VB"
              class="border-solid"
            >
          </span>
        </td>
        <td>
          <span v-if="editIndex !== index">{{ item.credit_COP_VB }}</span>
          <span v-if="editIndex === index">
            <input
              v-model="item.credit_COP_VB"
              type="number"
              class="border-solid"
            >
          </span>
        </td>
        <td>
          <span v-if="editIndex !== index">{{ item.FC_COP_VB }}</span>
          <span v-if="editIndex === index">
            <input
              v-model="item.FC_COP_VB"
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
                  @click="remove(item, index)"
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
                  @click="save(item)"
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
            @click="dialogCreate.value = false"
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
const props = defineProps(['components', 'creditsInfo', 'eduProgId'] )

const emit = defineEmits(['createComponent', 'deleteComponent','saveComponent'])

const editIndex =  null
const originalData = null
const mandatoryComponents = ref(props.components.mandatory)
const isDisabled = false
const dialogCreate = ref(false)
const eduprogId = 1
const newComponent = {
  code: String(props.components.mandatory.length + 1),
  name: "",
  credits: 0,
  control_type: "",
  type: "ОК",
  sub_type: "н/д",
  category: "н/д",
  eduprog_id: +props.eduProgId,
}

function createComponent() {
  emit('createComponent',  newComponent.value)
  dialogCreate.value = false
}

function edit(item, index) {
  originalData.value = Object.assign({}, item)
  editIndex.value = index
}

function cancel(item) {
  editIndex.value = null
  Object.assign(item, originalData.value)
  originalData.value = null
}

function remove(id) {
  emit('deleteComponent', id)
}

function save(item) {
  originalData.value = null
  editIndex.value = null
}

function saveComponent(component) {
  console.log(props.creditsInfo.value)
  emit('saveComponent', component)
  originalData.value = null
  editIndex.value = null
  isDisabled.value = false
}

function deleteComponent(id) {
  emit('deleteComponent', id)
}

function subtotal(item) {
  return (item.credit_COP)
}

function add_VB() {
  originalData.value = null
  itemsVB.push({ COP_VB: '', credit_COP_VB: "0", FC_COP_VB: '' })
  editIndex.value =  itemsVB.value.length - 1
}
</script>
  //
  // data() {
  //   return {
  //     editIndex: null,
  //     originalData: null,
  //     mandatoryComponents: this.components.mandatory,
  //     isDisabled: false,
  //     dialogCreate: false,
  //     eduprogId: 1,
  //     newComponent:{
  //       code: String(this.components.mandatory.length+1),
  //       name:"",
  //       credits: 0,
  //       control_type: "",
  //       type: "ОК",
  //       sub_type: "н/д",
  //       category: "н/д",
  //       eduprog_id: +this.eduProgId
  //     }
  //   }
  // },
  //
  //
  // methods: {
  //   createComponent(){
  //     this.$emit('createComponent', this.newComponent)
  //     this.dialogCreate = false;
  //   },
  //   edit(item, index) {
  //     this.originalData = Object.assign({}, item)
  //     this.editIndex = index
  //   },
  //   cancel(item) {
  //     this.editIndex = null
  //     if (!this.originalData) {
  //       this.itemsOP.splice(this.itemsOP.indexOf(item), 1)
  //
  //       return
  //     }
  //     Object.assign(item, this.originalData)
  //     this.originalData = null
  //   },
  //   remove(id) {
  //     this.$emit('deleteComponent', id)
  //   },
  //   save(item) {
  //     this.originalData = null
  //     this.editIndex = null
  //   },
  //   saveComponent(component) {
  //     console.log(this.creditsInfo)
  //     this.$emit('saveComponent', component)
  //     this.originalData = null
  //     this.editIndex = null
  //     this.isDisabled = false
  //   },
  //   deleteComponent(id) {
  //     this.$emit('deleteComponent', id)
  //   },
  //   subtotal(item) {
  //     return (item.credit_COP)
  //   },
  //   add_VB(){
  //     this.originalData = null
  //     this.itemsVB.push({ COP_VB: '', credit_COP_VB: "0", FC_COP_VB: ''})
  //     this.editIndex = this.itemsVB.length - 1
  //   },
  //
  // },}



<style>
input[type="number"] {
  text-align: right;
}
</style>
