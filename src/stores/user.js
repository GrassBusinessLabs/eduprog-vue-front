import { postData } from '@/api/api'
import { defineStore } from 'pinia'

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
      console.log(payload)
      const response = await postData('auth/login', payload)
      this.setToken(response.token)
    },

    async signUp(payload) {
      try {
        //
      } catch (err) {
        return Promise.reject(err)
      }
    },

    async logOut() {
      this.token = null
      localStorage.clear()
    },
  },
})
