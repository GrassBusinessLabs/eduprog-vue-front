<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
const props = defineProps(['eduProg'])
const route = useRoute()
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
const eduProgsStore = useEduProgsStore()
const saveChanges = async () => {
  await eduProgsStore.editEduprog(eduProgData)
}
const eduProgData = props.eduProg
const allRelations = ref([])
const selectedCompetencies =ref([])
const selectedCompetenciesInDB = ref([])

onBeforeMount(async () => {
  await eduProgsStore.fetchCompetencies(route.params.id)
  await eduProgsStore.fetchCompetencyRelations(route.params.id)
  await eduProgsStore.fetchCompetencyAllRelations(route.params.id)
  selectedCompetenciesInDB.value = eduProgsStore.getCompetencies
  selectedCompetencies.value = eduProgsStore.getCompetencies
  allRelations.value = eduProgsStore.getCompetencyAllRelations
  allRelations.value.forEach(obj =>{
    obj.competency_id=obj.id
  })
  console.log(allRelations)
})

const updateZk = (e)=>{
  console.log(e[e.length-1].id)
  if(!selectedCompetenciesInDB.value.find(obj => obj.competency_id === e[e.length-1].competency_id)){
    eduProgsStore.addCompetencyToEduprog(+route.params.id, e[e.length-1].id)
    console.log("добавляем")
  }
  else if(!selectedCompetencies.value.find(obj => obj.competency_id === selectedCompetenciesInDB.value[selectedCompetenciesInDB.value.length-1].competency_id)){

    console.log("Удаляем", selectedCompetenciesInDB.value[selectedCompetenciesInDB.value.length-1].id)
  }
  console.log(selectedCompetencies)
}
</script>


<template>
  <VCard>
    <VCardText>
      <VContainer>
        <VRow>
          <VCol
            cols="12"
          >
            <VTextField
              v-model="eduProgData.name"
              label="Назва документу "
              required
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              v-model="eduProgData.education_level"
              label="Освітній рівень"
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              v-model="eduProgData.stage"
              label="Освітній ступінь"
              required
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              v-model="eduProgData.speciality"
              label="Спеціальність"
              required
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              v-model="eduProgData.knowledge_field"
              label="Галузь знань"
              required
            />
          </VCol>
          <VCol cols="12">
            <VCombobox
              v-model="selectedCompetencies"
              :items="allRelations"
              item-value="competency_id"
              item-title="competency_id"
              label="Виберіть ЗК"
              multiple
              chips
              @update:modelValue="updateZk"
            />
          </VCol>
        </VRow>
        <VRow justify="end">
          <VBtn
            class="mt-10"
            dark
            @click="saveChanges"
          >
            Зберегти зміни
          </VBtn>
        </VRow>
      </VContainer>
    </VCardText>
  </VCard>
</template>


