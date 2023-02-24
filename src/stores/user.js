import { editData, getData, postData } from '@/api/http/apiService'
import { defineStore } from 'pinia'
import router from '../router'

export const useUserStore = defineStore({
  id: 'user',

  state: () => ({
    token: localStorage.getItem('token'),
    user: {},
    tokenValid: false,
  }),

  getters: {
    isUserAuth: state => !!state.token,
    getUserData: state => state.user,
    tokenIsValid: state => state.tokenValid
  },

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    async checkToken(){
      try{
        const response = await getData('users');
        if(response.id){
          this.tokenValid=true;
        }
        else{
          this.tokenValid = false;
        }
      }
      catch(err){
        this.tokenValid = false
      }
      
    },
    async fetchUserData() {
      const response = await getData('users');
      this.user = response
      return response
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

    async logout() {
      this.token = null
      localStorage.clear()
      router.replace('/login')
    },
    async changeUserName(enteredName) {
      const newName={
        name: enteredName
      }
      const response = await editData('users', newName);
    },
    async changePassword(oldPassword, newPassword) {
      const passwords={
        oldPassword: oldPassword,
        newPassword: newPassword,
      }
      const userData = await this.fetchUserData();
      await postData('auth/change-pwd', passwords)
      const response = await postData('auth/login', {
        email: userData.email,
        password: newPassword,
      })
      this.setToken(response.token)
    },
  },
})
