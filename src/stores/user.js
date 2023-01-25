import { postData } from '@/api/http/apiService'
import { defineStore } from 'pinia'
import router from '../router'

export const useUserStore = defineStore({
  id: 'user',

  state: () => ({
    token: localStorage.getItem('token'),
    user: {}
  }),

  getters: {
    isUserAuth: state => !!state.token,
  },

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },

    setUserData(userData) {
      //
    },

    async login(payload) {
      const response = await postData('auth/login', payload)
      this.setToken(response.token)
      router.replace('/')
    },

    async signUp(payload) {
      const response = await postData('auth/register', payload)
      this.setToken(response.token)
      router.replace('/')
    },

    async logOut() {
      this.token = null
      localStorage.clear()
    },
  },
})
