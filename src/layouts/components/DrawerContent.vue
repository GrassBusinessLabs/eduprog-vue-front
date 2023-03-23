<script setup>
import upgradeBannerDark from '@/assets/images/pro/upgrade-banner-dark.png'

/*
import upgradeBannerLight from '@/assets/images/pro/upgrade-banner-light.png'
*/
import logo from '@/assets/logo.svg?raw'
const route = useRoute()
import {
  VerticalNavLink,
  VerticalNavSectionTitle,
} from '@layouts'
import { useTheme } from 'vuetify'
import { RouterLink, useRoute } from 'vue-router'
const vuetifyTheme = useTheme()

/*const upgradeBanner = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? upgradeBannerLight : upgradeBannerDark
})*/
</script>

<template>
  <!-- 👉 Nav header -->
  <div class="nav-header">
    <RouterLink
      to="/home"
      class="app-logo d-flex align-center gap-x-3 app-title-wrapper"
    >
      <!-- ℹ️ You can also use img tag or VImg here -->
      <div v-html="logo" />

      <Transition name="vertical-nav-app-title">
        <h1 class="font-weight-semibold leading-normal text-xl text-uppercase">
          Materio
        </h1>
      </Transition>
    </RouterLink>
  </div>
  <!-- 👉 Nav items -->
  <ul>
    <VerticalNavLink
      :item="{
        title: 'Головна',
        to: 'home',
        icon: { icon: 'mdi-home-outline' }
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Профіль',
        to: 'account-settings',
        icon: { icon: 'mdi-account-cog-outline' }
      }"
    />
    <ul v-if="route.params.pages">
      <VerticalNavSectionTitle :item="{ heading: 'Редагування ОПП' }" />
      <VerticalNavLink
        :item="{
          title: 'Характеристика',
          to: 'characteristic',
          icon: { icon: 'mdi-home-outline' }
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Перелік компонентів',
          to: 'components',
          icon: { icon: 'mdi-home-outline' }
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Розподіл по семестрам',
          to: 'home',
          icon: { icon: 'mdi-home-outline' }
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Послідовність ОПП',
          to: 'home',
          icon: { icon: 'mdi-home-outline' }
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Компентетності',
          to: 'home',
          icon: { icon: 'mdi-home-outline' }
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Матриця',
          to: 'matrix',
          icon: { icon: 'mdi-home-outline' }
        }"
      />
    </ul>
  </ul>

  <!-- 👉 illustration -->
<!--
  <a
  href="https://themeselection.com/item/materio-vuetify-vuejs-admin-template"
  target="_blank"
  rel="noopener noreferrer"
  >
  <img
  :src="upgradeBanner"
  alt="upgrade-banner"
  transition="scale-transition"
  class="upgrade-banner mx-auto"
  style="max-width: 230px"
  >
  </a>
-->
</template>

<style lang="scss">
// .v-navigation-drawer {
//   height: 100%;

//   .v-navigation-drawer__content {
//     display: flex;
//     flex-direction: column;

//     > ul {
//       flex-grow: 1;
//     }
//   }
// }

.upgrade-banner {
  margin-top: auto;
  // position: absolute;
  // bottom: 13px;
  // left: 50%;
  // transform: translateX(-50%);
}
</style>
