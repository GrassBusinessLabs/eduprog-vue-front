<script setup>
import TableBasic from '@/views/user-interface/tables/TableBasic.vue'

</script>

<template>
  <!-- Основний компонент -->
  <VTable>
    <thead class="thead-light">
      <tr>
        <th class="text-center">
         <h3>Основний компонент ОП</h3>
        </th>
        <th></th>
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
            @click="dialogCreate = true"
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
            <input  class="border-solid" v-model="item.name">
          </span>
        </td>
        <td>
          <span v-if="editIndex !== index">{{ item.credits }}</span>
          <span v-if="editIndex === index">
            <input type="number" class="border-solid"  v-model="item.credits">
          </span>
        </td>
        <td>
          <span v-if="editIndex !== index" >{{ item.control_type }}</span>
          <span v-if="editIndex === index">
            <input  class="border-solid"   v-model="item.control_type" >
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
                <VListItem link @click="edit(item, index)" >
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
                <VListItem link @click="deleteComponent(item.id)" >
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

              <VList >
                <VListItem link @click="saveComponent(item)" :disabled="!(item.name && item.credits && item.control_type )" >
                  <template #prepend>
                    <VIcon
                      class="me-2"
                      icon="mdi-pencil"
                      size="22"
                    />
                  </template>


                  <VListItemTitle >
                    Зберегти
                  </VListItemTitle>
                </VListItem>
                <VListItem @click="cancel(item)" link>
                  <template #prepend>
                    <VIcon
                      class="me-2"
                      icon="mdi-trash-can"
                      size="22"
                    />
                  </template>

                  <VListItemTitle >
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
      <th colspan='5' >
        <div style="float: left" >Загальний обсяг обов’язкових компонентів:</div>
        <div style="float: left"><input class='text-right' disabled :value="creditsInfo.total_credits">/180 кредитів</div>
      </th>
    </tr>
    </thead>
  </VTable>
  <VTable>

    <!-- Вибірковий компонент -->

    <thead>
    <tr>
      <th style="text-align: center" colspan='4' ><h3>Вибірковий компонент ОП
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
    <tr v-for="(item, index) in itemsVB"
        :key="index">
      <td style="text-align: center" colspan='4'>
        {{ 'Вибірковий блок ' + (index +1) }}( <input class="border-solid" style='width: 15%'> )

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
            <input  class="border-solid"     v-model="item.COP_VB">
          </span>
      </td>
      <td>
        <span v-if="editIndex !== index">{{ item.credit_COP_VB }}</span>
        <span v-if="editIndex === index">
            <input type="number" class="border-solid"    v-model="item.credit_COP_VB">
          </span>
      </td>
      <td>
        <span v-if="editIndex !== index" >{{ item.FC_COP_VB }}</span>
        <span v-if="editIndex === index">
            <input  class="border-solid"   v-model="item.FC_COP_VB" >
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
                <VListItem link @click="edit(item, index)" >
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
                <VListItem link @click="remove(item, index)" >
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
                <VListItem link @click="save(item)" >
                  <template #prepend>
                    <VIcon
                      class="me-2"
                      icon="mdi-pencil"
                      size="22"
                    />
                  </template>


                  <VListItemTitle >
                    Зберегти
                  </VListItemTitle>
                </VListItem>
                <VListItem @click="cancel(item)" link>
                  <template #prepend>
                    <VIcon
                      class="me-2"
                      icon="mdi-trash-can"
                      size="22"
                    />
                  </template>

                  <VListItemTitle >
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
              type="number"
                v-model="newComponent.credits"
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
            @click="dialogCreate = false"
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

<script>
export default {

  data() {
    return {
      editIndex: null,
      originalData: null,
      mandatoryComponents: this.components.mandatory,
      isDisabled: false,
      dialogCreate: false,
      eduprogId: 1,
      newComponent:{
        code: String(this.components.mandatory.length+1),
        name:"",
        credits: 0,
        control_type: "",
        type: "ОК",
        sub_type: "н/д",
        category: "н/д",
        eduprog_id: 1
      }
    }
  },
  props: ['components', 'creditsInfo'],

  methods: {
    createComponent(){
      this.$emit('createComponent', this.newComponent)
      this.dialogCreate = false;
    },
    edit(item, index) {
      this.originalData = Object.assign({}, item)
      this.editIndex = index
    },
    cancel(item) {
      this.editIndex = null
      if (!this.originalData) {
        this.itemsOP.splice(this.itemsOP.indexOf(item), 1)
        
        return
      }
      Object.assign(item, this.originalData)
      this.originalData = null
    },
    remove(id) {
      this.$emit('deleteComponent', id)
    },
    save(item) {
      this.originalData = null
      this.editIndex = null
    },
    saveComponent(component) {
      console.log(this.creditsInfo)
      this.$emit('saveComponent', component)
      this.originalData = null
      this.editIndex = null
      this.isDisabled = false
    },
    deleteComponent(id) {
      this.$emit('deleteComponent', id)
    },
    subtotal(item) {
      return (item.credit_COP)
    },
    add_VB(){
      this.originalData = null
      this.itemsVB.push({ COP_VB: '', credit_COP_VB: "0", FC_COP_VB: ''})
      this.editIndex = this.itemsVB.length - 1
    },

  },

}
</script>


<style>
input[type="number"] {
  text-align: right;
}
</style>
