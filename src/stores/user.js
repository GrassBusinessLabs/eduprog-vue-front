import { editData, getData, postData } from '@/api/api'
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
    getUserData: state => state.user,
  },

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },

    setUserData(userData) {
      this.user = userData
    },

    async fetchUserData() {
      const response = await getData('users');
      console.log(response)
      this.setUserData(response)
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
    async changeUserName(enteredName) {
      const newName={
        name: enteredName
      }
      const response = await editData('users', newName);
    },
  },
})
