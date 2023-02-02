<script setup>
import TableBasic from '@/views/user-interface/tables/TableBasic.vue'

</script>

<template>
  <VTable>
    <thead class="thead-light">
      <tr>
        <th class="text-center">
         <h3>Основний компонент ОП</h3>
        </th>
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
            @click="add"
            :disabled='isDisabled'
          />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in items"
        :key="index"
      >
        <td>{{ 'ОК ' + index }}</td>
        <td>
          <span v-if="editIndex !== index">{{ item.COP }}</span>
          <span v-if="editIndex === index">
            <input  class="border-solid"     v-model="item.COP">
          </span>
        </td>
        <td>
          <span v-if="editIndex !== index">{{ item.credit_COP }}</span>
          <span v-if="editIndex === index">
            <input type="number" class="border-solid"    v-model="item.credit_COP">
          </span>
        </td>
        <td>
          <span v-if="editIndex !== index" >{{ item.FC_COP }}</span>
          <span v-if="editIndex === index">
            <input  class="border-solid"   v-model="item.FC_COP" >
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

              <VList >
                <VListItem link @click="save(item)" :disabled="!(item.COP && item.FC_COP && item.credit_COP>0 )" >
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
  <VTable>
    <thead class="thead-light">
      <tr>
        <th>Загальний обсяг обов’язкових компонентів:</th>
        <th>

            <input class='text-right' disabled :value="allSubTotal ">/180 кредитів

        </th>
      </tr>
    </thead>
  </VTable>
  <VTable>
    <thead>
    <tr>
      <th style="text-align: center" ><h3>Вибірковий компонент ОП</h3></th>
    </tr>
    </thead>
  </VTable>
  <VTable>
    <tbody>
    <tr>
      <td style="text-align: center">
        Вибірковий блок 1( <input class="border-solid" style='width: 15%'> )
      </td>
    </tr>
    </tbody>
  </VTable>
</template>

<script>
export default {

  data() {
    return {
      editIndex: null,
      originalData: null,
      items: [
        { COP: 'Філософія', credit_COP: "6", FC_COP: 'Залік' },
      ],
      isDisabled :false
    }
  },
  computed: {
    allSubTotal() {
      return this.items
        .map(item => Number(this.subtotal(item)))
        .reduce((a, b) => a + b, 0)
    },
  },

  methods: {
    add() {
      this.originalData = null
      this.items.push({ COP: '', credit_COP: "0", FC_COP: ''})
      this.editIndex = this.items.length - 1
      this.isDisabled = true
    },
    edit(item, index) {
      this.originalData = Object.assign({}, item)
      this.editIndex = index
    },
    cancel(item) {
      this.editIndex = null
      if (!this.originalData) {
        this.items.splice(this.items.indexOf(item), 1)
        
        return this.isDisabled = false
      }
      Object.assign(item, this.originalData)
      this.originalData = null
    },
    remove(item, index) {
      this.items.splice(index, 1)
    },
    save(item) {
      this.originalData = null
      this.editIndex = null
      this.isDisabled = false
    },
    subtotal(item) {
      return (item.credit_COP)
    },
  },
}
</script>


<style>
input[type="number"] {
  text-align: right;
}

</style>
