<script>
export default {
  name: 'Uhuy',
 
  data() {
    return {
      items: [
        { COP: 'Філософія', credit_COP: "6", FC_COP: 'Залік' },
        { COP: 'Математика', credit_COP: "6", FC_COP: 'Залік' }
      ],
      prost:['Філософія','Математика','qwewqewqeqw','ewqeqwewq']   //З сервера має надходити массив з доступними предметами
   
    }
  }
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
        v-for="(item, index) in items"
        :key="index"
      >
      <td>{{ 'ОК ' + index }}</td>
        <td >
          <span>{{ item.COP }}</span>
          <span></span>
          
         </td> 
         <td>
          <VSelect label="select" :items="prost" persistent-hint multiple  ></VSelect> <!--fix position Vselect, his ride on page -->
         </td>    
    </tr>
    </tbody>
  </VTable>

</template>

