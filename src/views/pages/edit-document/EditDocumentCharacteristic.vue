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
const selectedZK = ref({})
const allRelations = ref([])
const generalCompetencies =ref([])

const lastGeneralCompetencies = ref([])

onBeforeMount(async () => {
  await eduProgsStore.fetchCompetencies(route.params.id)
  await eduProgsStore.fetchCompetencyRelations(route.params.id)
  await eduProgsStore.fetchCompetencyAllRelations(route.params.id)
  const relations = eduProgsStore.getCompetencyRelations.reduce((acc, cur) => {
    const competency_id = cur.competency_id
    const component_id = cur.component_id
    if (!acc[competency_id]) {
      acc[competency_id] = {}
    }
    acc[competency_id][component_id] = true

    return acc
  }, {})
  lastGeneralCompetencies.value = eduProgsStore.getCompetencies
  allRelations.value = eduProgsStore.getCompetencyAllRelations
  generalCompetencies.value = eduProgsStore.getCompetencies

})

const addRelation = (e, competencyId)=>{
  console.log('dfgd',competencyId)
  console.log('fyfghjgh',e)
  console.log('generalCompetencies',generalCompetencies)
  console.log('allRelations.value',allRelations.value)
  console.log('lastGeneralCompetencies.value',lastGeneralCompetencies.value)


  if (e) {
    console.log('e',e)
    selectedZK[competencyId]++
    eduProgsStore.createRelationToEduprog(+route.params.id, competencyId)
  }   else if (!e) {
    console.log('e',e)
    selectedZK[competencyId]--
    eduProgsStore.deleteRelationToEduprog(competencyId)
  }
}
const addRelationn = ()=>{
  const diff = ref(lastGeneralCompetencies.value.filter(obj1 => !generalCompetencies.value.find(obj2 => obj1.id === obj2.id)))
  console.log('diff',diff.value)
  console.log('lastGeneralCompetencies',lastGeneralCompetencies.value)
  console.log('generalCompetencies',generalCompetencies.value)

  const element = ref(lastGeneralCompetencies.value.includes(diff.value))

  console.log('element',diff.value.competency_id)

  diff.value.forEach(obj => {
    diff.value = obj.competency_id
    console.log('competency_id:', obj.competency_id)
  })
  console.log('element',diff.value)

  if (element) {
    console.log('iouiuiu',element.value)
    eduProgsStore.createRelationToEduprog(+route.params.id, diff.value)
  }   else if (!element) {
    eduProgsStore.deleteRelationToEduprog(diff.value)
  }
}
const updateSelectedZK = (selected, id) => {
  if (selected.length > selectedZK[id].length) {
    const addedZK = selected.find(zk => !selectedZK[id].includes(zk))
    eduProgsStore.createRelationToEduprog(+route.params.id, addedZK.id)
  } else {
    const removedZK = selectedZK[id].find(zk => !selected.includes(zk))
    eduProgsStore.deleteRelationToEduprog(removedZK.id)
  }
  selectedZK[id] = selected
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
              v-model="generalCompetencies"
              :items="allRelations.map(item => item.id)"
              item-title="competency_id"
              label="Виберіть ЗК"
              multiple
              chips
              @update:modelValue="addRelationn"
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


