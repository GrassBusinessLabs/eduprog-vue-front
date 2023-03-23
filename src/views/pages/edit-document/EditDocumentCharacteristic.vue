<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
const props = defineProps(['eduProg'])
const route = useRoute()
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
const eduProgsStore = useEduProgsStore()
const saveChanges = async () => {
  try{
    await eduProgsStore.editEduprog(eduProgData)
    snackbarText.value = "Зміни успішно збережені"
  }catch{
    snackbarText.value = "Ой, щось пішло не так"
  }
  changesSaved.value=true
}
const eduProgData = props.eduProg
const education_level = ref([])
const specialities = ref([])
const snackbarText = ref("")
const changesSaved = ref(false)
onMounted(async()=>{
  await eduProgsStore.fetchLevelsList()
  await eduProgsStore.fetchSpecialities()
  specialities.value = eduProgsStore.getSpecialities
  education_level.value= eduProgsStore.getLevels
  console.log(education_level.value)
})

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
             <VSelect
                readonly
                v-model="eduProgData.education_level"
                :items="education_level"
                item-title="level"
                item-value="level"
                label="Освітній рівень"
                required
              />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              readonly
              v-model="eduProgData.stage"
              label="Освітній ступінь"
              required
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VSelect  
                readonly
                v-model="eduProgData.speciality"
                :items="specialities"
                item-title="name"
                item-value="code"
                label="Спеціальність"
                required
              />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              readonly
              v-model="eduProgData.knowledge_field"
              label="Галузь знань"
              required
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
  <v-snackbar
      v-model="changesSaved"
      :timeout="2000"
    >
      {{snackbarText}}
      <template v-slot:actions>
        <v-btn
          color="pink"
          variant="text"
          @click="changesSaved = false"
        >
          Закрити
        </v-btn>
      </template>
    </v-snackbar>
</template>


