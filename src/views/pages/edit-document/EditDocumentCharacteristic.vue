
<template>
  <VCard>
    <VCardTitle>
      <span class="text-h5">Створення нової ОПП</span>
    </VCardTitle>
    <VCardText>
      <VContainer>
        <VRow>
          <VCol
            cols="12"
          >
            <VTextField
              label="Назва документу "
              required
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              label="Освітній рівень"
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              label="Освітній ступінь"
              required
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              label="Спеціальність"
              required
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              label="Галузь знань"
              required
            />
          </VCol>
        </VRow>
      </VContainer>
    </VCardText>

    <VCardActions>
      <VSpacer></VSpacer>
      <VBtn
        color="blue darken-1"
        text
        @click="dialog = false"
      >
        Скасувати
      </VBtn>
    </VCardActions>
  </VCard>
</template>
