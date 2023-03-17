<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { onBeforeMount, onMounted, reactive } from 'vue'
import EditZkCompetencies from '@/views/pages/edit-document/edit-competency-tabs/EditZkCompetencies.vue'
import { useRoute } from 'vue-router'
const props = defineProps(['eduProg'])
const route = useRoute()
const eduProgsStore = useEduProgsStore()
const activeTab = ref(route.params.tab)
const tabs = [
  {
    title: 'Загальні компетентності',
    icon: 'mdi-format-list-bulleted',
    tab: 'characteristic',
  },
]
</script>

<template>
<VTabs
      :value="activeTab"
      show-arrows
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>
    <VDivider />

    <VWindow
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
      :touch="false"
    >
      <!-- Головна -->
      <VWindowItem value="characteristic">
        <EditZkCompetencies/>
      </VWindowItem>
    </VWindow>
  
  <!-- <VTable class="mt-10">
    <thead class="thead-light">
      <tr>
        <th class="text-center">
          <h3>Спеціальні передбачені закладом вищої освіти компетентності</h3>
        </th>
      </tr>
    </thead>
  </VTable>
  <VTable>
    <thead class="thead-light">
      <tr>
        <th style="text-align: center">Опис</th>
        <th style="text-align: center; width: 20%">
          <VBtn
            icon="mdi-plus"
            size="x-small"
            @click=";(dialogSpecialComp = true), (newCompetency.type = 'ВФК')"
          />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in allVfkComp"
        :key="item.id"
      >
        <td class="py-3">
          <span v-if="editIndex === item.id">
            <VTextField
              class="my-3"
              v-model="item.definition"
            />
          </span>
          <span v-else>
            {{ item.definition }}
          </span>
        </td>
        <td>
          <VRow
            no-gutters
            justify="center"
            v-if="editIndex === item.id"
          >
            <VCol align="end">
              <VBtn
                icon="mdi-check-bold"
                size="x-small"
                style="margin-right: 2%"
                @click="saveChanges(item)"
              />
            </VCol>
            <VCol>
              <VBtn
                icon="mdi-close-thick"
                size="x-small"
                @click="editIndex = null"
              />
            </VCol>
          </VRow>
          <VRow
            no-gutters
            justify="center"
            v-else
          >
            <VCol align="end">
              <VBtn
                icon="mdi-pencil"
                size="x-small"
                style="margin-right: 2%"
                @click="editIndex = item.id"
              />
            </VCol>
            <VCol>
              <VBtn
                icon="mdi-trash-can"
                size="x-small"
                @click="deleteCustomCompetency(item.id)"
              />
            </VCol>
          </VRow>
        </td>
      </tr>
    </tbody>
  </VTable>
  <VDialog
    v-model="dialogSpecialComp"
    persistent
    max-width="600"
  >
    <VCard>
      <VCardTitle>Створити нову компетентність</VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol>
              <VTextField
                label="Опис компетентності"
                required
                v-model="newCompetency.definition"
              />
            </VCol>
          </VRow>
        </VContainer>

        <VCardActions>
          <VSpacer />
          <VBtn
            text
            @click="dialogSpecialComp = false"
          >
            Відмінити
          </VBtn>
          <VBtn
            text
            @click="createCompetency"
          >
            Створити
          </VBtn>
        </VCardActions>
      </VCardText>
    </VCard>
  </VDialog> -->
</template>

<style></style>
