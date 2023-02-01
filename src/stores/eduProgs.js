import { deleteData, editData, getData, postData } from '@/api/http/apiService';
import { defineStore } from 'pinia';
import router from '../router';
export const useEduProgsStore = defineStore({
  id: 'eduProgs',

  state: () => ({
    eduProgs:[],
  }),

  getters: {
    getEduProgs: state => state.eduProgs,
  },

  actions: {
    async fetchEduProgs(){
        const response = await getData('eduprogs');
        this.eduProgs = response.items;
    },
    async deleteEduProg(payload){
        await deleteData('/eduprogs/'+payload);
        this.fetchEduProgs
    },
    async createEduProg(payload){
      const response = await postData('/eduprogs/create', payload);
      console.log(response)
      this.fetchEduProgs
      router.replace('/eduprogs/'+response.id)
    },
    async editNameEduProg(payload, id){
    await editData('/eduprogs/'+ id, payload);
    this.fetchEduProgs
    },
    async findEduProgById(id){
      const response = await getData('eduprogs/'+id);
      console.log(response)
      return response
  },
  },
})
