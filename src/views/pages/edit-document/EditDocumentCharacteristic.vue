<template>
  <VCard>
    <VCardText>
      <VContainer>
        <VRow>
          <VCol
            cols="12"
          >
            <VTextField
              label="Назва документу "
              required
              v-model="eduProgData.name"
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              label="Освітній рівень"
              v-model="eduProgData.education_level"
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              label="Освітній ступінь"
              required
              v-model="eduProgData.stage"
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              label="Спеціальність"
              required
              v-model="eduProgData.speciality"
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              label="Галузь знань"
              required
              v-model="eduProgData.knowledge_field"
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
<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
const props = defineProps(['eduProg'])
const eduProgsStore = useEduProgsStore()
const saveChanges = async () => {
  await eduProgsStore.editEduprog(eduProgData)
}
const eduProgData = eduProgsStore.getEduProg
</script>

