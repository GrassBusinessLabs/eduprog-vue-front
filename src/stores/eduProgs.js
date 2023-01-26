import { deleteData, getData } from '@/api/http/apiService';
import { defineStore } from 'pinia';
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
  },
})
