<script setup>
import TableBasic from '@/views/user-interface/tables/TableBasic.vue'

</script>

<template>
  <VTable>
    <thead class="thead-light">
      <tr>
        <th class="text-center">
          Назва документу
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
            <input
              v-model="item.COP"
            >
          </span>
        </td>
        <td>
          <span v-if="editIndex !== index">{{ item.credit_COP }}</span>
          <span v-if="editIndex === index">
            <input
              v-model="item.credit_COP"
            >
          </span>
        </td>
        <td>
          <span v-if="editIndex !== index">{{ item.FC_COP }}</span>
          <span v-if="editIndex === index">
            <input
              v-model="item.FC_COP"
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
                <VListItem link>
                  <template #prepend>
                    <VIcon
                      class="me-2"
                      icon="mdi-pencil"
                      size="22"
                    />
                  </template>


                  <VListItemTitle @click="edit(item, index)">
                    Перейменувати
                  </VListItemTitle>
                </VListItem>
                <VListItem link>
                  <template #prepend>
                    <VIcon
                      class="me-2"
                      icon="mdi-trash-can"
                      size="22"
                    />
                  </template>

                  <VListItemTitle @click="remove(item, index)">
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
                <VListItem link>
                  <template #prepend>
                    <VIcon
                      class="me-2"
                      icon="mdi-pencil"
                      size="22"
                    />
                  </template>


                  <VListItemTitle @click="save(item)">
                    Зберегти
                  </VListItemTitle>
                </VListItem>
                <VListItem link>
                  <template #prepend>
                    <VIcon
                      class="me-2"
                      icon="mdi-trash-can"
                      size="22"
                    />
                  </template>

                  <VListItemTitle @click="cancel(item)">
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
          <div class="input-group-prepend">
            Кредитів:
            <input
              disabled
              :value="allSubTotal"
            >
          </div>
        </th>
      </tr>
    </thead>
  </VTable>
</template>

<script>
export default {
  name: 'Uhuy',
  filters: {
    money: value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value),
  },
  data() {
    return {
      editIndex: null,
      originalData: null,
      items: [
        { COP: 'Філософія', credit_COP: "6", FC_COP: 'Залік' },
      ],
    }
  },
  computed: {
    allSubTotal() {
      let summa = 0
      for (let item in this.items){
        summa+= item.credit_COP
      }
      
      return summa
    },
    total() {
      return this.tax
        ? this.allSubTotal + (this.allSubTotal )
        : this.allSubTotal
    },
  },

  methods: {
    add() {
      this.originalData = null
      this.items.push({ COP: '', credit_COP: "", FC_COP: ''})
      this.editIndex = this.items.length - 1
    },
    edit(item, index) {
      this.originalData = Object.assign({}, item)
      this.editIndex = index
    },
    cancel(item) {
      this.editIndex = null
      if (!this.originalData) {
        this.items.splice(this.items.indexOf(item), 1)
        
        return
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
