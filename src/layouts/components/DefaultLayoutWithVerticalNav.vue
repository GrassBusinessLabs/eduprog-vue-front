<script setup>
import DrawerContent from './DrawerContent.vue'
import { VerticalNavLayout } from '@layouts'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import { useEduProgsStore } from '@/stores/eduProgs.js'
const route = useRoute()
import { useRoute } from 'vue-router'
const eduProgsStore = useEduProgsStore()
const exportToExcel = () => {
  eduProgsStore.exportToExcel(route.params.pages)
}
const exportToDocx = () => {
  eduProgsStore.exportToDocx(route.params.pages)
}
const exportToPng = () => {
  eduProgsStore.exportToPng(route.params.pages)
}
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar>
      <!--
        <VTextField
        rounded
        prepend-inner-icon="mdi-magnify"
        density="compact"
        max-width="100px"
        class="app-bar-search d-none d-sm-block"
        /> 
      -->

      <VSpacer />
      <VMenu
        class="mr-5"
        v-if="route.params.pages"
      >
        <template #activator="{ props }">
          <VBtn
            color="primary"
            v-bind="props"
          >
            Експорт
          </VBtn>
        </template>
        <VList>
          <VListItem @click="exportToExcel"> ОПП (excel) </VListItem>
          <VListItem @click="exportToDocx"> ОПП (docx) </VListItem>
          <VListItem @click="exportToPng"> Малюнок </VListItem>
        </VList>
      </VMenu>

      <NavbarThemeSwitcher class="mr-5" />
      <UserProfile />
    </template>

    <!-- 👉 Drawer content -->
    <template #navigation-drawer-content>
      <DrawerContent />
    </template>

    <!-- 👉 Pages -->
    <div class="layout-page-content">
      <RouterView />
    </div>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss">
.app-bar-search {
  .v-input__control {
    width: 236px;
  }

  .v-field__outline__start {
    border-radius: 28px 0 0 28px !important;
    flex-basis: 20px !important;
  }

  .v-field__outline__end {
    border-radius: 0 28px 28px 0 !important;
  }
}
</style>
