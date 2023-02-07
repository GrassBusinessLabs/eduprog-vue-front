
<template>
  <VTable>
    <thead>
      <tr>
        <th
          rowspan="2"
          class="text-center"
        >
          <p>Дисципліни</p>
          <VBtn
            icon="mdi-plus"
            size="x-small"
            @click="add"
          />
        </th>
        <th
          colspan="2"
          class="text-center"
        >
          1 курс
        </th>
        <th
          colspan="2"
          class="text-center"
        >
          2 курс
        </th>
        <th
          colspan="2"
          class="text-center"
        >
          3 курс
        </th>
        <th
          colspan="2"
          class="text-center"
        >
          4 курс
        </th>
      </tr>

      <tr>
        <th class="text-center">
          1 семестр
        </th>
        <th class="text-center">
          2 семестр
        </th>
        <th class="text-center">
          3 семестр
        </th>
        <th class="text-center">
          4 семестр
        </th>
        <th class="text-center">
          5 семестр
        </th>
        <th class="text-center">
          6 семестр
        </th>
        <th class="text-center">
          7 семестр
        </th>
        <th class="text-center">
          8 семестр
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in itemsS"
        :key="index">
        <td>
          <div style='text-align: center'>
            <span v-if="editIndex !== index" >{{ item.DS }}</span>
            <span v-if="editIndex === index">
            <input  class="border-solid"   v-model="item.DS" >
          </span>
          </div>
          <div style='text-align: center; margin-top: 5%; margin-bottom: 5%' >
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
          </div>
        </td>
        <td>
          <VContainer fluid>
            <VRow>
              <VCol cols="12">
                <VCombobox
                  v-model="itemsS.S1"
                  :items="items"
                  hide-selected
                  multiple
                  small-chips
                />
              </VCol>
            </VRow>
          </VContainer>
        </td>
        <td>
          <VContainer fluid>
            <VRow>
              <VCol cols="12">
                <VCombobox
                  v-model="itemsS.S2"
                  :items="items"
                  hide-selected
                  multiple
                  small-chips
                />
              </VCol>
            </VRow>
          </VContainer>
        </td>
        <td>
          <VContainer fluid>
            <VRow>
              <VCol cols="12">
                <VCombobox
                  v-model="itemsS.S3"
                  :items="items"
                  hide-selected
                  multiple
                  small-chips
                />
              </VCol>
            </VRow>
          </VContainer>
        </td>
        <td>
          <VContainer fluid>
            <VRow>
              <VCol cols="12">
                <VCombobox
                  v-model="itemsS.S4"
                  :items="items"
                  hide-selected
                  multiple
                  small-chips
                />
              </VCol>
            </VRow>
          </VContainer>
        </td>
        <td>
          <VContainer fluid>
            <VRow>
              <VCol cols="12">
                <VCombobox
                  v-model="itemsS.S5"
                  :items="items"
                  hide-selected
                  multiple
                  small-chips
                />
              </VCol>
            </VRow>
          </VContainer>
        </td>
        <td>
          <VContainer fluid>
            <VRow>
              <VCol cols="12">
                <VCombobox
                  v-model="itemsS.S6"
                  :items="items"
                  hide-selected
                  multiple
                  small-chips
                />
              </VCol>
            </VRow>
          </VContainer>
        </td>
        <td>
          <VContainer fluid>
            <VRow>
              <VCol cols="12">
                <VCombobox
                  v-model="itemsS.S7"
                  :items="items"
                  hide-selected
                  multiple
                  small-chips
                />
              </VCol>
            </VRow>
          </VContainer>
        </td>
        <td>
          <VContainer fluid>
            <VRow>
              <VCol cols="12">
                <VCombobox
                  v-model="itemsS.S8"
                  :items="items"
                  hide-selected
                  multiple
                  small-chips
                />
              </VCol>
            </VRow>
          </VContainer>
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
      itemsS: [
        { DS: "Дисципліни фахової спеціалізації", S1: "", S2: "", S3: "", S4: "", S5: "", S6: "", S7: "", S8: ""},
      ],
      items: [
        'Programming',
        'Design',
        'Vue',
        'Vuetify',
      ],
    }
  },

  methods: {
    add() {
      this.originalData = null
      this.itemsS.push({ DS: ' ', S1: '', S2: '', S3: '', S4: '', S5: '', S6: '', S7: '', S8: ''})
      this.editIndex = this.itemsS.length - 1
    },
    edit(item, index) {
      this.originalData = Object.assign({}, item)
      this.editIndex = index
    },
    cancel(item) {
      this.editIndex = null
      if (!this.originalData) {
        this.itemsS.splice(this.itemsS.indexOf(item), 1)

        return
      }
      Object.assign(item, this.originalData)
      this.originalData = null
    },
    remove(item, index) {
      this.itemsS.splice(index, 1)
    },
    save(item) {
      this.originalData = null
      this.editIndex = null
    },
  },

}
</script>
