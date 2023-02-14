<script>
export default {
  name: 'Uhuy',
  props:['components'],
  data() {
    return {
      prost:['Філософія','Математика','qwewqewqeqw','ewqeqwewq'],//З сервера має надходити массив з доступними предметами
      mandatoryComponents: this.components.mandatory,
    }
  },
}

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
        <th>Код н/д</th>
        <th>Назва КОП</th>
        <th>Залежності</th>     
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item) in mandatoryComponents"
        :key="item.id"
      >
      <td>{{ 'ОК ' + item.code }}</td>
        <td >
          <span>{{ item.name }}</span>
          <span></span>
          
         </td> 
         <td>
          <VContainer fluid>
            <VRow>
              <VCol cols="12">
                <VCombobox
                  v-model="prost"

                  multiple
                  small-chips
                />
              </VCol>
            </VRow>
          </VContainer>
          <!-- <VSelect class="my-5" label="select" :items="mandatoryComponents" persistent-hint multiple  ></VSelect>fix position Vselect, his ride on page -->
         </td>    
    </tr>
    </tbody>
  </VTable>

</template>

