import { defineStore } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

export const navBarStore = defineStore({
  id: 'navBar',

  state: () => ({
    navBar: [],

    getters: {
      getnavBar: state => state.eduProgs,

    },
    actions: {

    },
  }),
})
