<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
const props = defineProps(['eduProg'])
const route = useRoute()
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
const eduProgsStore = useEduProgsStore()
const saveChanges = async () => {
  try {
    await eduProgsStore.editEduprog(eduProgData.value)
    snackbarText.value = 'Зміни успішно збережені'
  } catch {
    snackbarText.value = 'Ой, щось пішло не так'
  }
  changesSaved.value = true
}
const eduProgData = ref({})
const education_level = ref([])
const specialities = ref([])
const snackbarText = ref('')
const changesSaved = ref(false)
onMounted(async () => {
  await eduProgsStore.fetchLevelsList()
  await eduProgsStore.fetchSpecialities()
  await eduProgsStore.findEduProgById(route.params.pages)
  specialities.value = eduProgsStore.getSpecialities
  education_level.value = eduProgsStore.getLevels
  eduProgData.value=eduProgsStore.getEduProg
})
</script>

<template>
  <VCard >
    <VCardText>
      <VContainer>
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="eduProgData.name"
              label="Назва документу "
              required
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              disabled
              v-model="eduProgData.education_level"
              :items="education_level"
              item-title="level"
              item-value="level"
              label="Освітній рівень"
              required
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              disabled
              v-model="eduProgData.stage"
              label="Освітній ступінь"
              required
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              disabled
              v-model="eduProgData.speciality"
              :items="specialities"
              item-title="name"
              item-value="code"
              label="Спеціальність"
              required
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              disabled
              v-model="eduProgData.knowledge_field"
              label="Галузь знань"
              required
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              disabled
              v-model="eduProgData.approval_year"
              label="Рік затвердження"
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
    {{ snackbarText }}
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
<route lang="yaml">
name: characteristic
meta:
  navActiveLink: pages-account-settings-tab
  requiresAuth: true
</route>
